FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ ./
# RUN npm run e2e
RUN npm run build:prod
CMD ["npm", "run", "start"]