FROM node:22.12.0

WORKDIR /usr/src/app

# Install build dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip

COPY package*.json ./
RUN npm install

COPY src ./src
COPY tsconfig.json ./
COPY .env ./

RUN npm run build

RUN npm install -g pm2

# Expose the application port (optional, based on your app)
EXPOSE 8000

CMD ["pm2-runtime", "node dist/main.js"]