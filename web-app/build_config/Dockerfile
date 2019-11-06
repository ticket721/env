FROM node:10.17

WORKDIR /usr/src/t721
COPY ./ ./
ENV NODE_ENV production
RUN npm cache clean --force

RUN npm install
RUN npm run postinstall
RUN npm run build

EXPOSE 3000
CMD [ "npm", "run", "next"]
