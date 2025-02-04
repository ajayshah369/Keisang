# frontend/Dockerfile
FROM node:22.12.0

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY src ./src
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY tsconfig.node.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY .env ./

RUN npm run build
# RUN npm i -g serve

# EXPOSE 5173

# CMD ["serve", "-s", "dist", "-l", "5173"]