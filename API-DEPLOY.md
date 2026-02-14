# A-Z API Deployment

## 1) Local Run
1. Install Node.js 18+.
2. In project root:
   - `copy .env.example .env`
   - edit `.env` and set `DEEPSEEK_API_KEY`.
3. Install and start:
   - `npm install`
   - `npm start`
4. Open:
   - `http://localhost:8787/generator-mvp.html`

The frontend calls `/api/az-generate-ai` on the same host, so no extra config is needed.

## 2) Deploy to Railway (recommended)
1. Push this folder to GitHub.
2. Create new Railway project from the repo.
3. Add environment variables:
   - `DEEPSEEK_API_KEY`
   - `DEEPSEEK_MODEL` (optional, e.g. `deepseek-chat`)
   - `DEEPSEEK_BASE_URL` (optional, default `https://api.deepseek.com`)
   - `PORT` (optional; Railway usually sets it automatically)
4. Start command:
   - `npm start`
5. After deploy, open:
   - `https://<your-domain>/generator-mvp.html`

## 3) Deploy to Render
1. New Web Service from GitHub repo.
2. Build command: `npm install`
3. Start command: `npm start`
4. Add env vars:
   - `DEEPSEEK_API_KEY`
   - `DEEPSEEK_MODEL` (optional)
   - `DEEPSEEK_BASE_URL` (optional)
5. Visit:
   - `https://<your-service>.onrender.com/generator-mvp.html`

## 4) API Check
- Health: `GET /healthz`
- Generate: `POST /api/az-generate-ai`

## 5) Notes
- Server now uses DeepSeek by default.
- Backward compatibility is kept: if `DEEPSEEK_API_KEY` is empty, it will fallback to `OPENAI_API_KEY`.
