FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY packages/domain/package.json packages/domain/package.json
COPY packages/domain/tsconfig.json packages/domain/tsconfig.json
RUN pnpm install --filter @nativos/api... --no-frozen-lockfile

FROM deps AS build
COPY apps/api apps/api
COPY packages/domain packages/domain
RUN pnpm --filter @nativos/domain build
RUN pnpm --filter @nativos/api build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /app/packages/domain/dist ./packages/domain/dist
COPY packages/domain/package.json ./packages/domain/package.json
COPY --from=build /app/apps/api/dist apps/api/dist
COPY apps/api/package.json apps/api/package.json
EXPOSE 4000
CMD ["node", "apps/api/dist/server.js"]
