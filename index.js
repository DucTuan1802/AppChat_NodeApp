var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var fs = require("fs");
server.listen(process.env.PORT || 3000);

console.log('Server Running');

app.get("/", function(req, res){
	res.sendFile(__dirname + "/index.html");	
});

var arrayUser = [];
var existFlag = true;
io.sockets.on('connection',function(socket){
	console.log('User connected');

	socket.on('client-send-data',function(data){
		console.log("server receive:" + data);
		//io.sockets.emit('server-send-data',{content:data});
	});
	//---------- user register --------------//
	socket.on('client-register-user',function(data){
		if(arrayUser.indexOf(data) == -1){
			// khong ton tai user
			arrayUser.push(data);
			existFlag = false;
			console.log("register success:" + data);
			//gan ten user cho socket
			socket.un = data;
			// send registed user
			io.sockets.emit('server-send-user',{userList:arrayUser});
		}else{
			console.log("user exist:" + data);
			existFlag = true;
		}
		//send register user
		socket.emit('server-send-result',{result:existFlag});
		//io.sockets.emit('server-send-data',{content:data});
	});
	//------- client send chat-------------//
	socket.on('client-send-chat',function(message){
		console.log(socket.un + ": " + message);
		io.sockets.emit('server-send-chat',{chatContent:socket.un + ": " + message});
	});

});
