FROM node:22.1.0

WORKDIR /sgroupdevop

COPY package.json .

COPY package-lock.json .

COPY . .

RUN npm install 

EXPOSE 3000

CMD [ "npm", "start" ]

