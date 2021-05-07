FROM node:14.16.1-alpine
COPY . /usr/src/app 
WORKDIR /usr/src/app
RUN npm install
EXPOSE 4000
ENTRYPOINT [ "npm", "start"]