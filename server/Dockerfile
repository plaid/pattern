FROM node:10.24.1-alpine

COPY ["package.json", "/opt/server/"]
COPY ["package-lock.json", "/opt/server/"]

WORKDIR /opt/server

RUN npm ci

COPY ["./", "/opt/server/"]

CMD ["npm", "start"]
