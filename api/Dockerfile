FROM cgr.dev/chainguard/rust:latest AS builder

COPY --chown=nonroot:nonroot Cargo.toml Cargo.lock ./
RUN mkdir src
RUN echo "fn main() {}" > src/main.rs
RUN cargo build --release

WORKDIR /app
COPY --chown=nonroot:nonroot . .
RUN cargo build --release --bin oauth-api



FROM cgr.dev/chainguard/glibc-dynamic AS runner

WORKDIR /app
COPY --from=builder --chown=nonroot:nonroot /app/target/release/oauth-api /usr/local/bin/oauth-api

ENV APP_HOST=0.0.0.0
ENV APP_PORT=3000
EXPOSE 3000

CMD ["/usr/local/bin/oauth-api"]
