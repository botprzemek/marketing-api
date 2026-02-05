FROM node:25.6-slim AS builder

WORKDIR /app

COPY --chown=nonroot:nonroot package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline

COPY --chown=nonroot:nonroot . .

RUN npm run build



FROM cgr.dev/chainguard/node:latest AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

COPY --from=builder --chown=nonroot:nonroot /app/.output ./.output

EXPOSE 3000

CMD [".output/server/index.mjs"]
