FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY nest-cli.json tsconfig*.json ./
COPY apps ./apps
COPY protos ./protos
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app /app
RUN npx nest build event-handler
RUN ls -R dist/apps || true

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache curl
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/protos ./protos

ENV PORT=4200 EVENT_HANDLER_GRPC_URL=0.0.0.0:50053
EXPOSE 4200 50053
CMD ["node", "dist/apps/event-handler/main.js"]
