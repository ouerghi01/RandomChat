# Base image with node
FROM node:18 AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Expose Next.js default port
EXPOSE 3000

# Production stage
FROM base AS production
ENV NODE_ENV=production

# Copy the rest of the app (excluding dev dependencies)
COPY . .

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Expose the Next.js port again
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
