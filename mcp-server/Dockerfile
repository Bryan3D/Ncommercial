FROM node:20-alpine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY mcp-server/package.json ./
COPY prisma ./prisma
RUN npm install --omit=dev
RUN npx prisma generate

COPY mcp-server/server.js ./

EXPOSE 4000
CMD ["node", "server.js"]
