var socket = io();

function scrollToBottom(){
	//Selectors
	var messages = jQuery('#messages');
	var newMessage = messages.children('li:last-child');
	//Heights
	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight();

	if(clientHeight + scrollTop +newMessageHeight + lastMessageHeight>= scrollHeight){
		// console.log('Should scroll');
		messages.scrollTop(scrollHeight);
	}
}

socket.on('connect',()=>{
		console.log('Connected to server');
		var params = jQuery.deparam(window.location.search);
		socket.emit('join',params, function(error){
			if(error){
				alert(error);
				window.location.href='/';
			}else {
				console.log('No error');
			}
		});
});
socket.on('disconnect',()=>{
		console.log('Disconnected from server');
});

// socket.emit('createMessage',{
// 	from: 'Admin',
// 	text: 'Yep. That works for me'
// });

socket.on('newMessage',function(message) {
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = jQuery('#message-template').html();
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});

	jQuery('#messages').append(html);

	scrollToBottom();
	// console.log('newMessage',message);
	// var li = jQuery('<li></li>');
	// li.text(`${message.from} ${formattedTime} : ${message.text}`);

	// jQuery('#messages').append(li);
});

socket.on('newLocationMessage',function(message){
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = jQuery('#location-message-template').html();
	var html = Mustache.render(template, {
		from: message.from,
		url: message.url,
		createdAt: formattedTime
	});
	// var li = jQuery('<li></li>');
	// var a = jQuery('<a target = "_blank">My current location</a>');
	// li.text(`${message.from} ${formattedTime}:`);
	// a.attr('href',message.url);
	// li.append(a);
	jQuery('#messages').append(html);	
	scrollToBottom();
});

// socket.emit('createMessage',{
// 	from: 'Pokemon',
// 	text: 'hi'
// },function (value) {
// 	console.log(value,'Oh a pokemon');
// });

jQuery('#message-form').on('submit',function(e){
	e.preventDefault();

var messageTextbox = jQuery('[name=message]')

	socket.emit('createMessage',{
		from: 'User',
		text: messageTextbox.val()
	},function(){
		messageTextbox.val('');
	});
});

var locationButton = jQuery('#send-location');
locationButton.on('click',function(){
	if(!navigator.geolocation){
		return alert('Geolocation not supported by your browser. ');
	}

	locationButton.attr('disabled','disabled').text('Sending Location....');
	navigator.geolocation.getCurrentPosition(function(position){
		// console.log(position);
		locationButton.removeAttr('disabled').text('Send Location');
		socket.emit('createLocationMessage',{
			latitude: position.coords.latitude,
			longitude: position.coords.longitude,
		});
	},function(){
		locationButton.removeAttr('disabled').text('Send Location');
		alert('Unabel to fetch location.');
	});
});