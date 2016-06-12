function Position(x,y){
	this.x=x;
	this.y=y;
}


function Player(pos,sprite_index,name,index){
	this.position=pos;
	this.sprite=e.Resource.pic[sprite_index];
	this.name=name;
	this.index=index;
	this.stop=true;
	this.down=false;
	this.left=false;
	this.right=false;
	this.jump=false;
	this.dir=true;
	this.fly=true;
	this.hv=0;		//横向速度
	this.vv=0;		//竖直速度
	this.animecount=0;
	this.anime=new Array(e.Resource.pic[0]);
	this.animeIndex=0;
	this.col_width=20;
	this.col_height=28;
	this.col=new Array();
	this.setCol();
}

Player.prototype.setCol=function(){   //设置角色的八个碰撞检测点
	this.col=new Array(new Position(this.position.x+14-this.col_width/2-1,this.position.y+32-this.col_height+3),new Position(this.position.x+14-this.col_width/2-1,this.position.y+32-this.col_height+this.col_height-3),new Position(this.position.x+14-this.col_width/2+2,this.position.y+32-this.col_height+3),new Position(this.position.x+14+this.col_width/2-3,this.position.y+32-this.col_height+3),new Position(this.position.x+14-this.col_width/2+this.col_width,this.position.y+32-this.col_height+3),new Position(this.position.x+14-this.col_width/2+this.col_width,this.position.y+32-this.col_height+this.col_height-3),new Position(this.position.x+14-this.col_width/2+2,this.position.y+32),new Position(this.position.x+14+this.col_width/2-3,this.position.y+32));
	e.ctx.fillStyle="black";
}

Player.prototype.playanime=function(){		//播放角色动画
	this.sprite=this.anime[parseInt(this.animecount/6)%this.anime.length];
	for(var i=0;i<e.Resource.pic.length;i++){
		if(this.sprite.src==e.Resource.pic[i].src){
			this.animeIndex=i;
		}
	}
	this.animecount++;
}

Player.prototype.draw=function(){			//将图片绘制在canvas上
	if(this.index==0)
		e.ctx.fillStyle="green";
	else
		e.ctx.fillStyle="white";
	e.ctx.textAlign="center";
	e.ctx.fillText(this.name,this.position.x+16,this.position.y-5);
	e.ctx.drawImage(this.sprite,this.position.x,this.position.y);
}

Player.prototype.friction=function(){		//角色摩擦力作用
	var frif=0.02;
	if(!this.down)
		frif=0.04;
	if(this.stop){
		if(this.hv>0){
			this.hv-=frif;
		}else{
			this.hv+=frif;
		}
	}
	if(Math.abs(this.hv)<0.2){
		this.hv=0;
		this.stop=false;
	}
}

Player.prototype.isPointInPath=function(pos){		//角色之间是否碰撞
	e.ctx.beginPath();
	e.ctx.moveTo(this.position.x,this.position.y+32-this.col_height);
	e.ctx.lineTo(this.position.x+24,this.position.y+32-this.col_height);
	e.ctx.lineTo(this.position.x+24,this.position.y+32);
	e.ctx.lineTo(this.position.x,this.position.y+32);
	e.ctx.closePath();
	if(e.ctx.isPointInPath(pos.x,pos.y)){
		return true;
	}else{
		return false;
	}
}

Player.prototype.push=function(dir){
	if(dir){
		this.position.x-=0.1;
	}else{
		this.position.x+=0.1;
	}
	this.setCol();
}

Player.prototype.action=function(){		//每个时间间隔角色的状态改变
	/***********
	*
	*如果角色在不在地上时设置其动画
	*
	***********/
	if(this.fly||this.vv!=0){	
		this.fly=true;
		if(this.dir){
			this.anime=new Array(e.Resource.pic[1],e.Resource.pic[2],e.Resource.pic[3],e.Resource.pic[4],e.Resource.pic[5],e.Resource.pic[6]);
		}else{
			this.anime=new Array(e.Resource.pic[6],e.Resource.pic[5],e.Resource.pic[4],e.Resource.pic[3],e.Resource.pic[2],e.Resource.pic[1]);
		}
	}else{
		this.anime=new Array(e.Resource.pic[0]);
	}
	/*************
	*
	*角色没有趴下时角色移动以及设置动画
	*
	*************/
	if(!this.down){
		if(this.left){
			this.hv=-1;
			this.stop=false;
			if(!this.fly)
				this.anime=new Array(e.Resource.pic[8],e.Resource.pic[9],e.Resource.pic[10],e.Resource.pic[9]);
		}
		if(this.right){
			this.hv=1;
			this.stop=false;
			if(!this.fly)
				this.anime=new Array(e.Resource.pic[11],e.Resource.pic[12],e.Resource.pic[13],e.Resource.pic[12]);
		}
	}else{
		if(!this.fly){				//角色未接触地面时
			this.stop=true;
			this.col_height=18;
		}
	}
	this.vv+=e.gravity*60/1000;
	if(this.vv>7)
		this.vv=7;
	this.friction();
	if(this.vv>0){
		var cont=true;
		for(var i=0;i<this.vv;i+=0.1){
			for(var j=0;j<e.Cubes.length;j++){
				if(e.Cubes[j].isPointInPath(e.Players[0].col[6])||e.Cubes[j].isPointInPath(e.Players[0].col[7])){	//跳起过程中脚部是否落地
					this.vv=0;
					cont=false;
					if(this.fly)
						this.stop=true;
					this.fly=false;
					if(this.down){
						if(this.dir)
							this.anime=new Array(e.Resource.pic[7]);
						else
							this.anime=new Array(e.Resource.pic[14]);
					}else{
						if(this.jump){
							this.vv=-5;
							this.fly=true;
						}
					}
				}
			}
			for(var j=1;j<e.Players.length;j++){
				if(e.Players[j].isPointInPath(e.Players[0].col[6])||e.Players[j].isPointInPath(e.Players[0].col[7])){
					this.vv=0;
					cont=false;
					if(this.fly)
						this.stop=true;
					this.fly=false;
					if(this.down){
						if(this.dir)
							this.anime=new Array(e.Resource.pic[7]);
						else
							this.anime=new Array(e.Resource.pic[14]);
					}else{
						if(this.jump){
							this.vv=-5;
							this.fly=true;
						}
					}
				}
			}
			if(cont){
				this.position.y+=0.1;
				this.setCol();
			}
		}
	}else{							
		var cont=true;
		for(var i=0;i>this.vv;i-=0.1){
			for(var j=0;j<e.Cubes.length;j++){
				if(e.Cubes[j].isPointInPath(e.Players[0].col[2])||e.Cubes[j].isPointInPath(e.Players[0].col[3])){    	//跳起过程中头部是否碰撞
					this.vv=0;
					cont=false;
				}
			}
			for(var j=1;j<e.Players.length;j++){
				if(e.Players[j].isPointInPath(e.Players[0].col[2])||e.Players[j].isPointInPath(e.Players[0].col[3])){   
					this.vv=0;
					socket.emit("up",e.Players[j].name,-2);
					cont=false;
				}
			}
			if(cont){
				this.position.y-=0.1;
				this.setCol();
			}
		}
	}
	var trg_l=true;
	var trg_r=true;				//左右移动是否碰撞标志
	for(var i=0;i<Math.abs(this.hv);i+=0.1){
		for(var j=0;j<e.Cubes.length;j++){
			if(e.Cubes[j].isPointInPath(e.Players[0].col[0])||e.Cubes[j].isPointInPath(e.Players[0].col[1])){
				trg_l=false;
			}
			if(e.Cubes[j].isPointInPath(e.Players[0].col[4])||e.Cubes[j].isPointInPath(e.Players[0].col[5])){
				trg_r=false;
			}
		}
		for(var j=1;j<e.Players.length;j++){
			if(e.Players[j].isPointInPath(e.Players[0].col[0])||e.Players[j].isPointInPath(e.Players[0].col[1])){
				if(e.Players[j].right){
					trg_l=false;
				}else{
					var bl=true;
					socket.emit("push",e.Players[j].name,bl);
				}
			}
			if(e.Players[j].isPointInPath(e.Players[0].col[4])||e.Players[j].isPointInPath(e.Players[0].col[5])){
				if(e.Players[j].left){
					trg_r=false;
				}else{
					var bl=true;
					socket.emit("push",e.Players[j].name,false);
				}
			}
		}
		if(this.hv>0&&trg_r){
			this.position.x+=0.1;
		}
		if(this.hv<0&&trg_l){
			this.position.x-=0.1;
		}
		this.setCol();
	}
}


function Cube(posArr){			//游戏中障碍物以及墙面
	this.posArr=posArr;
}

Cube.prototype.draw=function(){
	e.ctx.fillStyle="rgb(201,153,126)";
	e.ctx.beginPath();
	e.ctx.moveTo(this.posArr[0].x,this.posArr[0].y);
	for(var i=1;i<this.posArr.length;i++){
		e.ctx.lineTo(this.posArr[i].x,this.posArr[i].y);
	}
	e.ctx.closePath();
	e.ctx.fill();
}

Cube.prototype.isPointInPath=function(pos){
	e.ctx.beginPath();
	e.ctx.moveTo(this.posArr[0].x,this.posArr[0].y);
	for(var i=1;i<this.posArr.length;i++){
		e.ctx.lineTo(this.posArr[i].x,this.posArr[i].y);
	}
	e.ctx.closePath();
	if(e.ctx.isPointInPath(pos.x,pos.y)){
		return true;
	}else{
		return false;
	}
}

function Engine(){
	this.canvas=document.getElementById("mycanvas");
	this.ctx=this.canvas.getContext("2d");
	this.Resource=new resource();
	this.Cubes=new Array();
	this.Players=new Array();
	this.gravity=3;			//重力
	this.Resource.check();
}

Engine.prototype.run=function(){
	this.aaa();
}

Engine.prototype.aaa=function(){
	if(!this.Resource.allready){
		var k=setTimeout(this.aaa(),10);
	}else{
		clearTimeout(k);
		update();
	}
}

function close(){
	socket.emit("close",e.Players[0].name);
	e.Players.splice(0,1);
}
window.onbeforeunload=close;


function update(){				//准备完毕后引擎运行
	e.ctx.clearRect(0,0,1000,1000);
	for(var i=0;i<e.Cubes.length;i++){
		e.Cubes[i].draw();
	}
	e.Players[0].playanime();
	for(var i=0;i<e.Players.length;i++){
		e.Players[i].draw();
	}
	e.Players[0].action();
	socket.emit("postInfo",e.Players[0].position,e.Players[0].animeIndex,e.Players[0].name,e.Players[0].left,e.Players[0].right);
	setTimeout(update,1000/60);
}



var socket=io.connect();
var e=new Engine();
e.Cubes.push(new Cube(new Array(new Position(0,450),new Position(800,450),new Position(800,500),new Position(0,500))));
e.Cubes.push(new Cube(new Array(new Position(300,350),new Position(400,350),new Position(400,400),new Position(300,400))));
