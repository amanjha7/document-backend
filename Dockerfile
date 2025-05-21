# Use Puppeteer base image
FROM ghcr.io/puppeteer/puppeteer:latest

# Switch to root to install packages
USER root

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libreoffice \            # Optional, if you\'re handling office docs
    graphicsmagick \         # GraphicsMagick for image manipulation
    tesseract-ocr \          # Tesseract OCR engine
    curl \                   # For debugging/downloading
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Revert to a safer non-root user (recommended)
USER pptruser

# Expose the port your app runs on
EXPOSE 5000

# Start the Node.js application
CMD ["node", "src/app.js"]
