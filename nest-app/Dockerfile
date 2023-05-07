FROM node:19-alpine

WORKDIR /home/node

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

USER node

ENV NODE_ENV=production
ENV SUPABASE_URL=https://ndnlxpcjuxwdryzvwedk.supabase.co
ENV SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kbmx4cGNqdXh3ZHJ5enZ3ZWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA1NDYzNzgsImV4cCI6MTk5NjEyMjM3OH0.AyxzCNCF-_aY1kcJoOdWWHTB-f9xl9crAjs4MePStG0

ENV DOMAIN=http://localhost:3001

CMD [ "node", "dist/main.js" ]
