var express=require("express");
var app=express();
var server=require("http").createServer(app);
var io=require("socket.io").listen(server);
app.use('/',express.static(__dirname));
server.listen(80);
console.log("server started");

function Player(name){
	this.name=name;
}

var players=new Array();


io.on("connection",function(socket){
	socket.on("postInfo",function(pos,sprite,name){
		socket.broadcast.emit("getInfo",pos,sprite,socket.index,name);
	});
	socket.on("setName",function(name){
		for(var i=0;i<players.length;i++){
			if(name==players[i].name){
				socket.emit("nameerror");
				return;
			}
		}
		socket.index=players.length;
		socket.name=name;
		players.push(new Player(name));
		console.log(name+" is connected");
		socket.emit("loginsuccess");
	});
})

