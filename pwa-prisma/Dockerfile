FROM node:22-alpine3.22

WORKDIR /app/pwa-prisma

RUN apk add --no-cache bash postgresql15-client openssl

COPY ./pwa-prisma/package*.json ./
RUN npm ci --legacy-peer-deps

COPY ./pwa-prisma/prisma ./prisma

RUN npx prisma generate --schema=/app/pwa-prisma/prisma/schema.prisma

ENV PRISMA_IGNORE_ENV_FILES=1
ENV PRISMA_SCHEMA=/app/pwa-prisma/prisma/schema.prisma

CMD ["npx", "prisma", "migrate", "deploy", "--schema=/app/pwa-prisma/prisma/schema.prisma"]
