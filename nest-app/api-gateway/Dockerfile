FROM node:19-alpine


WORKDIR /home/node

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

USER node

ENV NODE_ENV=production
ENV CORS="https://ludxotter.site"
ENV AUTH_SERVICE_HOST=auth-service
ENV CATEGORY_SERVICE_HOST=category-service
ENV ANNOUNCEMENT_SERVICE_HOST=announcement-service

CMD [ "node", "dist/main.js" ]

EXPOSE 3001
