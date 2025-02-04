FROM node:18-alpine

WORKDIR /usr/src/app

# Install required dependencies
RUN npm install -g dotenv

COPY package*.json ./

RUN npm install

COPY . .

RUN echo "MONGO_URL=mongodb://root:password123@mongodb:27017/chifoumi?authSource=admin\n\
    SECRET_KEY=your-secret-key-change-in-production\n\
    PORT=5001\n\
    NODE_ENV=development" > .env

EXPOSE 5001

CMD ["node", "server.js"]
