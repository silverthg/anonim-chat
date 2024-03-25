FROM node:14

WORKDIR /backend

COPY package.json /backend
RUN npm install

COPY . /backend

ENV MONGO_DB_URL="mongodb://mongo:3055/"
ENV JWT_SECRET="secretKey"

EXPOSE 3054

CMD ["node", "server.js"]
