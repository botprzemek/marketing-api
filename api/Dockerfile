FROM rust:1.93-slim AS builder

RUN cargo install cargo-chef sccache --locked

ENV RUSTC_WRAPPER=sccache
ENV SCCACHE_DIR=/sccache

WORKDIR /app

COPY Cargo.toml Cargo.lock ./

RUN cargo chef prepare --recipe-path recipe.json

RUN --mount=type=cache,target=/usr/local/cargo/registry,sharing=locked \
    --mount=type=cache,target=/usr/local/cargo/git,sharing=locked \
    --mount=type=cache,target=$SCCACHE_DIR,sharing=locked \
    cargo chef cook --release --recipe-path recipe.json

COPY . .

RUN --mount=type=cache,target=/usr/local/cargo/registry,sharing=locked \
    --mount=type=cache,target=/usr/local/cargo/git,sharing=locked \
    --mount=type=cache,target=$SCCACHE_DIR,sharing=locked \
    cargo build --release --bin api



FROM cgr.dev/chainguard/glibc-dynamic AS runner

WORKDIR /app

ENV SERVER_HOST=0.0.0.0
ENV SERVER_PORT=3000

COPY --from=builder --chown=nonroot:nonroot /app/target/release/api /usr/local/bin/api

EXPOSE 3000

CMD ["/usr/local/bin/api"]
