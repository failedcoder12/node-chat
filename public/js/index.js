var socket = io();
socket.on('connect',()=>{
		console.log('Connected to server');
});
socket.on('disconnect',()=>{
		console.log('Disconnected from server');
});

// socket.emit('createMessage',{
// 	from: 'Admin',
// 	text: 'Yep. That works for me'
// });

socket.on('newMessage',function(message) {
	console.log('newMessage',message);
});

socket.emit('createMessage',{
	from: 'Pokemon',
	text: 'hi'
});