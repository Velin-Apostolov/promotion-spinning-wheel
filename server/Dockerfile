# Use the official Node.js image as a base
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which your application runs
EXPOSE 5000

# Command to run your application
CMD ["npm", "start"]