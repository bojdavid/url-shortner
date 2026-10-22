# -------------------------
# Stage 1: Build the app
# -------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the production app
RUN npm run build

# -------------------------
# Stage 2: Serve with Nginx
# -------------------------
FROM nginx:alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]