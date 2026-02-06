FROM rust:1.93-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    ca-certificates \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN cargo install cargo-chef --locked

COPY . .

RUN cargo chef prepare --recipe-path recipe.json

RUN --mount=type=cache,target=/usr/local/cargo/registry,sharing=locked \
    --mount=type=cache,target=/usr/local/cargo/git,sharing=locked \
    cargo chef cook --release --recipe-path recipe.json

RUN --mount=type=cache,target=/usr/local/cargo/registry,sharing=locked \
    --mount=type=cache,target=/usr/local/cargo/git,sharing=locked \
    cargo build --release --bin api



FROM cgr.dev/chainguard/glibc-dynamic AS runner

WORKDIR /app

ENV SERVER_HOST=0.0.0.0
ENV SERVER_PORT=3000

COPY --from=builder --chown=nonroot:nonroot /app/target/release/api /usr/local/bin/api

EXPOSE 3000

CMD ["/usr/local/bin/api"]
