# Hilyoon PHP backend: API (/api), admin panel (/admin), generated blog images.
FROM php:8.2-apache

RUN docker-php-ext-install pdo_mysql \
    && a2enmod rewrite headers \
    && mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

COPY docker/apache.conf /etc/apache2/conf-enabled/hilyoon.conf
COPY docker/php.ini "$PHP_INI_DIR/conf.d/zz-hilyoon.ini"

WORKDIR /var/www/html
COPY --chown=www-data:www-data . .

# Runtime-writable dirs (mounted as volumes in production)
RUN mkdir -p logs public/images/blog \
    && chown -R www-data:www-data logs public \
    && rm -rf docker Dockerfile .dockerignore

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD php -r 'exit(@file_get_contents("http://localhost/api/status") === false ? 1 : 0);'
