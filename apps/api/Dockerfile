# Prod-образ API. Контекст сборки = корень репо (нужен доступ к packages/).
#   docker build -f apps/api/Dockerfile -t opportunity-hub-api .
FROM node:22-alpine
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate
WORKDIR /workspace

# Только манифесты — для кэширования слоя установки.
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY packages ./packages
COPY apps/api ./apps/api

RUN pnpm install --filter @repo/api --frozen-lockfile --ignore-scripts
RUN cd apps/api && npm run prisma:generate
RUN cd apps/api && npm run build && npm run postBuild

WORKDIR /workspace/apps/api
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/app.js"]
