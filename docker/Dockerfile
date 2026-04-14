FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Create output directories
RUN mkdir -p test-results/logs test-results/screenshots config/.auth

# Default command
CMD ["npx", "playwright", "test"]
