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
	this.throw=false;
	this.hv=0;		//横向速度
	this.vv=0;		//竖直速度
	this.win=false;
	this.animecount=0;
	this.anime=new Array(e.Resource.pic[0]);
	this.animeIndex=0;
	this.col_width=20;
	this.col_height=28;
	this.saysth=false;
	this.sayct=0;
	this.saymsg="";
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

Player.prototype.say=function(){
	if(this.saysth){
		e.ctx.strokeStyle="black";
		e.ctx.fillStyle="white";
		e.ctx.beginPath();
		var width=this.saymsg.getWidth();
		e.ctx.moveTo(this.position.x+14-width/2,this.position.y-20);
		e.ctx.lineTo(this.position.x+14+width/2,this.position.y-20);
		e.ctx.lineTo(this.position.x+14+width/2,this.position.y-5);
		e.ctx.lineTo(this.position.x+16,this.position.y-5);
		e.ctx.lineTo(this.position.x+14,this.position.y);
		e.ctx.lineTo(this.position.x+13,this.position.y-5);
		e.ctx.lineTo(this.position.x+14-width/2,this.position.y-5);
		e.ctx.closePath();
		e.ctx.fill();
		e.ctx.stroke();
		e.ctx.textAlign="center";
		e.ctx.fillStyle="black";
		var index=0;
		var wd=0;
		e.ctx.fillText(this.saymsg,this.position.x+14,this.position.y-9);
		this.sayct++;
		if(this.sayct>360){
			this.sayct=0;
			this.saysth=false;
			this.saymsg="";
		}
	}
}

Player.prototype.draw=function(){			//将图片绘制在canvas上
	if(this.index==0)
		e.ctx.fillStyle="green";
	else
		e.ctx.fillStyle="white";
	e.ctx.textAlign="center";
	e.ctx.fillText(this.name,this.position.x+16,this.position.y-5);
	e.ctx.drawImage(this.sprite,this.position.x,this.position.y);
	this.say();
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

Player.prototype.bethrow=function(dir){
	if(dir){
		this.position.x-=0.1;
		this.hv=-2;
	}else{
		this.position.x+=0.1;
		this.hv=2;
	}
	this.stop=true;
	this.vv=-5;
}

Player.prototype.back=function(){
	this.position=new Position(maps[e.level].startpos.x,maps[e.level].startpos.y);
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
					socket.emit("push",e.Players[j].name,true);
				}
				if(e.Players[0].throw&&e.Players[0].animeIndex!=7&&e.Players[0].animeIndex!=14){
					socket.emit("throw",e.Players[j].name,true);
				}
			}
			if(e.Players[j].isPointInPath(e.Players[0].col[4])||e.Players[j].isPointInPath(e.Players[0].col[5])){
				if(e.Players[j].left){
					trg_r=false;
				}else{
					socket.emit("push",e.Players[j].name,false);
				}
				if(e.Players[0].throw&&e.Players[0].animeIndex!=7&&e.Players[0].animeIndex!=14){
					socket.emit("throw",e.Players[j].name,false);
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

function Map(){
	this.startpos=new Position(200,300);
	this.endpos=new Position(500,300);
	this.Cubes=new Array();
}

Map.prototype.draw=function(){
	e.ctx.fillStyle="rgba(247,240,210,0.7)";
	e.ctx.fillRect(this.startpos.x-50,this.startpos.y-50,132,150);
	e.ctx.fillStyle="black";
	e.ctx.fillRect(this.endpos.x,this.endpos.y-50,3,50);
	e.ctx.fillStyle="red";
	e.ctx.beginPath();
	e.ctx.moveTo(this.endpos.x+3,this.endpos.y-50);
	e.ctx.lineTo(this.endpos.x+23,this.endpos.y-40);
	e.ctx.lineTo(this.endpos.x+3,this.endpos.y-30);
	e.ctx.fill();
}

Map.prototype.check=function(){						//胜利检测

	e.ctx.beginPath();
	e.ctx.moveTo(e.Players[0].position.x+3,e.Players[0].position.y);
	e.ctx.lineTo(e.Players[0].position.x+3+24,e.Players[0].position.y);
	e.ctx.lineTo(e.Players[0].position.x+3+24,e.Players[0].position.y+32);
	e.ctx.lineTo(e.Players[0].position.x+3,e.Players[0].position.y+32);
	e.ctx.closePath();

	if(e.ctx.isPointInPath(this.endpos.x,this.endpos.y-20)){
		return true;
	}else{
		return false;
	}

}

function Engine(){
	this.tkb=document.getElementById("tkb");
	this.content=document.getElementById("content");
	this.tkb_txt=document.getElementById("tkb_txt");
	this.canvas=document.getElementById("mycanvas");
	this.ctx=this.canvas.getContext("2d");
	this.Resource=new resource();
	this.Cubes=new Array();
	this.Players=new Array();
	this.gravity=3;			//重力
	this.level=0;
	this.time=0;
	this.playercount=0;
	this.ischeck=false;
	this.checkcount=0;
	this.talkboard=false;
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

Engine.prototype.drawInfo=function(){
	this.ctx.fillStyle="gray";
	this.ctx.fillRect(0,0,800,25);
	this.ctx.fillStyle="black";
	var mp="地图："+this.level;
	this.ctx.fillText(mp,100,15);
	var tm="剩余时间："+parseInt((300-this.time)/60)+":"+(300-this.time)%60;
	this.ctx.fillText(tm,300,15);
	var pc="玩家数："+this.playercount;
	this.ctx.fillText(pc,500,15);
}

function close(){
	socket.emit("close",e.Players[0].name);
	e.Players.splice(0,1);
}
window.onbeforeunload=close;


function check(){
	if(e.ischeck){
		e.ctx.fillStyle="rgba(255,0,0,0.5)";
		e.ctx.fillRect(0,0,1000,1000);
		e.checkcount++;
		if(e.checkcount<=1){
			if(e.Players[0].position.x<maps[e.level].startpos.x-50||e.Players[0].position.x>maps[e.level].startpos.x+82||e.Players[0].position.y>maps[e.level].startpos.y+100||e.Players[0].position.y<maps[e.level].startpos.y-50){
				if(e.Players[0].animeIndex!=7&&e.Players[0].animeIndex!=14){
					e.Players[0].back();
				}
			}
		}
		if(e.checkcount>3){
			e.checkcount=0;
			e.ischeck=false;
		}
	}
}

function sendmessage(){
	socket.emit("sendmessage",e.Players[0].name,e.tkb_txt.value.substring(0,30).replace(/(^\s*)|(\s*$)/g,''));
	e.tkb_txt.value="";
}

String.prototype.getWidth = function(fontSize)  //获取字符串宽度
{  
    var span = document.getElementById("__getwidth");  
    if (span == null) {  
        span = document.createElement("span");  
        span.id = "__getwidth";  
        document.body.appendChild(span);  
        span.style.visibility = "hidden";  
        span.style.whiteSpace = "nowrap";  
    }  
    span.innerText = this;  
    span.style.fontSize = fontSize + "px";  
  
    return span.offsetWidth;  
}  

function update(){				//准备完毕后引擎运行
	e.ctx.clearRect(0,0,1000,1000);
	e.Cubes=maps[e.level].Cubes;
	for(var i=0;i<e.Cubes.length;i++){
		e.Cubes[i].draw();
	}
	maps[e.level].draw();
	check();
	e.Players[0].playanime();
	for(var i=0;i<e.Players.length;i++){
		if(!e.Players[i].win)
			e.Players[i].draw();
	}
	e.drawInfo();
	e.Players[0].action();
	if(maps[e.level].check()){
		this.socket.emit("win",e.Players[0].name);
		e.Players[0].win=true;
	}
	if(e.talkboard){
		e.tkb.style.display="block";
		e.content.focus();
		e.tkb_txt.focus();
	}
	else
		e.tkb.style.display="none";
	e.Players[0].throw=false;
	socket.emit("postInfo",e.Players[0].position,e.Players[0].animeIndex,e.Players[0].name,e.Players[0].left,e.Players[0].right);
	setTimeout(update,1000/60);
}



var socket=io.connect();
var maps=new Array();
var map1=new Map();
map1.startpos=new Position(100,300);
map1.endpos=new Position(700,400);
map1.Cubes.push(new Cube(new Array(new Position(0,400),new Position(800,400),new Position(800,500),new Position(0,500))));
maps.push(map1);
var map2=new Map();
map2.startpos=new Position(100,300);
map2.endpos=new Position(375,350);
map2.Cubes.push(new Cube(new Array(new Position(0,400),new Position(800,400),new Position(800,500),new Position(0,500))));
map2.Cubes.push(new Cube(new Array(new Position(350,350),new Position(400,350),new Position(400,400),new Position(350,400))));
maps.push(map2);
var e=new Engine();
