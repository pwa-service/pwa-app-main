FROM node:22-alpine AS base
WORKDIR /workspace
RUN apk add --no-cache python3 make g++ libc6-compat openssl

FROM base AS deps
WORKDIR /workspace

COPY ./pwa-org-service/package*.json ./pwa-org-service/
COPY ./pwa-prisma/package*.json      ./pwa-prisma/
COPY ./pwa-shared/package*.json      ./pwa-shared/
COPY ./pwa-protos/package*.json      ./pwa-protos/

WORKDIR /workspace/pwa-org-service
RUN npm ci --legacy-peer-deps && npm i -g @nestjs/cli

WORKDIR /workspace/pwa-prisma
RUN npm ci --legacy-peer-deps

WORKDIR /workspace/pwa-shared
RUN npm ci --legacy-peer-deps

FROM deps AS build
WORKDIR /workspace

COPY ./pwa-org-service ./pwa-org-service
COPY ./pwa-prisma       ./pwa-prisma
COPY ./pwa-shared       ./pwa-shared
COPY ./pwa-protos       ./pwa-protos



WORKDIR /workspace/pwa-prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

WORKDIR /workspace/pwa-org-service
RUN mkdir -p ./prisma \
    && cp ../pwa-prisma/prisma/schema.prisma ./prisma/schema.prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

RUN mkdir -p ./protos \
    && cp -r ../pwa-protos/protos/* ./protos/
RUN npx nest build -p tsconfig.json

FROM node:22-alpine AS runner
WORKDIR /workspace/pwa-org-service
ENV NODE_ENV=production

RUN apk add --no-cache openssl

COPY --from=build /workspace/pwa-org-service/dist         ./dist
COPY --from=build /workspace/pwa-org-service/node_modules ./node_modules
COPY ./pwa-org-service/package*.json ./
COPY --from=build /workspace/pwa-org-service/protos       ./protos

CMD ["node", "dist/pwa-org-service/src/main.js"]