# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency files first for better Docker layer caching
COPY package*.json ./

RUN npm ci

# Copy application source
COPY . .

# Build the Vite application
RUN npm run build


# Production stage
FROM nginx:alpine

# Copy the Vite build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]