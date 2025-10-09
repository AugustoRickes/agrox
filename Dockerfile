
FROM php:8.3-fpm
# Set working directory
WORKDIR /var/www/html
# Install dependencies (mantido como está)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    libzip-dev \
    libicu-dev \
    libonig-dev \
    libpq-dev \
    postgresql-client \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    nodejs \
    npm \
    supervisor
# Clear cache (mantido como está)
RUN apt-get clean && rm -rf /var/lib/apt/lists/*
# Install extensions (mantido como está)
RUN docker-php-ext-install pdo pdo_pgsql mbstring zip exif pcntl intl
RUN docker-php-ext-configure gd --with-freetype --with-jpeg
RUN docker-php-ext-install gd
# Install composer (mantido como está)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
# Install Node.js and npm (mantido como está)
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs
# Copia os arquivos da aplicação **antes** de instalar dependências e buildar assets
# Isso garante que package.json e vite.config.js estejam presentes
COPY . /var/www/html
# postgresql (mantido como está)
RUN apt-get update && apt-get install -y libpq-dev
# Set permissions (mantido como está)
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 777 /var/www/html/storage \
    && chmod -R 777 /var/www/html/bootstrap/cache
# Install composer dependencies (mantido como está)
RUN composer install --no-interaction --optimize-autoloader
# --- COMEÇA A CORREÇÃO AQUI ---
# 1. Define um argumento de build que pode ser passado externamente
#    O nome 'ASSET_URL_BUILD' é uma convenção para build-args
ARG ASSET_URL_BUILD
# 2. Define uma variável de ambiente (ENV) com o valor do argumento de build
#    Esta ENV estará disponível para o comando 'npm run build'
ENV ASSET_URL=${ASSET_URL_BUILD}
# Instala dependências NPM e builda os assets, agora com ASSET_URL disponível
RUN npm install && npm run build
# --- TERMINA A CORREÇÃO AQUI ---
# Create startup script (mantido como está)
COPY ./docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
# Setup supervisor to run PHP-FPM (mantido como está)
COPY ./supervisord.conf /etc/supervisor/conf.d/supervisord.conf
# Expose port 9000 (PHP-FPM) and 80 (if you want to use PHP built-in server) (mantido como está)
EXPOSE 9000 80
# Use supervisor to manage processes (mantido como está)
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
