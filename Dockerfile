FROM node:25-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --quiet

COPY . .

EXPOSE 5000

CMD ["npm", "start"]