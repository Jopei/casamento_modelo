FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    libonig-dev \
    libxml2-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip unzip git curl && \
    docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

COPY docker/php.ini /usr/local/etc/php/conf.d/99-casamento.ini

RUN usermod -u 1000 www-data && groupmod -g 1000 www-data

WORKDIR /var/www/html
