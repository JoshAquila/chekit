FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .
RUN mkdir -p /app/seed && cp /app/data/ingredients.json /app/seed/ingredients.json

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3333
ENV SQLITE_PATH=/app/data/chekit.sqlite
ENV INGREDIENTS_JSON=/app/seed/ingredients.json

RUN npm run import-data

EXPOSE 3333

CMD ["npm", "start"]
