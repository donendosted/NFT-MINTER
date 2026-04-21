FROM node:20-alpine
RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate

EXPOSE 10000

CMD ["node", "src/server.js"]
