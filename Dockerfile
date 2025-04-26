# Build Stage
FROM node:20.11.1-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force && \
  npm install --legacy-peer-deps --no-audit && \
  npm install firebase@10.12.2 --legacy-peer-deps
COPY . .

# Create temporary Next.js config to disable ESLint
RUN echo 'module.exports = {\
  eslint: {\
  ignoreDuringBuilds: true\
  }\
  }' > next.config.js

# Run build
RUN NODE_ENV=production npx next build

# Production Stage
FROM nginx:stable-alpine AS production
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
