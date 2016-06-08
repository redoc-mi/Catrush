function resource(){
	this.pic=new Array();
	this.allready=false;
	this.count=0;
	this.load();
	this.check();
};

resource.prototype.load=function(){
	for(var i=1;i<16;i++){
			var k=new Image();
			k.src="resources/"+i+".png";
			this.pic.push(k);
			k.onload=this.add();
		}
}
resource.prototype.add=function(){
	this.count++;
}
resource.prototype.check=function(){
	if(this.count<15){
		setTimeout(this.check(),100);
	}else{
		this.allready=true;
	}
}
