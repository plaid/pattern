FROM node:14.21.3-alpine

COPY ["package.json", "/opt/client/"]
COPY ["package-lock.json", "/opt/client/"]
COPY ["tsconfig.json", "/opt/client/"]

WORKDIR /opt/client

RUN npm ci

COPY ["src/", "/opt/client/src/"]
COPY ["public/", "/opt/client/public/"]

CMD ["npm", "start"]
