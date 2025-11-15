# Use Node.js LTS
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files for all workspaces
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies for all workspaces
RUN npm install --production=false
RUN cd client && npm install --production=false
RUN cd server && npm install --production=false

# Copy source code
COPY . .

# Build client (Vite)
RUN cd client && npm run build

# Build server (TypeScript)
RUN cd server && npm run build

# Expose port (Railway will set PORT env var dynamically)
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Start command
CMD ["node", "server/dist/server.js"]
