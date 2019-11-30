/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function InfinitHunger(context,canvas){
	Debugger.log("InfinitHunger");
	(context === undefined)? this.context = 0 : this.context = context;
	(canvas === undefined)? this.canvas = 0 : this.canvas = canvas;
	const snake_init_speed = 3;
	const snake_init_length = 5;
	const amount_of_fruits_ingame = 3;
	
	var infinit_state = Game.STATE_IN_GAME;
	var img_snake_cnt = 0;
	var score = 0;
	var lifes = 1;
	var levelMultiplier = 0;
	var levelScoreDifference = 1000;
	var timer = new SecMinTimer();
	
	var bg = new Image();
	var img_normal = new Image();
	var img_overdrive = new Image();
	var img_special = new Image();
	var img_fruits = new Image();
	var oTitleImage = {};
	var timeintervalID = 0;
	var snakeintervalID = 0;
	var fruitintervalID = 0;
	var snake = {};
	var aFruits = [];
	var aFreeGridPositions = [];

	this.loadGame = function(){
		Debugger.log("startGame");
		img_normal.src = "images/snakeAssets/snake_tile_1.png";
		img_normal.addEventListener('load', startGame, false);
		img_overdrive.src = "images/snakeAssets/snake_tile_2.png";
		img_overdrive.addEventListener('load', startGame, false);
		img_special.src = "images/snakeAssets/snake_tile_3.png";
		img_special.addEventListener('load', startGame, false);
		img_fruits.src = "images/snakeAssets/fruits_tile.png";
		img_fruits.addEventListener('load', startGame, false);
	}

	function startGame(){
		img_snake_cnt+=1;
		if(img_snake_cnt==4){
			infinit_state = Game.STATE_IN_GAME;
			createPlayFieldArray();
			//			Debugger.log("aFreeGridPositions.length"+aFreeGridPositions.length);
			//			Debugger.log("length"+aFreeGridPositions.length);
			snake = new Snake(snake_init_length, snake_init_speed, Snake.MODE_NORMAL,{
				normal:img_normal,
				overdrive:img_overdrive,
				special:img_special
			});
			
			generateFruits();
			//			Debugger.log("aFreeGridPositions.length"+aFreeGridPositions.length);
			snake.initSnake();
			snake.drawSnake(context);
			//			Debugger.log("aFreeGridPositions.length"+aFreeGridPositions.length);
			playFieldMinusSnake();
			setScore(score);
			setLifes(lifes);
			//			Debugger.log("aFreeGridPositions.length"+aFreeGridPositions.length);
			timeintervalID = setInterval(updateTime, 1000);
			snakeintervalID = setInterval(updateSnake, 1000 / (snake.speed + (levelMultiplier*.5)));
			fruitintervalID = setInterval(updateFruits, getMillisecondsInterval(Game.frameRate));
		}
	}
	function createPlayFieldArray(){
		//		Debugger.log("createPlayFieldArray");
		for (rows = 0; rows < Game.PLAYFIELD_MAXPOSITION_HEIGHT; rows++) {
			for (colls = 0; colls < Game.PLAYFIELD_MAXPOSITION_WIDTH; colls++) {
				aFreeGridPositions.push({
					x:colls,
					y:rows
				});
			}
		}
	}
	function playFieldMinusSnake(){
		for (i = 0; i < snake.parts().length; i++) {
			gridFor : for (j = 0; j < aFreeGridPositions.length; j++) {
				if(snake.parts()[i].gridPosition.x == aFreeGridPositions[j].x && snake.parts()[i].gridPosition.y == aFreeGridPositions[j].y){
					aFreeGridPositions.splice(j, 1);
					break gridFor;
				}
			}
		}
	}
	function resumeGame(){
		snake = new Snake(snake_init_length, snake_init_speed, Snake.MODE_NORMAL,{
			normal:img_normal,
			overdrive:img_overdrive,
			special:img_special
		});
		snake.initSnake();
		snake.drawSnake(context);
		setScore(score);
		setLifes(lifes);
		snakeintervalID = setInterval(updateSnake, 1000 / (snake.speed + (levelMultiplier*.5)));
		fruitintervalID = setInterval(updateFruits, getMillisecondsInterval(Game.frameRate));
	}

	function gameOver(){
		infinit_state = Game.STATE_GAME_OVER;
		setLifes(lifes);
		clearInterval(fruitintervalID);
		clearInterval(timeintervalID);
		$('#game-over').css('visibility', 'visible');
		$('#game-over-score').text('SCORE : '+ stringDotify(score));
		$('#game-over').animate({
			top: 200
		},{
			duration: 500,
			easing: 'easeOutExpo'
		});
	}

	function removeHeadfromFreeGridPositions(oBodyPart){
		freegrid : for (i = 0; i < aFreeGridPositions.length; i++) {
			if(oBodyPart.gridPosition.x == aFreeGridPositions[i].x && oBodyPart.gridPosition.y == aFreeGridPositions[i].y){
				aFreeGridPositions.splice(i, 1);
				break freegrid;
			}
		}
	}

	function addTailToFreeGridPositions(oBodyPart){
		//		Debugger.log("addTailToFreeGridPositions");
		//		Debugger.obj(oBodyPart);
		aFreeGridPositions.push({
			x:oBodyPart.gridPosition.x,
			y:oBodyPart.gridPosition.y
		});
	}

	function updateSnake(){
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.drawImage(bg,Game.PLAYFIELD_XOFFSET-27,Game.PLAYFIELD_YOFFSET-48);
		context.drawImage(oTitleImage.i,oTitleImage._x,oTitleImage._y);
		updateFruits();
		var is_colided = snake.makeLonger(aFruits);
		removeHeadfromFreeGridPositions(snake.parts()[0]);
		var has_eaten = checkFruitCollision();
		if(!has_eaten){
			addTailToFreeGridPositions(snake.parts()[snake.parts().length-1]);
			snake.makeShorter();
		}
		//		Debugger.log("aFreeGridPositions.length"+aFreeGridPositions.length);
		//		for (var it = aFreeGridPositions.length-10; it < aFreeGridPositions.length-1; it++) {
		//			Debugger.log(aFreeGridPositions[it]);
		//		}
		if(!is_colided){
			snake.drawSnake(context);
		}
		else{
			clearInterval(snakeintervalID);
			clearInterval(fruitintervalID);
			function animSnake(){
				cnt-=.05;
				if(cnt > 0){
					context.globalAlpha = 1;
					context.clearRect(0, 0, canvas.width, canvas.height);
					context.drawImage(bg,Game.PLAYFIELD_XOFFSET-27,Game.PLAYFIELD_YOFFSET-48);
					context.drawImage(oTitleImage.i,oTitleImage._x,oTitleImage._y);
					context.globalAlpha = cnt;
					snake.drawSnake(context);
				}else{
					cnt=0;
					context.globalAlpha = 1;
					context.clearRect(0, 0, canvas.width, canvas.height);
					context.drawImage(bg,Game.PLAYFIELD_XOFFSET-27,Game.PLAYFIELD_YOFFSET-48);
					context.drawImage(oTitleImage.i,oTitleImage._x,oTitleImage._y);
					lifes-=1;
					if(lifes>0){
						resumeGame();
					}else{
						gameOver();
					}
					clearInterval(IDsnakeAnim);
				}
			}
			var cnt = 1;
			var IDsnakeAnim = setInterval(animSnake,getMillisecondsInterval(Game.frameRate));
		}
	}

	function updateTime(){
		$('#info-3').text('time '+ timer.getTimeString(SecMinTimer.min_sec));
	}

	function generateFruits(){
		for (i = 0; i < amount_of_fruits_ingame; i++) {
			aFruits.push(createFruit(null));
		}
	}

	function updateFruits(){
		for (i = 0; i < aFruits.length; i++) {
			if(aFruits[i].life<=0){
				aFruits.splice(i, 1, createFruit({
					x:aFruits[i].gridPosition.x,
					y:aFruits[i].gridPosition.y
				}));
			}
			aFruits[i].draw(context,bg);
		}
	}

	function createFruit(oToPush){
		Debugger.log("createFruit");
		//		Debugger.obj(oToPush);
		if(oToPush != null){
			//			Debugger.log("pushing");
			aFreeGridPositions.push(oToPush);
		}
		var rnd = randomFromTo(0,aFreeGridPositions.length);

		var freegridPosition = aFreeGridPositions[rnd];
		var multipl =levelMultiplier;
		if(multipl>7){
			multipl=7;
		}
		var fruit = new Fruit(img_fruits, new Number(randomFromTo(8-multipl*.5,12)), {
			x:freegridPosition.x,
			y:freegridPosition.y
		}, randomFromTo(0,9));

		aFreeGridPositions.splice(rnd, 1);
		//		Debugger.log("aFreeGridPositions.length"+aFreeGridPositions.length);
		//		for (var it = aFreeGridPositions.length-10; it < aFreeGridPositions.length-1; it++) {
		//			Debugger.log(aFreeGridPositions[it]);
		//		}
		//		Debugger.log("aFruits.length"+aFruits.length);
		return fruit;
	}


	function checkFruitCollision(){
		var snake_head = snake.head();
		for (i = 0; i < aFruits.length; i++) {
			if(aFruits[i].life!=0){
				if(snake_head.gridPosition.x == aFruits[i].gridPosition.x && snake_head.gridPosition.y ==  aFruits[i].gridPosition.y){
					//fruitCollision!!!
					score += aFruits[i].score;
					setScore(score);
					aFruits.splice(i, 1, createFruit(null));
					return true;
				}
			}
		}
		return false;
	}
	this.stopGame = function(){
		clearInterval(this.intervalID);
	}
	this.replay = function(){
		infinit_state = Game.STATE_IN_GAME;
		score = 0;
		lifes = 1;
		timer.reset();
		timeintervalID = setInterval(updateTime, 1000);
		resumeGame();
	}
	this.animateButtonsin = function(){
		$('#buttons-ingame').css('visibility', 'visible');
		$('#buttons-ingame').animate({
			opacity: 1
		},500);
	}

	this.animateScoreBoardin = function(){
		$('#scoreboard').css('visibility', 'visible');
		$('#scoreboard').animate({
			opacity: 1
		},500);
	}
	this.animateFooterin = function(){
		$('#footer').css('visibility', 'visible');
		$('#footer').animate({
			opacity: 1
		},500);
	}
	this.animateShares = function(){
		$('#general-share-buttons').css('visibility', 'visible');
		$('#general-share-buttons').animate({
			opacity: 1
		},500);
	}
	function setScore(score){
		if(levelScoreDifference < score){
			levelMultiplier += 1;
			Debugger.log("levelMultiplier" + levelMultiplier);
			levelScoreDifference = levelScoreDifference * 2;
			clearInterval(snakeintervalID);
			snakeintervalID = setInterval(updateSnake, 1000 / (snake.speed + levelMultiplier));
		}
		$('#info-1').text('score '+ score);
	}

	function setLifes(lifes){
		levelMultiplier = 0;
		$(".lifeimg").remove();
		for (i = 0; i < lifes; i++) {
			$('#info-2').append("<span class='lifeimg'></span>");
		}
	}

	this.drawbg = function(o){
		oTitleImage = o;
		bg.src = "images/snakeAssets/level1__.png";
		bg.addEventListener('load', drawbg, false);
		function drawbg(){
			var ID = setInterval(animLevel,getMillisecondsInterval(Game.frameRate));
			var cnt = 0;
			function animLevel(){
				if(context.globalAlpha < 1){
					cnt+=.05;
					context.globalAlpha = cnt;
					context.clearRect(0, 0, canvas.width, canvas.height);
					context.drawImage(bg,Game.PLAYFIELD_XOFFSET-27,Game.PLAYFIELD_YOFFSET-48);
					context.globalAlpha = 1;
					context.drawImage(oTitleImage.i,oTitleImage._x,oTitleImage._y);
					context.globalAlpha = cnt;

				}else{
					context.globalAlpha = 1;
					context.clearRect(0, 0, canvas.width, canvas.height);
					context.drawImage(bg,Game.PLAYFIELD_XOFFSET-27,Game.PLAYFIELD_YOFFSET-48);
					context.drawImage(oTitleImage.i,oTitleImage._x,oTitleImage._y);
					clearInterval(ID);
				}
			}
		}
	}

	this.updateKeylist = function(key_press_list){
		if(snake.canBeMoved()){
			if(key_press_list[38]==true){
				if(snake.currentDirection() != Snake.DIR_TOP_BOTTOM_FACE && snake.currentDirection() != Snake.DIR_TOP_BOTTOM_FACE_EATING && snake.currentDirection() != Snake.DIR_BOTTOM_TOP_FACE && snake.currentDirection() != Snake.DIR_BOTTOM_TOP_FACE_EATING){
					snake.changeDirection(Snake.DIR_BOTTOM_TOP_FACE);
				}
			}//UP
			if(key_press_list[37]==true){
				if(snake.currentDirection() != Snake.DIR_LEFT_RIGHT_FACE && snake.currentDirection() != Snake.DIR_LEFT_RIGHT_FACE_EATING && snake.currentDirection() != Snake.DIR_RIGHT_LEFT_FACE && snake.currentDirection() != Snake.DIR_RIGHT_LEFT_FACE_EATING){
					snake.changeDirection(Snake.DIR_RIGHT_LEFT_FACE);
				}
			}//LEFT
			if(key_press_list[39]==true){
				if(snake.currentDirection() != Snake.DIR_LEFT_RIGHT_FACE && snake.currentDirection() != Snake.DIR_LEFT_RIGHT_FACE_EATING && snake.currentDirection() != Snake.DIR_RIGHT_LEFT_FACE && snake.currentDirection() != Snake.DIR_RIGHT_LEFT_FACE_EATING){
					snake.changeDirection(Snake.DIR_LEFT_RIGHT_FACE);
				}
			}//RIGHT
			if(key_press_list[40]==true){
				if(snake.currentDirection() != Snake.DIR_TOP_BOTTOM_FACE && snake.currentDirection() != Snake.DIR_TOP_BOTTOM_FACE_EATING && snake.currentDirection() != Snake.DIR_BOTTOM_TOP_FACE && snake.currentDirection() != Snake.DIR_BOTTOM_TOP_FACE_EATING){
					snake.changeDirection(Snake.DIR_TOP_BOTTOM_FACE);
				}
			}//DOWN
		}
	}
	this.getState = function(){
		return infinit_state;
	}
	
}

InfinitHunger.prototype.initInfinitHunger = function(o){
	this.drawbg(o);
	$('#ingame').css('visibility', 'visible');
	$('#btn-1-ingame').css('background-position', '-138px 0');
	$('#btn-1-ingame').css('cursor', 'auto');
	setTimeout(this.animateButtonsin,500);
	setTimeout(this.animateScoreBoardin,1000);
	setTimeout(this.animateShares,1150);
	setTimeout(this.animateFooterin,1300);
	setTimeout(this.loadGame,1500);
}