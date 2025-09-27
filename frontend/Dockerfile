FROM node:22-bullseye AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 443

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["sh", "/app/entrypoint.sh"]
