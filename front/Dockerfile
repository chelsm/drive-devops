FROM node:alpine

WORKDIR /app/front

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]