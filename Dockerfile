FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# A porta será definida pela variável de ambiente PORT
EXPOSE $PORT

RUN yarn build

CMD ["yarn", "start"]