FROM node:alpine

WORKDIR /app/file_system

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]