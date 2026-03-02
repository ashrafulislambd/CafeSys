FROM node:24.14-alpine3.22 AS builder
WORKDIR /app
COPY package.json /app/package.json
RUN npm install
COPY . /app/
CMD [ "npm", "run" , "dev", "--", "--host", "0.0.0.0" ]

#FROM nginx:alpine
#COPY --from=builder /app/dist /usr/share/nginx/html
#EXPOSE 80
#CMD [ "nginx", "-g", "daemon off;"]