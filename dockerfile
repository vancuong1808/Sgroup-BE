FROM node:22.1.0

WORKDIR /sgroudevop

COPY package.json ./

COPY package-lock.json ./

COPY . /sgroudevop

RUN npm install 

EXPOSE 3000

CMD [ "npm", "start" ]

