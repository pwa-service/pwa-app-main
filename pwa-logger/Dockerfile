FROM node:22-alpine AS base
WORKDIR /workspace
RUN apk add --no-cache python3 make g++ libc6-compat

FROM base AS deps
WORKDIR /workspace
COPY ./pwa-logger/package*.json ./pwa-logger/
COPY ./pwa-prisma/package*.json ./pwa-prisma/
COPY ./pwa-shared/package*.json ./pwa-shared/

WORKDIR /workspace/pwa-logger
RUN npm ci && npm i -g @nestjs/cli

WORKDIR /workspace/pwa-prisma
RUN npm install

WORKDIR /workspace/pwa-shared
RUN npm install

FROM deps AS build
WORKDIR /workspace
COPY ./pwa-logger ./pwa-logger
COPY ./pwa-prisma ./pwa-prisma
COPY ./pwa-shared ./pwa-shared

WORKDIR /workspace/pwa-prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

WORKDIR /workspace/pwa-logger
RUN mkdir -p ./prisma && cp ../pwa-prisma/prisma/schema.prisma ./prisma/schema.prisma
RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npx nest build -p tsconfig.json

FROM node:22-alpine AS runner
WORKDIR /workspace/pwa-logger
ENV NODE_ENV=production

COPY --from=build /workspace/pwa-logger/dist         ./dist
COPY --from=build /workspace/pwa-logger/node_modules ./node_modules
COPY ./pwa-logger/package*.json ./

CMD ["node", "dist/pwa-logger/src/main.js"]