FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --only=production

FROM base AS builder
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN ./node_modules/.bin/prisma generate
RUN npm run build

FROM base
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/src/lib ./src/lib
COPY --from=builder /app/data ./data

EXPOSE 4000
CMD ["sh", "-c", "./node_modules/.bin/prisma db push --accept-data-loss && mkdir -p /data/uploads && cp -n /app/data/reports.json /data/reports.json 2>/dev/null || true && node dist/main.js"]
