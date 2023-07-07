FROM node:16.4-alpine

WORKDIR /app/back

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]