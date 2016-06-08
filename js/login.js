function setName(){
	if(document.getElementById("text").value!=""){
		if(document.getElementById("text").value.length>10){
			document.getElementById("tips").innerHTML="你输入的昵称太长，请减少到十字以内";
		}else
			socket.emit("setName",document.getElementById("text").value);
	}
}