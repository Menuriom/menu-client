# Use a base image with Node.js pre-installed
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm ci

# Copy the rest of the application code to the working directory
COPY . .

# Build the Nuxt application
RUN npm run build

# Expose the port on which your Nuxt application will run
EXPOSE 3000

# Run the Nuxt application in production mode
CMD ["node", "./.output/server/index.mjs"]