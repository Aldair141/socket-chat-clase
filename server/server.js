const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');

const app = express();
const port = process.env.PORT || 2300;

app.use(express.static(path.resolve(__dirname, '../public')));
let server = http.createServer(app);
module.exports.io = socketIO(server);

require('./socket/socket');

server.listen(port, (err) => {
    if (err) throw err;

    console.log(`Escuchando el puerto ${ port }`);
});