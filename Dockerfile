FROM node:20-alphine as builder
WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine

ENV NODE_ENV production

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config

CMD ["node", "dist/src/main.js"]