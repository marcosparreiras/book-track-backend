FROM node:18-alpine3.19 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm ci && npm cache clean --force

FROM node:18-alpine3.19

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package*.json ./

COPY --from=build /usr/src/app/dist ./dist

COPY --from=build /usr/src/app/node_modules ./node_modules

ENV PORT=80

EXPOSE 80

CMD ["npm", "run", "start"]