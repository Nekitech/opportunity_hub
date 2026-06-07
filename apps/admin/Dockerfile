# Prod-образ админки (Next.js standalone, pnpm-workspace). Контекст = корень репо:
#   docker build -f apps/admin/Dockerfile -t opportunity-hub-admin .
FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate
WORKDIR /workspace

# NEXT_PUBLIC_* инлайнится в клиентский бандл на этапе build, НЕ читается в рантайме.
# Поэтому адрес API передаём как build-arg.
ARG NEXT_PUBLIC_API_URL=https://api.opportunity.nekado.dev
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Манифесты — для кэширования слоя установки.
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY packages ./packages
COPY apps/admin ./apps/admin

RUN pnpm install --filter @repo/admin --frozen-lockfile --ignore-scripts
RUN cd apps/admin && pnpm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000
ENV HOSTNAME=0.0.0.0

# Standalone-вывод монорепо: server.js + traced node_modules под apps/admin/.
COPY --from=builder /workspace/apps/admin/.next/standalone ./
COPY --from=builder /workspace/apps/admin/.next/static ./apps/admin/.next/static
COPY --from=builder /workspace/apps/admin/public ./apps/admin/public

EXPOSE 5000
CMD ["node", "apps/admin/server.js"]
