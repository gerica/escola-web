FROM node:24-alpine3.21

WORKDIR /app

# Copia os arquivos de configuração de pacotes primeiro
COPY package*.json ./

# Instala as dependências para aproveitar o cache do Docker.
# Esta camada só será reconstruída se o package.json ou package-lock.json mudar.
RUN npm install

# Copia o restante do código-fonte da aplicação
COPY . .

EXPOSE 4200

CMD [ "npm", "start" ]
# CMD [ "npm","run", "ngrok" ]
