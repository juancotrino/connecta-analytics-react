# Build Stage
FROM node:20.11.1-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force && \
  npm install --legacy-peer-deps --no-audit && \
  npm install firebase@10.12.2 --legacy-peer-deps
COPY . .

# Create temporary Next.js config to handle Firebase during build
RUN echo 'module.exports = {\
  eslint: {\
  ignoreDuringBuilds: true\
  },\
  env: {\
  NEXT_PUBLIC_FIREBASE_API_KEY: "mock-key-for-build",\
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "mock-domain",\
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: "mock-project",\
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "mock-bucket",\
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "mock-sender",\
  NEXT_PUBLIC_FIREBASE_APP_ID: "mock-app-id"\
  }\
  }' > next.config.js

# Run build with Firebase mock configuration
RUN NODE_ENV=production DISABLE_FIREBASE_AUTH=true npx next build

# Production Stage
FROM nginx:stable-alpine AS production
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
