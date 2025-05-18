# Use Puppeteer base image (includes Chromium + dependencies)
FROM ghcr.io/puppeteer/puppeteer:latest

# Optional: Install LibreOffice if needed
RUN apt-get update && apt-get install -y libreoffice && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Expose the app port
EXPOSE 5000

# Start the Node app
CMD ["node", "src/app.js"]
