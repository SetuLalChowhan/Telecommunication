# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies required for node-gyp if needed
RUN apk add --no-cache libc6-compat

# Copy dependency manifests
COPY package*.json tsconfig*.json prisma.config.ts ./
COPY prisma ./prisma/

# Install all dependencies including devDependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build NestJS production bundle
RUN npm run build

# Remove development dependencies to keep production footprint minimal
RUN npm prune --production

# Stage 2: Production runtime
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Security: Create non-root system user and group
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Create uploads directory with appropriate permissions
RUN mkdir -p /app/uploads && chown -R nestjs:nodejs /app/uploads

# Copy built dist and node_modules from builder
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json

USER nestjs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/main.js"]
