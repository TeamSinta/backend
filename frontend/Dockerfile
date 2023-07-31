# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy all frontend files to the container
COPY . .

# Expose the port on which the frontend will run (usually 3000 for React)
EXPOSE 3001

# Set environment variables if required (e.g., REACT_APP_API_URL)
# ENV REACT_APP_API_URL=http://backend_django:8000/api

# Start the React development server
CMD ["npm", "start"]