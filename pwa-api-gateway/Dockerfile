FROM node:22-alpine AS base
WORKDIR /workspace
RUN apk add --no-cache python3 make g++ libc6-compat

FROM base AS deps
WORKDIR /workspace

COPY ./pwa-api-gateway/package*.json ./pwa-api-gateway/
COPY ./pwa-shared/package*.json      ./pwa-shared/
COPY ./pwa-protos/package*.json      ./pwa-protos/

WORKDIR /workspace/pwa-api-gateway
RUN npm install && npm install -g @nestjs/cli

WORKDIR /workspace/pwa-shared
RUN npm install

FROM deps AS build
WORKDIR /workspace

COPY ./pwa-api-gateway ./pwa-api-gateway
COPY ./pwa-shared      ./pwa-shared
COPY ./pwa-protos      ./pwa-protos

WORKDIR /workspace/pwa-api-gateway
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /workspace/pwa-api-gateway/dist ./dist
COPY --from=build /workspace/pwa-api-gateway/package*.json ./
RUN npm install --omit=dev
COPY --from=build /workspace/pwa-protos/protos ./protos

CMD ["node", "dist/pwa-api-gateway/src/main.js"]
