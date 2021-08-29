FROM php:8.0-fpm

COPY --from=composer:2.1.5 /usr/bin/composer /usr/bin/composer

RUN apt-get update && apt-get install -y zip unzip && \
    docker-php-ext-install pdo pdo_mysql

WORKDIR /var/www
COPY ./backend/src /var/www

RUN composer install --optimize-autoloader --no-dev
RUN chmod 777 -R /var/www/storage/ && \
    chown -R www-data:www-data /var/www/