# Base image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy app files
COPY . .

# Build stage (for production)
FROM base AS build
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Copy only necessary files for production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Expose Next.js default port
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "start"]

# Development stage
FROM base AS development
ENV NODE_ENV=development

# Install all dependencies (including dev)
RUN npm ci && npm cache clean --force

# Expose Next.js default port
EXPOSE 3000

# Start the app in development mode
CMD ["npm", "run", "dev"]
