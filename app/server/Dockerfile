FROM node:lts-alpine

WORKDIR /workspace

COPY package*.json ./

RUN npm install --include=dev

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
# CMD ["tail", "-f", "/dev/null"]