# Use the latest Node.js image from Docker Hub
FROM node:latest

# Set the working directory inside the container
WORKDIR /usr/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --quiet

# Copy the source code to the working directory
COPY ./src ./src

# Set the default command to run the application in development mode
CMD ["npm", "start", "dev"]
