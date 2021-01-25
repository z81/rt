FROM node:alpine
WORKDIR /app
COPY . ./
RUN npm install
RUN ./node_modules/.bin/tsc
RUN npm install --only=prod
EXPOSE 5280

CMD [ "node", "/app/dist/app.js" ]