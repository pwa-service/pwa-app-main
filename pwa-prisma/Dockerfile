FROM node:22-alpine

WORKDIR /app/pwa-prisma

RUN apk add --no-cache bash postgresql15-client

COPY ./pwa-prisma/package*.json ./
RUN npm i

COPY ./pwa-prisma/prisma ./prisma


ENV PRISMA_IGNORE_ENV_FILES=1
ENV PRISMA_SCHEMA=/app/pwa-prisma/prisma/schema.prisma

CMD ["npx", "prisma", "migrate", "deploy", "--schema=/app/pwa-prisma/prisma/schema.prisma"]