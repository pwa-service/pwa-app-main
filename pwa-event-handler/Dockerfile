FROM node:22-alpine AS base
WORKDIR /workspace
RUN apk add --no-cache python3 make g++ libc6-compat


FROM base AS deps
WORKDIR /workspace

COPY ./pwa-event-handler/package*.json ./pwa-event-handler/
COPY ./pwa-prisma/package*.json      ./pwa-prisma/
COPY ./pwa-shared/package*.json      ./pwa-shared/
COPY ./pwa-protos/package*.json      ./pwa-protos/

WORKDIR /workspace/pwa-event-handler
RUN npm ci && npm i -g @nestjs/cli

WORKDIR /workspace/pwa-prisma
RUN npm ci

WORKDIR /workspace/pwa-shared
RUN npm ci

FROM deps AS build
WORKDIR /workspace

COPY ./pwa-event-handler ./pwa-event-handler
COPY ./pwa-prisma       ./pwa-prisma
COPY ./pwa-shared       ./pwa-shared
COPY ./pwa-protos       ./pwa-protos

WORKDIR /workspace/pwa-shared
RUN npm ci

WORKDIR /workspace/pwa-prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

WORKDIR /workspace/pwa-event-handler
RUN mkdir -p ./prisma \
 && cp ../pwa-prisma/prisma/schema.prisma ./prisma/schema.prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

RUN mkdir -p ./protos \
 && cp -r ../pwa-protos/protos/* ./protos/
RUN npx nest build -p tsconfig.json

FROM node:22-alpine AS runner
WORKDIR /workspace/pwa-event-handler
ENV NODE_ENV=production

COPY --from=build /workspace/pwa-event-handler/dist         ./dist
COPY --from=build /workspace/pwa-event-handler/node_modules ./node_modules
COPY ./pwa-event-handler/package*.json ./
COPY --from=build /workspace/pwa-event-handler/protos       ./protos

CMD ["node", "dist/pwa-event-handler/src/main.js"]

