FROM rust:slim AS base

RUN cargo install cargo-chef



FROM base AS planner

WORKDIR /app
COPY Cargo.toml Cargo.lock ./
RUN cargo chef prepare --recipe-path recipe.json
RUN cargo chef cook --release --recipe-path recipe.json



FROM base AS builder

WORKDIR /app
COPY . .
RUN cargo build --release --bin oauth-api



FROM scratch AS runner

WORKDIR /app
COPY --from=builder /app/target/release/oauth-api /usr/local/bin/oauth-api

ENV APP_HOST=0.0.0.0
ENV APP_PORT=3000
EXPOSE 3000

CMD ["/usr/local/bin/oauth-api"]
