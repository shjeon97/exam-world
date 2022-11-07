FROM node:16 AS builder
WORKDIR /app
COPY package.json .
RUN npm install --force
COPY . .

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app ./
CMD ["yarn","start:prod"]