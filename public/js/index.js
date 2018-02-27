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
	var li = jQuery('<li></li>');
	li.text(`${message.from}: ${message.text}`);

	jQuery('#messages').append(li);
});

// socket.emit('createMessage',{
// 	from: 'Pokemon',
// 	text: 'hi'
// },function (value) {
// 	console.log(value,'Oh a pokemon');
// });

jQuery('#message-form').on('submit',function(e){
	e.preventDefault();
	socket.emit('createMessage',{
		from: 'User',
		text: jQuery('[name=message]').val()
	},function(){

	});
});