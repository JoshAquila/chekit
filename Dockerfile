FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3333
ENV SQLITE_PATH=/app/data/chekit.sqlite

RUN npm run import-data

EXPOSE 3333

CMD ["npm", "start"]
