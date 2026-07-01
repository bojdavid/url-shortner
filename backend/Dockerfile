# ■■ Stage 1: Build ■■■■■■■■■■■■■■■■■■■■■■■■■■■
# Use the official Node 20 image as the base
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package files first (Docker caches this layer if they haven't changed)
COPY package*.json ./

# Install ALL dependencies (including devDependencies for TypeScript)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# ■■ Stage 2: Run ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
# Fresh base image — no build tools, much smaller
FROM node:20-alpine AS runner
WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled output from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the port the app runs on
EXPOSE 3000

# Run migrations first, then start the application
CMD ["sh", "-c", "npm run migration:run && node dist/main"]