FROM node:22-alpine as builder

WORKDIR /app

COPY ./apps/admin /app

RUN npm install

RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start"]