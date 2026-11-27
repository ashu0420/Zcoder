FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    g++ \
    python3 \
    nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /sandbox
USER 1000:1000
