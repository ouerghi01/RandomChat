# Base image with Node.js
FROM node:18 AS base

# Set working directory
WORKDIR /app

# Copy package files (for installing dependencies)
COPY package*.json ./

# Install dependencies (only production dependencies in base)
RUN npm install --production

# Copy Prisma schema before generating Prisma Client
COPY prisma ./prisma

# Generate Prisma Client for production
RUN npx prisma generate --schema=./prisma/schema.prisma

# Expose the default Next.js port
EXPOSE 3000

# Production stage
FROM base AS production
ENV NODE_ENV=production

# Copy all app files into the image
COPY . .

# Ensure the .next directory is included (assuming it’s pre-built locally)
COPY .next .next

# Alternatively, build the .next directory if it’s not pre-built
RUN if [ ! -d ".next" ]; then npx next build; fi

# Copy Prisma binaries to support database runtime
COPY --from=base /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=base /app/node_modules/@prisma /app/node_modules/@prisma

# Expose the default Next.js port
EXPOSE 3000

# Start the app in production mode
CMD ["npx", "next", "start"]

# Development stage
FROM node:18 AS development

# Set working directory
WORKDIR /app

# Copy package files (install all dependencies for dev)
COPY package*.json ./
RUN npm install

# Copy all app files into the image
COPY . .

# Generate Prisma Client for development
RUN npx prisma generate --schema=./prisma/schema.prisma

# Expose the default Next.js port
EXPOSE 3000

# Start the app in development mode (with hot-reloading)
CMD ["npm", "run", "dev"]
