
################################################################################
# Stage 0: Base
################################################################################
# Use node version 18.13.0
FROM node:20.3-alpine3.17@sha256:ff86266a784bbe13506b72602326be208068ffb27b343c409233b60ce681d366 AS base 

LABEL maintainer="Bhavikkumar Mistry <bhmistry@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Set the NODE_ENV to production
ENV NODE_ENV production

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into /app
COPY package*.json /app/

# Install node dependencies defined in package-lock.json
RUN npm ci --only=production

################################################################################
# Stage 1: local deployment
################################################################################

FROM node:20.3-alpine3.17@sha256:ff86266a784bbe13506b72602326be208068ffb27b343c409233b60ce681d366 AS deploy

# Set the default working directory
WORKDIR /app

# Copy generated node_modules from base stage
COPY --from=base /app/ /app/

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Install production node modules
COPY package*.json ./
RUN npm install --only=production

# Start the container by running our server
CMD ["npm", "start"]

# We run our service on port 8080
EXPOSE 8080

# Add a healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD curl --fail http://localhost:$PORT/v1/fragments || exit 1