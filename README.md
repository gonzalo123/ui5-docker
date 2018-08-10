## Working with SAPUI5 locally part 2. Now with docker

In the first part I spoke about how to build our working environment to work with UI5 locally instead of using WebIDE. Now in this second part of the post we'll see how to do it using docker to set up our environment.

I'll use docker-compose to set up the project. Basically, as I explain in the first part, the project has two parts. One backend and one frontned. We're going to use exactly the same code for the frontend and for the backend.

The frontend is build over a localneo. As it's a node application we'll use a node:alpine base host

´´´yaml
FROM node:alpine

EXPOSE 8000

WORKDIR /code/src
COPY ./frontend .
RUN npm install
ENTRYPOINT ["npm", "run", "serve"]
´´´

In docker-compose we only need to map the port that we´ll expose in our host and since we want this project in our depelopemet process, we also will map the volume to avoid to re-generate our container each time we change the code.

```yaml
...
  ui5:
    image: gonzalo123.ui5
    ports:
    - "8000:8000"
    restart: always
    build:
      context: ./src
      dockerfile: .docker/Dockerfile-ui5
    volumes:
    - ./src/frontend:/code/src
    networks:
    - api-network
```

The backend is a PHP application. We can set up a PHP application using different architectures. In this project we'll use nginx and PHP-FPM.

for nginx we'll use the following Dockerfile
```yaml
FROM  nginx:1.13-alpine

EXPOSE 80

COPY ./.docker/web/site.conf /etc/nginx/conf.d/default.conf
COPY ./backend /code/src
```

And for the PHP host the following one (with xdebug to enable debugging and breakpoints):
```yaml
FROM php:7.1-fpm

ENV PHP_XDEBUG_REMOTE_ENABLE 1

RUN apt-get update && apt-get install -my \
    git \
    libghc-zlib-dev && \
    apt-get clean

RUN apt-get install -y libpq-dev \
    && docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install pdo pdo_pgsql pgsql opcache zip

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN composer global require "laravel/lumen-installer"
ENV PATH ~/.composer/vendor/bin:$PATH

COPY ./backend /code/src
```

And basically that's all. Here the full docker-compose file

```yaml
version: '3.4'

services:
  nginx:
    image: gonzalo123.nginx
    restart: always
    ports:
    - "8080:80"
    build:
      context: ./src
      dockerfile: .docker/Dockerfile-nginx
    volumes:
    - ./src/backend:/code/src
    - ./src/.docker/web/site.conf:/etc/nginx/conf.d/default.conf
    networks:
    - api-network
  api:
    image: gonzalo123.api
    restart: always
    build:
      context: ./src
      dockerfile: .docker/Dockerfile-lumen-dev
    environment:
      XDEBUG_CONFIG: remote_host=${MY_IP}
    volumes:
    - ./src/backend:/code/src
    networks:
    - api-network
  ui5:
    image: gonzalo123.ui5
    ports:
    - "8000:8000"
    restart: always
    build:
      context: ./src
      dockerfile: .docker/Dockerfile-ui5
    networks:
    - api-network

networks:
  api-network:
    driver: bridge

```

If we want to use this project you only need to:
* clone the repo fron github
* run ./ui5 up

With this configuration we're exposing two ports 8080 for the frontend and 8000 for the backend. We also are mapping our local filesystem to containers to avoid to regenerate our containers each time we change the code.
We also can have a variation. A "production" variation of our docker-compose file. I put production between quotation marks because normally we aren't going to use localneo as a production server (please don't do it. We'll use SCP to host the frontend). 
This configuration is just an example without filesystem mapping, without xdebug in the backend and without exposing the backend externally (Only the frontend could use it)


```yaml
version: '3.4'

services:
  nginx:
    image: gonzalo123.nginx
    restart: always
    build:
      context: ./src
      dockerfile: .docker/Dockerfile-nginx
    networks:
    - api-network
  api:
    image: gonzalo123.api
    restart: always
    build:
      context: ./src
      dockerfile: .docker/Dockerfile-lumen
    networks:
    - api-network
  ui5:
    image: gonzalo123.ui5
    ports:
    - "8000:8000"
    restart: always
    build:
      context: ./src
      dockerfile: .docker/Dockerfile-ui5
    networks:
    - api-network

networks:
  api-network:
    driver: bridge

```
