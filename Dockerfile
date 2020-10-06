FROM node:12.18-alpine
ENV NODE_ENV development
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "tsconfig.json", "npm-shrinkwrap.json*", "./"]
RUN npm install --silent && mv node_modules ../
RUN npm install -g typescript
RUN npm run build-ts
COPY . .
EXPOSE 3030
CMD ["npm", "start"]
