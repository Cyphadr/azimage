const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = Number(process.env.PORT || 8787);
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || "";
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || process.env.OPENAI_MODEL || "deepseek-chat";
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

function normalizeLetter(v) {
  const s = String(v || "").trim().toUpperCase();
  return /^[A-Z]$/.test(s) ? s : "";
}

function pick(obj, keys, fallback = "") {
  for (const k of keys) {
    if (obj && obj[k] != null) return String(obj[k]).trim();
  }
  return fallback;
}

function normalizeItemsMap(raw) {
  const root = raw && (raw.items || raw.data || raw.result || raw);
  const out = {};
  if (Array.isArray(root)) {
    for (const it of root) {
      const letter = normalizeLetter(pick(it, ["letter", "L"]));
      if (!letter) continue;
      out[letter] = {
        en: pick(it, ["en", "word", "english"]),
        zh: pick(it, ["zh", "translation", "chinese"])
      };
    }
    return out;
  }
  if (root && typeof root === "object") {
    for (const [key, value] of Object.entries(root)) {
      const letter = normalizeLetter(key);
      if (!letter || !value || typeof value !== "object") continue;
      out[letter] = {
        en: pick(value, ["en", "word", "english"]),
        zh: pick(value, ["zh", "translation", "chinese"])
      };
    }
  }
  return out;
}

function buildSystemPrompt() {
  return [
    "You generate A-Z word entries for fiction prompts.",
    "Return ONLY JSON object mapping letters to {en, zh}.",
    "Use keywords, style, and styleHint together to infer one coherent theme.",
    "Rules:",
    "1) Each 'en' must start with its letter (A->A..., B->B...).",
    "2) One English word only (not a phrase), and one Chinese translation.",
    "3) Do NOT duplicate lockedItems.",
    "4) Prefer not to repeat previousTargetItems/existingItems, but if impossible you may reuse.",
    "5) When rerollAttempt or rerollSalt is provided, generate a fresh variant in the same theme.",
    "6) No markdown, no explanation, no extra keys."
  ].join("\n");
}

function buildUserPrompt(payload) {
  const clean = {
    keywords: Array.isArray(payload.keywords) ? payload.keywords.map((x) => String(x || "").trim()).filter(Boolean) : [],
    styleHint: String(payload.styleHint || "").trim(),
    style: String(payload.style || "").trim(),
    theme: String(payload.theme || "").trim(),
    requestNonce: Number(payload.requestNonce || 0),
    rerollAttempt: Number(payload.rerollAttempt || 0),
    rerollSalt: String(payload.rerollSalt || ""),
    targetLetters: Array.isArray(payload.targetLetters) ? payload.targetLetters.map(normalizeLetter).filter(Boolean) : [],
    lockedItems: Array.isArray(payload.lockedItems) ? payload.lockedItems : [],
    previousTargetItems: Array.isArray(payload.previousTargetItems) ? payload.previousTargetItems : [],
    existingItems: Array.isArray(payload.existingItems) ? payload.existingItems : []
  };
  return JSON.stringify(clean, null, 2);
}

async function callDeepSeekForWords(payload) {
  const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      temperature: 1.05,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: buildUserPrompt(payload) }
      ]
    })
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`DEEPSEEK_HTTP_${response.status} ${detail.slice(0, 300)}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("DEEPSEEK_EMPTY_CONTENT");
  }
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("DEEPSEEK_NON_JSON_CONTENT");
  }
  return normalizeItemsMap(parsed);
}

app.post("/api/az-generate-ai", async (req, res) => {
  try {
    const payload = req.body || {};
    const targetLetters = Array.isArray(payload.targetLetters)
      ? payload.targetLetters.map(normalizeLetter).filter(Boolean)
      : [];

    if (!targetLetters.length) {
      return res.status(400).json({ error: "targetLetters is required", items: {} });
    }
    if (!DEEPSEEK_API_KEY) {
      return res.status(500).json({
        error: "DEEPSEEK_API_KEY is not set",
        items: {},
        meta: { model: DEEPSEEK_MODEL }
      });
    }

    const items = await callDeepSeekForWords({ ...payload, targetLetters });
    return res.json({
      items,
      meta: {
        model: DEEPSEEK_MODEL,
        generatedCount: Object.keys(items).length,
        targetCount: targetLetters.length
      }
    });
  } catch (err) {
    return res.status(500).json({
      error: "AI_GENERATE_FAILED",
      message: String(err && err.message ? err.message : err),
      items: {}
    });
  }
});

app.get("/healthz", (_req, res) => {
  res.json({ ok: true, model: DEEPSEEK_MODEL, baseUrl: DEEPSEEK_BASE_URL });
});

app.listen(PORT, () => {
  console.log(`A-Z server running: http://localhost:${PORT}`);
});
