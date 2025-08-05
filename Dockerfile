FROM node:21.1.0-alpine

RUN echo "Workdir"
WORKDIR /usr/src/app

RUN echo "Copiar arquivos"
COPY . /usr/src/app

RUN echo "CHOWN permissao"
RUN chmod -R 777 /usr/src/app

RUN echo "Expor porta"
EXPOSE 2424

RUN echo "Instalacao e build"
RUN npm i
RUN npm run build

RUN echo "Rodar aplicacao"
CMD ["npm", "start"]