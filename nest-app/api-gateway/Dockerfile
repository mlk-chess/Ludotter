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
ENV ANNOUNCEMENT_SERVICE_HOST=announcement-service
ENV CATEGORY_SERVICE_HOST=category-service
ENV EVENT_SERVICE_HOST=event-service
ENV MESSAGE_SERVICE_HOST=message-service
ENV COMPANY_SERVICE_HOST=company-service
ENV USER_SERVICE_HOST=user-service
ENV PARTY_SERVICE_HOST=party-service

CMD [ "node", "dist/main.js" ]

EXPOSE 3001
