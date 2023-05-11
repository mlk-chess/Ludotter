FROM node:19-alpine

WORKDIR /home/node

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

USER node

ENV NODE_ENV=production

CMD [ "node", "dist/main.js" ]

EXPOSE 4000