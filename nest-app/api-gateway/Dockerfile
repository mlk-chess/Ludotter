FROM node:19-alpine


WORKDIR /home/node

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

USER node

ENV NODE_ENV=production
ENV CORS="https://ludotter.site"
ENV AUTH_SERVICE_HOST=auth-service
ENV CATEGORY_SERVICE_HOST=category-service

CMD [ "node", "dist/main.js" ]

EXPOSE 3001