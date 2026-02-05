# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Copy workspace structure (for monorepo)
COPY tsconfig.base.json ./
COPY nx.json ./

# Copy app specific files
COPY apps/user-ui ./apps/user-ui
COPY packages ./packages

# Install dependencies
RUN npm install

# Build the application
RUN npm run build -- user-ui

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install dumb-init
RUN apk add --no-cache dumb-init

# Copy from builder
COPY --from=builder /app/apps/user-ui/.next ./apps/user-ui/.next
COPY --from=builder /app/apps/user-ui/public ./apps/user-ui/public
COPY --from=builder /app/apps/user-ui/package.json ./apps/user-ui/
COPY --from=builder /app/node_modules ./node_modules

WORKDIR /app/apps/user-ui

EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

CMD ["node_modules/.bin/next", "start"]
