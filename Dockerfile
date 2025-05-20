FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www/html

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    libzip-dev \
    libonig-dev \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    nodejs \
    npm \
    supervisor

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install extensions
RUN docker-php-ext-install pdo pdo_pgsql mbstring zip exif pcntl
RUN docker-php-ext-configure gd --with-freetype --with-jpeg
RUN docker-php-ext-install gd

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install Node.js and npm
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Copy application files
COPY . /var/www/html

# postgresql
RUN apt-get update && apt-get install -y libpq-dev

# Set permissions
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache

# Install dependencies
RUN composer install --no-interaction --optimize-autoloader
RUN npm install && npm run build

# Create startup script
COPY ./docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Setup supervisor to run PHP-FPM
COPY ./supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose port 9000 (PHP-FPM) and 80 (if you want to use PHP built-in server)
EXPOSE 9000 80

# Use supervisor to manage processes
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
