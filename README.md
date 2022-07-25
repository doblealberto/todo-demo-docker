# Todo App

Todo app is a simple ReactJs App 
- [Ci-CD.yml](#Ci-CD.yml)
- [DOCKERFILE](#DOCKERFILE)


![Example Image](https://drive.google.com/uc?id=1VsJwB_65ONGgvMNBziPBzWlDyXw4RYzw)

## RUN IT WITH DOCKER.
```javascript
  docker pull doblealberto/app-todos:latest
  docker run --name appTodosNoche -p 3000:80 doblealberto/app-todos:latest
```






# Ci-CD.yml

```javascript
name: Docker-CI/CD
on:
  create:
    tags:
      - 'v*'
```
CI-CD action will create a new docker image every time a tag is added to the repo.

```javascript

jobs:
  docker-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: Login
        uses: docker/login-action@v2
        with:
            username: ${{ secrets.DOCKER_HUB_USERNAME }}
            password: ${{ secrets.DOCKER_HUB_ACCESS_TOKEN }}

      - name: Docker buildx setup action
        uses: docker/setup-buildx-action@v1

      - name: Build and push
        uses: docker/build-push-action@v2
        with:
          context: .
          file: ./Dockerfile
          push: true
          tags: ${{ secrets.DOCKER_HUB_USERNAME }}/app-todos:latest

```
We first start by using the `actions/checkout@master` action in order to have acces to our repo code while running the workflow

The next step is to login into dockerhub by using ` docker/login-action@v2`, we will need to configure the secrets for our repo to achieve that you need to go to settings>secrets and add `DOCKER_HUB_USERNAME` and `DOCKER_HUB_ACCESS_TOKEN`
![Example Image](https://drive.google.com/uc?id=1PqCaCuUgOQagGlXC9JYZwcrbQwYsz0xo) 
You must generate an access token in ducker hub. 
![Example Image](https://drive.google.com/uc?id=1PpH6_Wn4AAmYP8QyXdQr6W332xwpZ4QX) 

`docker/setup-buildx-action@v1` will setup buildx which is a builder that can be used in the following steps of the workflow

`Build and push` step will build the docker image using `Dockerfile` it will also add a tag to the image by using
`tags: ${{ secrets.DOCKER_HUB_USERNAME }}/app-todos:latest` your dockerhub username and `latest` tag.


# DOCKERFILE
```javascript
# Pull node 14 image
FROM node:14 AS builder

# set working directory
WORKDIR /app


# install app dependencies
#copies package.json  to Docker environment
COPY package.json ./

# Installs all node packages
RUN npm install 


# Copies everything over to Docker environment
COPY . ./
RUN npm run build

#Stage 2

#Pull the latest nginx image
FROM nginx:latest
# Set working directory to nginx resources directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static resources
RUN rm -rf ./*
# Copies static resources from builder stage
COPY --from=builder /app/build .
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
```
To have a more clean image we used stages it will also make our final image ligther
the dockerfile is divided in two stages the `first one` makes all the node related instalation and generates the static
resources for our app. 

`second step` copies the resources to nginx directory.



















