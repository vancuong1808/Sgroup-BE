FROM node:22.1.0

COPY package.json /sgroupdevops

COPY package-lock.json /sgroupdevops

WORKDIR /sgroupdevops

COPY . /sgroupdevops

RUN npm install 

EXPOSE 3000

CMD [ "npm", "start" ]

