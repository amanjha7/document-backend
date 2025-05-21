# Use Puppeteer base image
FROM ghcr.io/puppeteer/puppeteer:latest

# Switch to root to install packages
USER root

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libreoffice \           
    graphicsmagick \         
    tesseract-ocr \         
    curl \                  
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Create uploads directory and give ownership to pptruser
RUN mkdir -p /app/uploads && chown -R pptruser:pptruser /app

# Revert to a safer non-root user (recommended)
USER pptruser

# Expose the port your app runs on
EXPOSE 5000

# Start the Node.js application
CMD ["node", "src/app.js"]
