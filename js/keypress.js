window.onkeydown=function(event){
		var ent=event||window.event;
		if(ent&&ent.keyCode==32){
			e.Players[0].throw=true;
		}
		if(ent&&ent.keyCode==38){
			e.Players[0].jump=true;
		}
		if(ent&&ent.keyCode==37){
			e.Players[0].stop=false;
			e.Players[0].left=true;
			e.Players[0].dir=false;
		}
		if(ent&&ent.keyCode==39){
			e.Players[0].stop=false;
			e.Players[0].right=true;
			e.Players[0].dir=true;
		}
		if(ent&&ent.keyCode==40){
			e.Players[0].down=true;
		}
	}
	window.onkeyup=function(event){
		var ent=event||window.event;
		if(ent&&ent.keyCode==38){
			e.Players[0].jump=false;
		}
		if(ent&&ent.keyCode==37){
			e.Players[0].left=false;
			if(!e.Players[0].fly)
				e.Players[0].stop=true;
			if(!e.Players[0].down)
				e.Players[0].anime=new Array(e.Resource.pic[0]);
		}
		if(ent&&ent.keyCode==39){
			e.Players[0].right=false;
			if(!e.Players[0].fly)
				e.Players[0].stop=true;
			if(!e.Players[0].down)
				e.Players[0].anime=new Array(e.Resource.pic[0]);
		}
		if(ent&&ent.keyCode==40){
			e.Players[0].down=false;
			e.Players[0].anime=new Array(e.Resource.pic[0]);
			e.Players[0].col_height=28;
		}
	}
