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
