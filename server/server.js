const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {isRealString} = require('./utils/validation.js');
const {Users} = require('./utils/users');
const {generateMessage,generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname,'../public');
// console.log(__dirname + '/../public');
// console.log(publicPath);
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
app.use(express.static(publicPath));

io.on('connection',(socket) => {
	console.log('New user connected');

socket.on('join',(params,callback)=> {
	if (!isRealString(params.name) || !isRealString(params.room)){
		return callback('Name and room are required');
	}

	socket.join(params.room);
	//socket.leave('The office fans');
	
	//io.emit -> io.to('The office fans').emit
	//socket.broadcast.emit -> socket.broadcast.to('The office Fans').emit
	//socket.emit -> 
	users.removeUser(socket.id);
	users.addUser(socket.id,params.name, params.room);
	io.to(params.room).emit('updateUserList',users.getUserList(params.room));
	socket.emit('newMessage',generateMessage('Admin','Welcome to the Forum'));
	socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined`));


	callback();
});	

socket.on('createMessage',(message,callback)=> {
	console.log('createMessage',message);

	io.emit('newMessage',generateMessage(message.from,message.text));
	callback('This is from the server.');
	// socket.broadcast.emit('newMessage',message,{
	// 	from: message.from,
	// 	text: message.text,
	// 	createAt: new Date().getTime()
	// });
});

socket.on('createLocationMessage',(coords) =>{
	io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));
});

// socket.emit('newMessage',{
// 	from: 'User',
// 	text: 'Ok',
// 	createAt: 12312
// });
	socket.on('disconnect',()=>{
		console.log('User was disconnected');
		var user = users.removeUser(socket.id);
		if(user) {
			io.to(user.room).emit('updateUserList',users.getUserList(user.room));
			io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));	
		}
	});
});

server.listen(port, ()=> {
	console.log(`Server is up on ${port}`);
});

