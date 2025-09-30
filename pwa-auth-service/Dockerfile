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
RUN npx nest build auth-service
RUN ls -R dist/apps || true

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache curl
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/protos ./protos
ENV PORT=4000 AUTH_GRPC_URL=0.0.0.0:50051 AUTH_ISSUER=https://auth.local/ AUTH_AUDIENCE=api AUTH_ACCESS_TTL=900 AUTH_REFRESH_TTL=604800
EXPOSE 4000 50051
CMD ["node", "dist/apps/auth-service/main.js"]
