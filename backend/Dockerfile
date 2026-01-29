FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose the port your backend uses
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]
