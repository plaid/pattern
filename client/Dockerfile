FROM node:10.24.1-alpine

COPY ["package.json", "/opt/client/"]
COPY ["package-lock.json", "/opt/client/"]

WORKDIR /opt/client

RUN npm ci

COPY ["src/", "/opt/client/src/"]
COPY ["public/", "/opt/client/public/"]

CMD ["npm", "start"]
