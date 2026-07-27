FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

COPY entrypoint.mjs ./

EXPOSE 3001

ENV PORT=3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s \
  CMD wget -qO- http://localhost:3001/health || exit 1

CMD ["node", "entrypoint.mjs"]
