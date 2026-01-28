FROM cgr.dev/chainguard/rust:latest AS builder

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
