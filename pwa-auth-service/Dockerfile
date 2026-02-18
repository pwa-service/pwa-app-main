FROM node:22-alpine AS base
WORKDIR /workspace
RUN apk add --no-cache python3 make g++ libc6-compat

FROM base AS deps
WORKDIR /workspace

COPY ./pwa-auth-service/package*.json ./pwa-auth-service/
COPY ./pwa-prisma/package*.json      ./pwa-prisma/
COPY ./pwa-shared/package*.json      ./pwa-shared/
COPY ./pwa-protos/package*.json      ./pwa-protos/

WORKDIR /workspace/pwa-auth-service
RUN npm ci && npm i -g @nestjs/cli

WORKDIR /workspace/pwa-prisma
RUN npm ci

WORKDIR /workspace/pwa-shared
RUN npm ci

FROM deps AS build
WORKDIR /workspace

COPY ./pwa-auth-service ./pwa-auth-service
COPY ./pwa-prisma       ./pwa-prisma
COPY ./pwa-shared       ./pwa-shared
COPY ./pwa-protos       ./pwa-protos
COPY ./tsconfig.json ./tsconfig.json

WORKDIR /workspace/pwa-prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

WORKDIR /workspace/pwa-auth-service
RUN mkdir -p ./prisma \
    && cp ../pwa-prisma/prisma/schema.prisma ./prisma/schema.prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

RUN mkdir -p ./protos \
    && cp -r ../pwa-protos/protos/* ./protos/
RUN npx nest build -p tsconfig.json

FROM node:22-alpine AS runner
WORKDIR /workspace/pwa-auth-service

COPY --from=build /workspace/pwa-auth-service/dist         ./dist
COPY --from=build /workspace/pwa-auth-service/node_modules ./node_modules
COPY ./pwa-auth-service/package*.json ./
COPY --from=build /workspace/pwa-auth-service/protos ./protos

CMD ["node", "dist/pwa-auth-service/src/main.js"]
