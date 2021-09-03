FROM node:16.8.0-alpine3.13 AS base

RUN apk add dumb-init

ENV NODE_ENV production

WORKDIR /app

COPY ./ ./

RUN npm ci --production

EXPOSE 3000

USER node

CMD ["dumb-init", "node", "index.js"]
