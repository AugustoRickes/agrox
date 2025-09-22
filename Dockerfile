# --- Estágio 1: Builder de Dependências PHP ---
FROM php:8.3-fpm as vendor_builder

WORKDIR /var/www/html

# Instala dependências do sistema
RUN apt-get update && apt-get install -y \
    unzip \
    git \
    curl \
    libpq-dev \
    libzip-dev \
    libicu-dev \
    libonig-dev

# Instala extensões PHP
RUN docker-php-ext-install pdo pdo_pgsql zip intl mbstring

# Instala o Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copia apenas os arquivos de dependência do Composer
COPY composer.json composer.lock ./

# Instala apenas as dependências de produção, otimizado
RUN composer install --no-interaction --no-dev --optimize-autoloader

# --- Estágio 2: Builder de Assets Node.js ---
FROM node:18 as asset_builder

WORKDIR /var/www/html

# Copia apenas os arquivos de dependência do Node
COPY package.json package-lock.json ./

# Instala dependências do NPM
RUN npm install

# Copia o restante dos arquivos de frontend
COPY . .

# Builda os assets
RUN npm run build

# --- Estágio 3: Imagem Final de Produção ---
FROM php:8.3-fpm as production

WORKDIR /var/www/html

# Instala dependências do sistema para a imagem final
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    libzip-dev \
    libpq-dev \
    postgresql-client \
    jpegoptim optipng pngquant gifsicle \
    supervisor \
    libicu-dev \
    libonig-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Instala extensões PHP
RUN docker-php-ext-install pdo pdo_pgsql mbstring zip exif pcntl intl
RUN docker-php-ext-configure gd --with-freetype --with-jpeg
RUN docker-php-ext-install gd

# Copia o código da aplicação (sem vendor e node_modules)
COPY . .

# Copia as dependências do Composer do estágio \'vendor_builder\'
COPY --from=vendor_builder /var/www/html/vendor ./vendor

# Copia os assets buildados do estágio \'asset_builder\'
COPY --from=asset_builder /var/www/html/public/build ./public/build

# Ajusta as permissões
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 777 /var/www/html/storage \
    && chmod -R 777 /var/www/html/bootstrap/cache

# Copia os scripts de inicialização e configuração do supervisor
COPY ./docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

COPY ./supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 9000 80

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
