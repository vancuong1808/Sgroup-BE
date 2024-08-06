FROM node:22.1.0

WORKDIR /sgroupdevop

COPY package.json ./sgroupdevop

COPY package-lock.json ./sgroupdevop

COPY . ./sgroupdevop

RUN npm install 

EXPOSE 3000

CMD [ "npm", "start" ]

