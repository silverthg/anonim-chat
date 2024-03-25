FROM ubuntu:latest

RUN apt-get update && apt-get install -y mongodb

RUN mkdir -p /data/db

EXPOSE 3055

CMD ["mongod"]
