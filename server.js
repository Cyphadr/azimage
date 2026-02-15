const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = Number(process.env.PORT || 8787);
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || "";
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || process.env.OPENAI_MODEL || "deepseek-chat";
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
const RENDER_DEFAULT_PAGE = process.env.RENDER_DEFAULT_PAGE || "/generator-mvp.stability.html";
const RENDER_DEFAULT_SELECTOR = process.env.RENDER_DEFAULT_SELECTOR || "#letterFrame";
const RENDER_TIMEOUT_MS = Number(process.env.RENDER_TIMEOUT_MS || 45000);
const RENDER_WAIT_MS = Number(process.env.RENDER_WAIT_MS || 140);

app.use(cors());
app.use(express.json({ limit: "8mb" }));
app.use(express.static(__dirname));

let screenshotEngine = null;
let renderBusy = false;

function getScreenshotEngine() {
  if (screenshotEngine) return screenshotEngine;
  try {
    const { chromium } = require("playwright");
    screenshotEngine = { type: "playwright", chromium };
    return screenshotEngine;
  } catch (_err) {}
  try {
    const puppeteer = require("puppeteer");
    screenshotEngine = { type: "puppeteer", puppeteer };
    return screenshotEngine;
  } catch (_err) {}
  return null;
}

function normalizeNumber(raw, fallback, min, max) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function normalizePagePath(rawPath) {
  const v = String(rawPath || "").trim() || RENDER_DEFAULT_PAGE;
  if (!v.startsWith("/")) return null;
  if (v.includes("..")) return null;
  if (!/^[\/A-Za-z0-9._-]+$/.test(v)) return null;
  return v;
}

function sanitizeFilename(name, fallback = "render-shot.png") {
  const base = String(name || "")
    .replace(/[\r\n]+/g, " ")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "_");
  if (!base) return fallback;
  return base.toLowerCase().endsWith(".png") ? base : `${base}.png`;
}

function encodeRFC5987ValueChars(str) {
  return encodeURIComponent(String(str || "")).replace(
    /['()*]/g,
    (ch) => `%${ch.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

function toAsciiFilename(name, fallback = "render-shot.png") {
  const ascii = String(name || "")
    .replace(/[^\x20-\x7E]+/g, "_")
    .replace(/["\\;]/g, "_")
    .replace(/\s+/g, " ")
    .trim();
  const out = ascii && !/^[_.-]+$/.test(ascii) ? ascii : fallback;
  return out.toLowerCase().endsWith(".png") ? out : `${out}.png`;
}

function buildContentDisposition(filename) {
  const safe = sanitizeFilename(filename, "render-shot.png");
  const ascii = toAsciiFilename(safe, "render-shot.png");
  const utf8 = encodeRFC5987ValueChars(safe);
  return `attachment; filename="${ascii}"; filename*=UTF-8''${utf8}`;
}

async function screenshotWithPlaywright(engine, cfg) {
  const browser = await engine.chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  try {
    const context = await browser.newContext({
      viewport: cfg.viewport,
      deviceScaleFactor: cfg.scale
    });
    const page = await context.newPage();
    await page.goto(cfg.url, { waitUntil: "networkidle", timeout: cfg.timeoutMs });
    await page.waitForSelector(cfg.selector, { timeout: cfg.timeoutMs });
    if (cfg.payload && typeof cfg.payload === "object") {
      const result = await page.evaluate(async (packet) => {
        if (typeof window.__AZ_TEST_SET_STATE !== "function") {
          return { ok: false, error: "NO_TEST_BRIDGE" };
        }
        return await window.__AZ_TEST_SET_STATE(packet);
      }, { progress: cfg.payload, options: cfg.options || {} });
      if (!result || result.ok !== true) {
        throw new Error(`TEST_BRIDGE_FAILED ${(result && result.error) || ""}`.trim());
      }
      await page.waitForTimeout(cfg.waitMs);
    }
    const target = page.locator(cfg.selector).first();
    return await target.screenshot({ type: "png" });
  } finally {
    await browser.close();
  }
}

async function screenshotWithPuppeteer(engine, cfg) {
  const browser = await engine.puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: cfg.viewport.width,
      height: cfg.viewport.height,
      deviceScaleFactor: cfg.scale
    });
    await page.goto(cfg.url, { waitUntil: "networkidle2", timeout: cfg.timeoutMs });
    await page.waitForSelector(cfg.selector, { timeout: cfg.timeoutMs });
    if (cfg.payload && typeof cfg.payload === "object") {
      const result = await page.evaluate(async (packet) => {
        if (typeof window.__AZ_TEST_SET_STATE !== "function") {
          return { ok: false, error: "NO_TEST_BRIDGE" };
        }
        return await window.__AZ_TEST_SET_STATE(packet);
      }, { progress: cfg.payload, options: cfg.options || {} });
      if (!result || result.ok !== true) {
        throw new Error(`TEST_BRIDGE_FAILED ${(result && result.error) || ""}`.trim());
      }
      await page.waitForTimeout(cfg.waitMs);
    }
    const handle = await page.$(cfg.selector);
    if (!handle) throw new Error("SELECTOR_NOT_FOUND");
    return await handle.screenshot({ type: "png" });
  } finally {
    await browser.close();
  }
}

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

app.get("/api/render-shot/health", (_req, res) => {
  const engine = getScreenshotEngine();
  res.json({
    ok: !!engine,
    engine: engine ? engine.type : null,
    page: RENDER_DEFAULT_PAGE,
    selector: RENDER_DEFAULT_SELECTOR
  });
});

app.post("/api/render-shot", async (req, res) => {
  if (renderBusy) {
    return res.status(429).json({ error: "RENDER_BUSY", message: "已有截图任务运行中" });
  }

  const engine = getScreenshotEngine();
  if (!engine) {
    return res.status(500).json({
      error: "NO_SCREENSHOT_ENGINE",
      message: "未检测到 playwright 或 puppeteer。请先执行 npm i -D playwright && npx playwright install chromium"
    });
  }

  const pagePath = normalizePagePath(req.body && req.body.pagePath);
  if (!pagePath) {
    return res.status(400).json({ error: "INVALID_PAGE_PATH" });
  }

  const selector = String((req.body && req.body.selector) || RENDER_DEFAULT_SELECTOR).trim();
  if (!selector) {
    return res.status(400).json({ error: "INVALID_SELECTOR" });
  }

  const viewportRaw = (req.body && req.body.viewport) || {};
  const viewport = {
    width: normalizeNumber(viewportRaw.width, 1440, 390, 3200),
    height: normalizeNumber(viewportRaw.height, 2000, 640, 6400)
  };
  const scale = normalizeNumber(req.body && req.body.scale, 2, 1, 3);
  const timeoutMs = normalizeNumber(req.body && req.body.timeoutMs, RENDER_TIMEOUT_MS, 5000, 120000);
  const waitMs = normalizeNumber(req.body && req.body.waitMs, RENDER_WAIT_MS, 0, 3000);
  const payload = req.body && typeof req.body.payload === "object" ? req.body.payload : null;
  const options = req.body && typeof req.body.options === "object" ? req.body.options : {};
  const filename = sanitizeFilename(req.body && req.body.filename, "render-shot.png");

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const glue = pagePath.includes("?") ? "&" : "?";
  const url = `${baseUrl}${pagePath}${glue}pwshot=${Date.now()}`;

  renderBusy = true;
  try {
    const cfg = { url, selector, viewport, scale, timeoutMs, payload, options, waitMs };
    const png = engine.type === "playwright"
      ? await screenshotWithPlaywright(engine, cfg)
      : await screenshotWithPuppeteer(engine, cfg);
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Disposition", buildContentDisposition(filename));
    return res.send(png);
  } catch (err) {
    return res.status(500).json({
      error: "RENDER_SHOT_FAILED",
      message: String(err && err.message ? err.message : err)
    });
  } finally {
    renderBusy = false;
  }
});

app.get("/healthz", (_req, res) => {
  res.json({ ok: true, model: DEEPSEEK_MODEL, baseUrl: DEEPSEEK_BASE_URL });
});

app.listen(PORT, () => {
  console.log(`A-Z server running: http://localhost:${PORT}`);
});
