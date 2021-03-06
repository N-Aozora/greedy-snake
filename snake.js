
	var lists;
	var snake=[];	//存储小蛇
	var food=[];	//存储食物
	var column=50;	//列数
	var line=25;	//行数
	var timer;
	var onkey=true;   //按键控制开关
	var score=0;    //记录得分
	var starttime;
	var gametime;

	window.onload=function(){
		var oul=document.getElementById("wrap").getElementsByTagName("ul");
		oul[0].style.width=column*18+"px";
		oul[1].style.width=column*18+"px";
		document.getElementById("wrap").style.width=column*18-1+"px";
		document.getElementById("playground").style.height=line*18-1+"px";
		document.getElementById("space").style.width=column*18-1+"px";
		for(var k=0;k<column;k++){
			for(var h=0;h<4;h++){
				var li=document.createElement("li");
				oul[0].appendChild(li);
			}
		}
		for(var i=0;i<column;i++){
			for(var j=0;j<line;j++){
				var li=document.createElement("li");
				oul[1].appendChild(li);
			}
		}
		lists=oul[1].getElementsByTagName("li");
		addfood();
		snake[0]={x:Math.floor(column/2),y:Math.floor(line/2),direction:false,turn:null}; //direction记录方向,turn记录转折点
		change();
		document.onkeydown=control;
		timer=setInterval(move,200);
		starttime=new Date();
		gametime=setInterval(time,1000);
	}

	function random(num){
		return Math.floor(Math.random()*num);
	}

	// 计时
	function time(){
		var nowtime=new Date();
		var time=(nowtime.getTime()-starttime.getTime())/1000;
		var h=Math.floor(time/3600);
		var m=Math.floor(time%3600/60);
		var s=Math.floor(time%3600%60);
		h=h<10?"0"+h:h;
		m=m<10?"0"+m:m;
		s=s<10?"0"+s:s;
		document.getElementsByClassName("time")[0].innerHTML=h+":"+m+":"+s;
	}

	// 添加食物
	function addfood(){
		if(food.length==0){
			for(var i=0;i<10;i++){				
				food[i]=checkfood();
			}
		}else{
			food.push(checkfood());
		}
		for(var j=0;j<food.length;j++){
			var index=food[j].x+food[j].y*column;
			lists[index].className="food";
		}
	}

	// 检查食物位置是否重复
	function checkfood(){
		var x=random(column);
		var y=random(line);
		while(function(){
			for(var i=0;i<food.length;i++){
				if(food[i].x==x&&food[i].y==y) return true;
			}
			for(var j=0;j<snake.length;j++){
				if(snake[j].x==x&&snake[j].y==y) return true;
			}
			return false;
		}()){
			x=random(column);
			y=random(line);
		}
		return {x:x,y:y};
	}

	// 方向控制
	function control(event){
		if(onkey){
			var e=event||window.event;
			var nowdire=snake[0].direction;
			if(e.keyCode==37){
				if(nowdire=="right"&&snake.length>1) return;
				var dire='left';
			}else if(e.keyCode==39){
				if(nowdire=="left"&&snake.length>1) return;
				var dire='right';
			}else if(e.keyCode==38){
				if(nowdire=="bottom"&&snake.length>1) return;
				var dire='top';
			}else if(e.keyCode==40){
				if(nowdire=="top"&&snake.length>1) return;
				var dire='bottom';
			}
			if(!dire||dire==nowdire){
				return;
			}else{
				snake[0].direction=dire;
				addturn();
			}
			onkey=false;
		}
	}

	// 定时移动
	function move(){
		for(var i=0;i<snake.length;i++){
			var index=snake[i].x+snake[i].y*column;
			lists[index].removeAttribute("class");
			switch(snake[i].direction){
				case "left":
					snake[i].x--;
					break;
				case "right":
					snake[i].x++;
					break;
				case "top":
					snake[i].y--;
					break;
				case "bottom":
					snake[i].y++;
					break;
			}
		}
		check();
		checkturn();
		change();
	}

	// 碰撞检测
	function check(){
		var duang=false;
		for(var i=1;i<snake.length;i++){
			if(snake[i].x+snake[i].y*column==snake[0].x+snake[0].y*column) duang=true;
		}
		if(snake[0].x<0||snake[0].x>column-1||snake[0].y<0||snake[0].y>line-1||duang){
			gameover();
			return;
		}
		var index=snake[0].x+snake[0].y*column;
		if(lists[index].className=="food"){
			for(var j=0;j<food.length;j++){
				if(food[j].x+food[j].y*column==snake[0].x+snake[0].y*column) food.splice(j,1);
			}
			var _dire=snake[0].direction;
			var _x=_dire=="left"?-1:(_dire=="right"?1:0);
			var _y=_dire=="top"?-1:(_dire=="bottom"?1:0);
			var newhead={x:snake[0].x+_x,y:snake[0].y+_y,direction:_dire,turn:null};
			snake.unshift(newhead);
			snake[1].turn=[];
			readscore();
		}
	}

	// 添加转折点
	function addturn(){
		var nowturn={x:snake[0].x,y:snake[0].y,nextdirection:snake[0].direction};
		for(var i=1;i<snake.length;i++){
			snake[i].turn.push(nowturn);
		}
	}

	// 路径检测
	function checkturn(){
		for(var i=1;i<snake.length;i++){
			if(snake[i].turn.length>0&&snake[i].x==snake[i].turn[0].x&&snake[i].y==snake[i].turn[0].y){
				snake[i].direction=snake[i].turn[0].nextdirection;
				snake[i].turn.splice(0,1)
			}
		}
	}

	// 改变得分
	function readscore(){
		score+=100;
		document.getElementsByClassName("score")[0].textContent=score;
	}

	function gameover(){
		clearInterval(timer);
		clearInterval(gametime);
		alert("GAME OVER!");
		change=null;
	}

	function change(){
		for(var i=0;i<snake.length;i++){
			var index=snake[i].x+snake[i].y*column;
			lists[index].className="snake";
		}
		if(food.length<3) addfood();
		onkey=true;
	}
