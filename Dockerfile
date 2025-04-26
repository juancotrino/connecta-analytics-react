# ---------- Base image for building ----------
FROM node:23.2.0-alpine AS build

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json for better layer caching
COPY package*.json ./

# Clean npm cache and install dependencies safely
RUN rm -f package-lock.json && \
  npm cache clean --force && \
  npm install --force --no-audit --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Create next.config.js on the fly (adjust if you already have it)
RUN echo 'module.exports = {\n  eslint: { ignoreDuringBuilds: true },\n  output: "standalone"\n}' > next.config.js

# Build the Next.js app
RUN npm run build

# ---------- Production image ----------
FROM node:23.2.0-alpine AS runner

WORKDIR /app

# Install only production dependencies
COPY --from=build /app/package*.json ./
RUN npm install --only=production

# Copy the built app from the build stage
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/next.config.js ./
COPY --from=build /app/node_modules ./node_modules

# If you have a custom server (e.g., server.js), copy it
# COPY --from=build /app/server.js ./

EXPOSE 8080

# Start the app
CMD ["npm", "start"]
