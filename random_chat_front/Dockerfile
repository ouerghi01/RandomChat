# Base image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy only essential app files for base operations
COPY prisma ./prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

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

# Ensure Prisma binaries are available
COPY --from=base /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=base /app/node_modules/@prisma /app/node_modules/@prisma

# Expose Next.js default port
EXPOSE 3000

# Start the app in production mode
CMD ["node", ".next/standalone/server.js"]
# Development stage
FROM node:18 AS development

# Set working directory
WORKDIR /app

# Copy package files (install all dependencies for dev)
COPY package.json package-lock.json ./
RUN npm install

# Copy all app files into the image
COPY . .

# Generate Prisma Client for development
COPY prisma ./prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

# Expose the default Next.js port
EXPOSE 3000

# Start the app in development mode (with hot-reloading)
CMD ["npm", "run", "dev"]
