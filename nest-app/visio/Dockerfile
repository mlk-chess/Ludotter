FROM node:19-alpine

ARG SUPABASE_URL
ARG SUPABASE_KEY_SERVICE

WORKDIR /home/node

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

USER node

ENV NODE_ENV=production
ENV SUPABASE_URL=${SUPABASE_URL}
ENV SUPABASE_KEY=${SUPABASE_KEY_SERVICE}

CMD [ "node", "dist/main.js" ]

EXPOSE 4015