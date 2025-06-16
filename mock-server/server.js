// /mock-server/server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('../mock-data/bd.json'); // caminho até bd.json
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);
server.listen(3000, () => {
  console.log('JSON Server está a correr em http://localhost:3000');
});
