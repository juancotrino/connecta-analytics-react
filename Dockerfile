# ---------- Base Image ----------
FROM node:18-alpine AS deps

# Set working directory
WORKDIR /app

# Install dependencies (only package.json and lock file first for cache efficiency)
COPY package*.json ./
RUN npm ci

# ---------- Build Stage ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy everything from previous stage
COPY --from=deps /app/node_modules ./node_modules

# Copy project files
COPY . .

# Add a correct next.config.js if needed (optional override)
RUN cat <<EOF > next.config.js
module.exports = {
  eslint: { ignoreDuringBuilds: true },
  output: 'standalone'
};
EOF

# Accept Firebase config as build args
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID

# Expose them to the build (these will be inlined in static files)
ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ENV NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID

# Build the app
RUN npm run build

# ---------- Production Stage ----------
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy only necessary files from the build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

# Start the app
CMD ["npm", "start"]
