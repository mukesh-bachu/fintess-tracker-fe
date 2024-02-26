FROM node:21-alpine
WORKDIR /app
RUN npm install -g @angular/cli@14
COPY package.json package-lock.json ./
RUN npm ci --force
COPY . .
EXPOSE 4200
CMD ["ng", "serve", "--host", "0.0.0.0"]