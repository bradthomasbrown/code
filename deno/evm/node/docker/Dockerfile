FROM denoland/deno:alpine-1.43.1
RUN apk --update add git tar
WORKDIR /evm/lib
COPY ./lib .
WORKDIR /evm/node/docker
COPY ./node/docker .
RUN \
    deno run -A prep.ts && \
    deno cache serve.ts
CMD deno run -A serve.ts