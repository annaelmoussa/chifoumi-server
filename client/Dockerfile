FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install event-source-polyfill

COPY . .

# Ajout des permissions nécessaires
RUN mkdir -p node_modules/.vite-temp && \
    chown -R node:node /usr/src/app

USER node

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 