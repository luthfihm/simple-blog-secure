FROM php:fpm

# Install modules
RUN apt-get update && apt-get install -y \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libmcrypt-dev \
        libpng12-dev

RUN docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/
RUN docker-php-ext-install gd

RUN docker-php-ext-install mcrypt

RUN docker-php-ext-install mysqli
RUN docker-php-ext-install pdo
RUN docker-php-ext-install pdo_mysql
ADD ext-mysqli.ini /usr/local/etc/php/conf.d/ext-mysqli.ini
ADD ext-pdo.ini /usr/local/etc/php/conf.d/ext-pdo.ini

CMD ["php-fpm"]