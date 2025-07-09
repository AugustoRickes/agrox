no link abaixo tem tudo sobre o projeto

# projeto-doc - https://gitlab.com/senac-projetos-de-desenvolvimento/2025-augusto-rickes-e-thalia-xavier/projeto-doc



## Configuração do ambinete

antes de tudo precisamos instalar algumas tecnologias

php (versao 8.2 ou maior) + composer, recomendo o que diz na documentação - <https://laravel.com/docs/12.x/installation#installing-php>
![alt text](image.png)

NVM (node.js) - <https://github.com/nvm-sh/nvm>
nvm install --lts
nvm use --lts

## clone o projeto

git clone <git@gitlab.com>:senac-projetos-de-desenvolvimento/2025-augusto-rickes-e-thalia-xavier/projeto-doc.git

cd projeto-doc

# instalacao das dependencias

composer install
npm install

cp .env.example .env

php artisan key:generate


# banco de dados postgreSQL

instale o postgreSQL local

crie o banco e defina uma senha para o 'root':
sudo -u postgres psql -c "CREATE DATABASE agrox;"
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"

se der erro de permissao:

sudo -u postgres psql -c "GRANT ALL ON SCHEMA public TO public;"

## confugura o .env

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=agrox
DB_USERNAME=postgres
DB_PASSWORD=postgres

## executa as migration

php artisan migrate

# configure sua chave ssh

1. primeiro cheque se já existe uma ssh

ls -al ~/.ssh

deve exibir id_rsa.pub e id_rsa

caso já exista pula pro passo 3

2. cria uma chave ssh

ssh-keygen -t ed25519 -C "<bota_teu_email@aqui.com>"

enter pra aceitar o lugar default ~/.ssh

NAO BOTE SENHA

3. adiciona o ssh no ssh-agent

eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

4. copia a chave publica

linux:

cat ~/.ssh/id_ed25519.pub

copia isso

windows powershell:

Get-Content "$env:USERPROFILE\.ssh\id_ed25519.pub"

copia isso

5. adiciona a chave no gitlab

entra no gitlab faz login
vai aqui - <https://gitlab.com/-/user_settings/ssh_keys>
clica em add new key
cola a chave que voce pegou no terminal win ou linux
bota um titulo pra essa chave
clica em add key

6. testa a conexao no terminal

ssh -T <git@gitlab.com>

deve aparecer algo assim:
Welcome to GitLab, @seu_usuario!


# fluxo de versionamento do projeto

branchs:

main → Código em produção (merge apenas via PR)

dev → Ambiente de desenvolvimento principal

feature/coloca-o-numero-da-issue-aqui → Branches para novas funcionalidades

## fluxo recomentdado

### cria uma branch a partir da dev

git checkout dev
git pull origin dev
git checkout -b feature/coloca-o-numero-da-issue-aqui

### depois que desenvolver a issue

git add .
git commit -m "Descrição clara do que foi feito"
git push origin feature/coloca-o-numero-da-issue-aqui

### merge pra main (depois de testar em dev)

git checkout main
git pull origin main
git merge dev
git push origin main

# rodando o projeto local

backend

php artisan serve

frontend

npm run dev

bate na rota http://localhost:8000

## sincroniza com a dev

git checkout dev
git pull origin dev

## Docker e Containerização

Esta branch inclui a configuração completa para rodar a aplicação em ambiente Docker, facilitando o setup de desenvolvimento e implementação em produção:

- **Dockerfile:** Configuração para criar a imagem da aplicação baseada em PHP 8.2-FPM com todas as dependências necessárias.
- **docker-compose.yml:** Orquestra os serviços necessários para execução local da aplicação.
- **docker-entrypoint.sh:** Script de inicialização que configura automaticamente o ambiente, gerando chaves, executando migrações e otimizando a aplicação para produção.
- **supervisord.conf:** Gerencia os processos dentro do container, garantindo que tanto o PHP quanto os assets sejam servidos corretamente.

### Ambiente de Desenvolvimento

Para executar a aplicação localmente com Docker:

```bash
docker compose build
docker compose up -d
```

# rodar os testes unitarios

```bash
php artisan test
php artisan test --filter=SaleTest
php artisan test --filter=SaleControllerTest
php artisan test --filter=ProductControllerTest
```
