# Use official Node.js base image
FROM node:20

# Install LibreOffice
RUN apt-get update && apt-get install -y libreoffice

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your code
COPY . .

# Expose your app port
EXPOSE 5000

# Start your app
CMD ["node", "src/app.js"]
