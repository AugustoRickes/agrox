# Use a imagem base oficial do PHP com FPM
FROM php:8.2-fpm

# Define o diretório de trabalho dentro do contêiner
WORKDIR /var/www/html

# --- Instalação de Dependências do Sistema ---
# Primeiro, atualiza os pacotes e instala as dependências necessárias para PHP e Node.js
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    libzip-dev \
    libonig-dev \
    libpq-dev \
    postgresql-client \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    supervisor \
    # Instala o Node.js e npm de forma mais robusta
    nodejs \
    npm

# Limpa o cache para reduzir o tamanho da imagem
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# --- Instalação de Extensões PHP ---
# Instala extensões PHP comuns
RUN docker-php-ext-install pdo pdo_pgsql mbstring zip exif pcntl
# Configura e instala a extensão GD
RUN docker-php-ext-configure gd --with-freetype --with-jpeg
RUN docker-php-ext-install gd

# --- Instalação do Composer ---
# Baixa e instala o Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# --- Cópia e Instalação de Dependências da Aplicação ---
# Copia apenas os arquivos de configuração de dependência primeiro para aproveitar o cache do Docker
COPY composer.json composer.lock ./
COPY package.json package-lock.json ./ # Ou yarn.lock se estiver usando yarn

# Instala as dependências PHP
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Instala as dependências Node.js e compila os assets
# Este passo deve ser feito *após* copiar os arquivos de dependência do frontend e antes do resto da aplicação
RUN npm install && npm run build

# Agora copia o restante dos arquivos da aplicação
COPY . .

# --- Configuração de Permissões ---
# Define permissões adequadas para o servidor web
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# --- Script de Inicialização e Supervisor ---
# Copia e torna executável o script de entrada
COPY ./docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Copia a configuração do Supervisor
COPY ./supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# --- Exposição de Portas ---
# Expõe a porta 9000 para PHP-FPM (e 80 se você estiver usando Nginx dentro do mesmo contêiner)
EXPOSE 9000 80

# --- Comando de Inicialização ---
# Usa o Supervisor para gerenciar os processos (PHP-FPM e Nginx, se configurado)
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
