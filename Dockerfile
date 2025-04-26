# Build Stage
FROM node:20.11.1-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force && \
  npm install --legacy-peer-deps && \
  npm audit fix --force
COPY . .
RUN npm run build

# Production Stage
FROM nginx:stable-alpine AS production
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
