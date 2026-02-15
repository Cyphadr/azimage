FROM mcr.microsoft.com/playwright:v1.58.2-jammy

WORKDIR /app

# Browsers are pre-bundled in the base image; skip re-download at npm install time.
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 8787

CMD ["npm", "start"]
