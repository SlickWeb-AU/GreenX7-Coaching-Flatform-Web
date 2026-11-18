# =============================================================================
# GreenX7 FE — multi-stage build
# Image cuối chỉ chứa .next/standalone + static, chạy bằng user không phải root.
# =============================================================================

# ---------- deps ----------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ---------- build ----------
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Biến NEXT_PUBLIC_ bị Next.js GẮN CỨNG vào JS lúc build — đặt trong .env của
# container lúc chạy KHÔNG có tác dụng. Truyền qua build-arg (xem deploy.yml).
# Các biến còn lại (API_URL, APP_URL…) vẫn đổi được lúc chạy container.
ARG NEXT_PUBLIC_GREENX7_URL=https://www.greenx7.com
ENV NEXT_PUBLIC_GREENX7_URL=$NEXT_PUBLIC_GREENX7_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------- runtime ----------
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apk add --no-cache dumb-init curl \
 && addgroup -S -g 1001 nodejs \
 && adduser -S -u 1001 -G nodejs nextjs

# standalone đã gói sẵn server.js + node_modules tối thiểu
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/api/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
