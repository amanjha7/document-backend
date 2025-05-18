# Use Puppeteer base image
FROM ghcr.io/puppeteer/puppeteer:latest

# Switch to root to install packages
USER root

# Install LibreOffice (optional)
RUN apt-get update && apt-get install -y libreoffice && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Revert back to non-root user (recommended for security)
USER pptruser

# Expose app port
EXPOSE 5000

# Start your Node app
CMD ["node", "src/app.js"]
