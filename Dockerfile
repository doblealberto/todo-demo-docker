
# pull official base image
FROM node:14 AS builder

# set working directory
WORKDIR /app


# Copies everything over to Docker environment
COPY . ./
RUN npm install
RUN npm run build

#Stage 2

#pull the official nginx:1.19.0 base image
FROM nginx:latest
# Copies React to the container directory
# Set working directory to nginx resources directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static resources
RUN rm -rf ./*
# Copies static resources from builder stage
COPY --from=builder /app/build .
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]

