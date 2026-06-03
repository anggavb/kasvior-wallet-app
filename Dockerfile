FROM node:24.16.0-alpine AS builder

WORKDIR /app

ARG VITE_ENV=production
ARG VITE_APP_TITLE="Kasvior Wallet"
ARG VITE_API_BASE_URL=
ENV VITE_ENV=$VITE_ENV
ENV VITE_APP_TITLE=$VITE_APP_TITLE
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.31.0-alpine3.23-slim

COPY --from=builder /app/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
