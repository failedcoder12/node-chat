const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname,'../public');
// console.log(__dirname + '/../public');
// console.log(publicPath);
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);

app.use(express.static(publicPath));

server.listen(port, ()=> {
	console.log(`Server is up on ${port}`);
});

console.log('hello world');