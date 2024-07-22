FROM alpine:3.9

RUN set -x && \
    apk add --no-cache -t .deps ca-certificates && \
    # Install glibc on Alpine (required by docker-compose) from
    # https://github.com/sgerrand/alpine-pkg-glibc
    # See also https://github.com/gliderlabs/docker-alpine/issues/11
    wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.29-r0/glibc-2.29-r0.apk && \
    apk add glibc-2.29-r0.apk && \
    rm glibc-2.29-r0.apk && \
    apk del --purge .deps

# Install ngrok
ARG TARGETARCH
RUN set -x \
    && case ${TARGETARCH} in \
        "amd64") NGROK_URL="https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz" ;; \
        "arm64") NGROK_URL="https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-arm64.tgz" ;; \
        *) echo "unsupported architecture: ${TARGETARCH}" && exit 1 ;; \
    esac \
    && apk add --no-cache curl \
    && curl -Lo /ngrok.tgz ${NGROK_URL} \
    && tar xvzf /ngrok.tgz -C /bin \
    && rm -f /ngrok.tgz \
    # Create non-root user.
    && adduser -h /home/ngrok -D -u 6737 ngrok
RUN ngrok --version

# Add config script.
COPY --chown=ngrok ngrok.yml /home/ngrok/.ngrok2/
COPY entrypoint.sh /

USER ngrok
ENV USER=ngrok

CMD ["/entrypoint.sh"]
