# Prod-образ парсеров. Контекст сборки = корень репо (нужен доступ к packages/).
#   docker build -f apps/parsers/Dockerfile -t opportunity-hub-parsers .
FROM node:22-alpine
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate
WORKDIR /workspace

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY packages ./packages
COPY apps/parsers ./apps/parsers

RUN pnpm install --filter @repo/parsers --frozen-lockfile --ignore-scripts
RUN cd apps/parsers && npm run build

WORKDIR /workspace/apps/parsers
ENV NODE_ENV=production
EXPOSE 3333
CMD ["node", "dist/app.js"]
