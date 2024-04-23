GNU nano 6.2                                                                  Dockerfile
# inherit from an existing image to add the functionality
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app/frontend

# Copy the package.json and package-lock.json (or npm-shrinkwrap.json) files
COPY package*.json ./

# Install dependencies present in package.json
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Inform Docker that the container is listening on the specified port at runtime.
EXPOSE 3056

# Define the command to run your app using CMD which defines your runtime
CMD ["npm", "start"]
