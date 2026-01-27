# ---------- Build stage ----------
FROM rust:1.92-bookworm AS builder

WORKDIR /app

# Cache dependencies
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -rf src

# Build actual app
COPY . .
RUN cargo build --release

# ---------- Runtime stage ----------
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/target/release/oauth-api /usr/local/bin/oauth-api

ENV APP_HOST=0.0.0.0
ENV APP_PORT=3000

EXPOSE 3000

CMD ["oauth-api"]
