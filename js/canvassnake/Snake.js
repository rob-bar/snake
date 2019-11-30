/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function Snake(length,speed,mode,images){
	(length === undefined)? this.length = 5 : this.length = length;
	(speed === undefined)? this.speed = 1 : this.speed = speed;
	(mode === undefined)? this.mode = Snake.MODE_NORMAL : this.mode = mode;
	(images === undefined)? this.images = {} : this.images = images;

	var aParts = [];
	var oImages = images;
	var current_direction = null;
	var canmovMe = true;
	var should_grow = false;
	this.initMe = function(){
		generateRandomSnake();
	}

	function generateRandomSnake(){
		Debugger.log("generateRandomSnake");
		var headPart = new BodyPart(0,{
			x:randomFromTo(10, 25),
			y:randomFromTo(8, 12)
		});
		aParts.push(headPart);
		for (i = 1; i < length; i++) {
			if(i>1){
				var prevprevPart = aParts[i-2];
			}else{
				var prevprevPart = null;
			}
			
			var prevPart = aParts[i-1];
			var snakePart = null;

			if (Math.random()>.5){
				if (Math.random()>.5){
					snakePart = new BodyPart(i,{
						x:prevPart.gridPosition.x+1,
						y:prevPart.gridPosition.y
					});
					if(prevprevPart!=null){
						if(prevprevPart.gridPosition.x == snakePart.gridPosition.x && prevprevPart.gridPosition.y == snakePart.gridPosition.y){
							snakePart = new BodyPart(i,{
								x:prevPart.gridPosition.x-1,
								y:prevPart.gridPosition.y
							});
						}
					}
				}else{
					snakePart = new BodyPart(i,{
						x:prevPart.gridPosition.x-1,
						y:prevPart.gridPosition.y
					});
					if(prevprevPart!=null){
						if(prevprevPart.gridPosition.x == snakePart.gridPosition.x && prevprevPart.gridPosition.y == snakePart.gridPosition.y){
							snakePart = new BodyPart(i,{
								x:prevPart.gridPosition.x+1,
								y:prevPart.gridPosition.y
							});
						}
					}
				}
			}else{
				if (Math.random()>.5){
					snakePart = new BodyPart(i,{
						x:prevPart.gridPosition.x,
						y:prevPart.gridPosition.y+1
					});
					if(prevprevPart!=null){
						if(prevprevPart.gridPosition.x == snakePart.gridPosition.x && prevprevPart.gridPosition.y == snakePart.gridPosition.y){
							snakePart = new BodyPart(i,{
								x:prevPart.gridPosition.x,
								y:prevPart.gridPosition.y-1
							});
						}
					}
				}else{
					snakePart = new BodyPart(i,{
						x:prevPart.gridPosition.x,
						y:prevPart.gridPosition.y-1
					});
					if(prevprevPart!=null){
						if(prevprevPart.gridPosition.x == snakePart.gridPosition.x && prevprevPart.gridPosition.y == snakePart.gridPosition.y){
							snakePart = new BodyPart(i,{
								x:prevPart.gridPosition.x,
								y:prevPart.gridPosition.y+1
							});
						}
					}
				}
			}
			aParts.push(snakePart);
		}

		for (i = 0; i < aParts.length; i++) {
			var part = aParts[i];
			if(i == 0){
				//HEAD
				part.direction = directionCheck(part, aParts[i+1] , null, 1);
				current_direction = part.direction;
			}else if(i == aParts.length - 1){
				//TAIL
				part.direction = directionCheck(part, null , aParts[i-1], 4);
			}else{
				//MID
				part.direction = directionCheck(part, aParts[i+1] , aParts[i-1], 3);
			}
		//			Debugger.obj(part);
		}

	}
	
	function directionCheck(actual,after,before,head_tail_or_eating){
		//head_tail_or_eating 1 = HEAD 2 = EATING 3 = MID 4=TAIL
		var retval = 0;
		switch (head_tail_or_eating) {
			case 1:
				if(actual.gridPosition.x != after.gridPosition.x){
					(actual.gridPosition.x > after.gridPosition.x)?retval = Snake.DIR_LEFT_RIGHT_FACE: retval= Snake.DIR_RIGHT_LEFT_FACE ;
				}else if(actual.gridPosition.y != after.gridPosition.y){
					(actual.gridPosition.y > after.gridPosition.y)?retval = Snake.DIR_TOP_BOTTOM_FACE: retval= Snake.DIR_BOTTOM_TOP_FACE ;
				}
				break;

			case 2:
				if(actual.gridPosition.x != after.gridPosition.x){
					(actual.gridPosition.x > after.gridPosition.x)?retval = Snake.DIR_LEFT_RIGHT_FACE_EATING: retval = Snake.DIR_RIGHT_LEFT_FACE_EATING ;
				}else if(actual.gridPosition.y != after.gridPosition.y){
					(actual.gridPosition.y > after.gridPosition.y)?retval = Snake.DIR_TOP_BOTTOM_FACE_EATING: retval = Snake.DIR_BOTTOM_TOP_FACE_EATING ;
				}
				break;

			case 3:
				if(before.gridPosition.x == after.gridPosition.x || before.gridPosition.y == after.gridPosition.y){
					//straight
					if(before.gridPosition.x == after.gridPosition.x)(before.gridPosition.y > after.gridPosition.y)?retval = Snake.DIR_TOP_BOTTOM:retval = Snake.DIR_BOTTOM_TOP;
					if(before.gridPosition.y == after.gridPosition.y)(before.gridPosition.x > after.gridPosition.x)?retval = Snake.DIR_LEFT_RIGHT:retval = Snake.DIR_RIGHT_LEFT;
				}else {
					//curb
					if(before.gridPosition.x > after.gridPosition.x && before.gridPosition.y > after.gridPosition.y && before.gridPosition.y == actual.gridPosition.y)retval = Snake.DIR_TOP_RIGHT;
					if(before.gridPosition.x < after.gridPosition.x && before.gridPosition.y > after.gridPosition.y && before.gridPosition.y == actual.gridPosition.y)retval = Snake.DIR_TOP_LEFT;
					if(before.gridPosition.x > after.gridPosition.x && before.gridPosition.y < after.gridPosition.y && before.gridPosition.y == actual.gridPosition.y)retval = Snake.DIR_BOTTOM_RIGHT;
					if(before.gridPosition.x < after.gridPosition.x && before.gridPosition.y < after.gridPosition.y && before.gridPosition.y == actual.gridPosition.y)retval = Snake.DIR_BOTTOM_LEFT;

					if(before.gridPosition.x > after.gridPosition.x && before.gridPosition.y > after.gridPosition.y && before.gridPosition.x == actual.gridPosition.x)retval = Snake.DIR_LEFT_BOTTOM;
					if(before.gridPosition.x > after.gridPosition.x && before.gridPosition.y < after.gridPosition.y && before.gridPosition.x == actual.gridPosition.x)retval = Snake.DIR_LEFT_TOP;
					if(before.gridPosition.x < after.gridPosition.x && before.gridPosition.y > after.gridPosition.y && before.gridPosition.x == actual.gridPosition.x)retval = Snake.DIR_RIGHT_BOTTOM;
					if(before.gridPosition.x < after.gridPosition.x && before.gridPosition.y < after.gridPosition.y && before.gridPosition.x == actual.gridPosition.x)retval = Snake.DIR_RIGHT_TOP;
				}
				break;

			case 4:
				if(actual.gridPosition.x != before.gridPosition.x){
					(actual.gridPosition.x < before.gridPosition.x)?retval = Snake.DIR_LEFT_RIGHT_TAIL: retval= Snake.DIR_RIGHT_LEFT_TAIL ;
				}else if(actual.gridPosition.y != before.gridPosition.y){
					(actual.gridPosition.y < before.gridPosition.y)?retval = Snake.DIR_TOP_BOTTOM_TAIL: retval= Snake.DIR_BOTTOM_TOP_TAIL ;
				}
				break;

			default:
				Debugger.log("ERROR IN DIRECTIONCHECK!");
				break;
		}
		return retval;
	}

	this.drawSnake = function (context){
		for (i = 0; i < aParts.length; i++) {
			var sourceX = Math.floor(aParts[i].direction % 4) * BodyPart.DEFAULT_WIDTH;
			var sourceY = Math.floor(aParts[i].direction / 4) * BodyPart.DEFAULT_HEIGHT;

			getRightShadow(aParts[i].direction,context);
			switch (mode) {
				case Snake.MODE_NORMAL:
					context.drawImage(oImages.normal, sourceX, sourceY, BodyPart.DEFAULT_WIDTH, BodyPart.DEFAULT_HEIGHT, aParts[i].gridPosition.x * BodyPart.DEFAULT_WIDTH + Game.PLAYFIELD_XOFFSET,aParts[i].gridPosition.y * BodyPart.DEFAULT_HEIGHT + Game.PLAYFIELD_YOFFSET, BodyPart.DEFAULT_WIDTH, BodyPart.DEFAULT_HEIGHT);
					break;
				case Snake.MODE_OVERDRIVE:
					context.drawImage(oImages.overdrive, sourceX, sourceY, BodyPart.DEFAULT_WIDTH, BodyPart.DEFAULT_HEIGHT, aParts[i].gridPosition.x * BodyPart.DEFAULT_WIDTH + Game.PLAYFIELD_XOFFSET,aParts[i].gridPosition.y * BodyPart.DEFAULT_HEIGHT + Game.PLAYFIELD_YOFFSET, BodyPart.DEFAULT_WIDTH, BodyPart.DEFAULT_HEIGHT);
					break;
				case Snake.MODE_SPECIAL:
					context.drawImage(oImages.special, sourceX, sourceY, BodyPart.DEFAULT_WIDTH, BodyPart.DEFAULT_HEIGHT, aParts[i].gridPosition.x * BodyPart.DEFAULT_WIDTH + Game.PLAYFIELD_XOFFSET,aParts[i].gridPosition.y * BodyPart.DEFAULT_HEIGHT + Game.PLAYFIELD_YOFFSET, BodyPart.DEFAULT_WIDTH, BodyPart.DEFAULT_HEIGHT);
					break;
				default:
					break;
			}
			context.shadowColor = '#000000';
			context.shadowOffsetX = 0;
			context.shadowOffsetY = 0;
			context.shadowBlur = 0;
		}
	}
	function getRightShadow(dir,context){
		if(jQuery.browser.mozilla){
			switch (dir) {
				case Snake.DIR_LEFT_BOTTOM:
					context.shadowBlur =  2;
					context.shadowOffsetX = 1;
					context.shadowOffsetY = -2;
					context.shadowColor = 'rgba(0,0,0,.2)';
					break;
				case Snake.DIR_BOTTOM_RIGHT:
					context.shadowBlur =  2;
					context.shadowOffsetX = -2;
					context.shadowOffsetY = 1;
					context.shadowColor = 'rgba(0,0,0,.2)';
					break;
				case Snake.DIR_RIGHT_BOTTOM:
					context.shadowBlur =  2;
					context.shadowOffsetX = 1;
					context.shadowOffsetY = -2;
					context.shadowColor = 'rgba(0,0,0,.2)';
					break;
				case Snake.DIR_TOP_RIGHT:
					context.shadowBlur =  2;
					context.shadowOffsetX = -2;
					context.shadowOffsetY = 1;
					context.shadowColor = 'rgba(0,0,0,.2)';
					break;
				case Snake.DIR_TOP_BOTTOM:
					context.shadowBlur =  2;
					context.shadowOffsetX = 1;
					context.shadowOffsetY = -2;
					context.shadowColor = 'rgba(0,0,0,.5)';
					break;
				case Snake.DIR_TOP_BOTTOM_TAIL:
					context.shadowBlur =  2;
					context.shadowOffsetX = 1;
					context.shadowOffsetY = -1;
					context.shadowColor = 'rgba(0,0,0,.5)';
					break;
				case Snake.DIR_LEFT_RIGHT:
					context.shadowBlur =  2;
					context.shadowOffsetX = -2;
					context.shadowOffsetY = 1;
					context.shadowColor = 'rgba(0,0,0,.5)';
					break;
				case Snake.DIR_LEFT_RIGHT_TAIL:
					context.shadowBlur =  2;
					context.shadowOffsetX = -1;
					context.shadowOffsetY = 1;
					context.shadowColor = 'rgba(0,0,0,.5)';
					break;
				case Snake.DIR_BOTTOM_TOP:
				case Snake.DIR_LEFT_TOP:
				case Snake.DIR_RIGHT_TOP:
				case Snake.DIR_RIGHT_LEFT:
				case Snake.DIR_TOP_LEFT:
				case Snake.DIR_BOTTOM_LEFT:
				case Snake.DIR_BOTTOM_TOP_TAIL:
				case Snake.DIR_RIGHT_LEFT_TAIL:
				case Snake.DIR_TOP_BOTTOM_FACE:
				case Snake.DIR_BOTTOM_TOP_FACE:
				case Snake.DIR_LEFT_RIGHT_FACE:
				case Snake.DIR_RIGHT_LEFT_FACE:
				case Snake.DIR_TOP_BOTTOM_FACE_EATING:
				case Snake.DIR_BOTTOM_TOP_FACE_EATING:
				case Snake.DIR_LEFT_RIGHT_FACE_EATING:
				case Snake.DIR_RIGHT_LEFT_FACE_EATING:
					context.shadowBlur =  2;
					context.shadowOffsetX = 1;
					context.shadowOffsetY = 1;
					context.shadowColor = 'rgba(0,0,0,.5)';
					break;
				default:
					break;
			}
		}
		if(jQuery.browser.webkit){
			switch (dir) {
				case Snake.DIR_LEFT_BOTTOM:
					context.shadowBlur =  2;
					context.shadowOffsetX = 1;
					context.shadowOffsetY = -2;
					context.shadowColor = 'rgba(0,0,0,.2)';
					break;
				case Snake.DIR_BOTTOM_RIGHT:
					context.shadowBlur =  2;
					context.shadowOffsetX = -2;
					context.shadowOffsetY = 1;
					context.shadowColor = 'rgba(0,0,0,.2)';
					break;
				case Snake.DIR_RIGHT_BOTTOM:
					context.shadowBlur =  2;
					context.shadowOffsetX = 1;
					context.shadowOffsetY = -2;
					context.shadowColor = 'rgba(0,0,0,.2)';
					break;
				case Snake.DIR_TOP_RIGHT:
					context.shadowBlur =  2;
					context.shadowOffsetX = -2;
					context.shadowOffsetY = 1;
					context.shadowColor = 'rgba(0,0,0,.2)';
					break;
				case Snake.DIR_TOP_BOTTOM:
					context.shadowBlur =  2;
					context.shadowOffsetX = 1;
					context.shadowOffsetY = -2;
					context.shadowColor = 'rgba(0,0,0,.5)';
					break;
				case Snake.DIR_TOP_BOTTOM_TAIL:
					context.shadowBlur =  2;
					context.shadowOffsetX = 1;
					context.shadowOffsetY = -1;
					context.shadowColor = 'rgba(0,0,0,.5)';
					break;
				case Snake.DIR_LEFT_RIGHT:
					context.shadowBlur =  2;
					context.shadowOffsetX = -2;
					context.shadowOffsetY = 1;
					context.shadowColor = 'rgba(0,0,0,.5)';
					break;
				case Snake.DIR_LEFT_RIGHT_TAIL:
					context.shadowBlur =  1;
					context.shadowOffsetX = -1;
					context.shadowOffsetY = 0;
					context.shadowColor = 'rgba(0,0,0,.5)';
					break;
				case Snake.DIR_RIGHT_TOP:
					context.shadowBlur =  1;
					context.shadowOffsetX = 0;
					context.shadowOffsetY = 1;
					context.shadowColor = 'rgba(0,0,0,.5)';
					break;
				case Snake.DIR_BOTTOM_TOP_FACE:
					context.shadowBlur =  1;
					context.shadowOffsetX = 0;
					context.shadowOffsetY = 1;
					context.shadowColor = 'rgba(0,0,0,.5)';
					break;
				case Snake.DIR_BOTTOM_TOP:
				case Snake.DIR_LEFT_TOP:
				case Snake.DIR_RIGHT_LEFT:
				case Snake.DIR_TOP_LEFT:
				case Snake.DIR_BOTTOM_LEFT:
				case Snake.DIR_BOTTOM_TOP_TAIL:
				case Snake.DIR_RIGHT_LEFT_TAIL:
				case Snake.DIR_TOP_BOTTOM_FACE:
				
				case Snake.DIR_LEFT_RIGHT_FACE:
				case Snake.DIR_RIGHT_LEFT_FACE:
				case Snake.DIR_TOP_BOTTOM_FACE_EATING:
				case Snake.DIR_BOTTOM_TOP_FACE_EATING:
				case Snake.DIR_LEFT_RIGHT_FACE_EATING:
				case Snake.DIR_RIGHT_LEFT_FACE_EATING:
					context.shadowBlur =  2;
					context.shadowOffsetX = 1;
					context.shadowOffsetY = 1;
					context.shadowColor = 'rgba(0,0,0,.5)';
					break;
				default:
					break;
			}
		}
	}
	this.makeLonger = function (aFruits){
		makeSnakeLonger(aFruits);
		var is_colided = collisionCheck();
		return is_colided;
	}
	this.makeShorter = function(){
		makeShorter();
		canmovMe = true;
	}

	this.changeDirection = function(direction){
		canmovMe = false;
		current_direction = direction;
		aParts[0].direction = direction;
	}

	function makeSnakeLonger(aFruits){
		switch (current_direction) {
			//FACE
			case Snake.DIR_TOP_BOTTOM_FACE:
			case Snake.DIR_TOP_BOTTOM_FACE_EATING:
				var snakePart = new BodyPart(1,{
					x:aParts[0].gridPosition.x,
					y:aParts[0].gridPosition.y
				},Snake.DIR_TOP_BOTTOM);
				aParts[0].gridPosition.y+=1;
				aParts[0].direction = Snake.DIR_TOP_BOTTOM_FACE;
					//fruitsCheck For EATING PART
					fruitCheck : for (i = 0; i < aFruits.length; i++) {
						if(aFruits[i].gridPosition.y == aParts[0].gridPosition.y+1 && aFruits[i].gridPosition.x == aParts[0].gridPosition.x){
							aParts[0].direction = Snake.DIR_TOP_BOTTOM_FACE_EATING;
						}
					}
				if(aParts[0].gridPosition.x != aParts[1].gridPosition.x && aParts[0].gridPosition.y != aParts[1].gridPosition.y){
					snakePart.direction = curbLookup(aParts[0],aParts[1],snakePart);
				}
				if(aParts[0].gridPosition.y > Game.PLAYFIELD_MAXPOSITION_HEIGHT)aParts[0].gridPosition.y=0;
				aParts.splice(1, 0, snakePart);
				break;
			case Snake.DIR_BOTTOM_TOP_FACE:
			case Snake.DIR_BOTTOM_TOP_FACE_EATING:
				var snakePart = new BodyPart(1,{
					x:aParts[0].gridPosition.x,
					y:aParts[0].gridPosition.y
				},Snake.DIR_BOTTOM_TOP);
				aParts[0].gridPosition.y-=1;
				aParts[0].direction = Snake.DIR_BOTTOM_TOP_FACE;
					//fruitsCheck For EATING PART
					fruitCheck : for (i = 0; i < aFruits.length; i++) {
						if(aFruits[i].gridPosition.y==aParts[0].gridPosition.y-1 && aFruits[i].gridPosition.x == aParts[0].gridPosition.x){
							aParts[0].direction = Snake.DIR_BOTTOM_TOP_FACE_EATING;
						}
					}
				if(aParts[0].gridPosition.x != aParts[1].gridPosition.x && aParts[0].gridPosition.y != aParts[1].gridPosition.y){
					snakePart.direction = curbLookup(aParts[0],aParts[1],snakePart);
				}
				if(aParts[0].gridPosition.y < 0)aParts[0].gridPosition.y=Game.PLAYFIELD_MAXPOSITION_HEIGHT;
				aParts.splice(1, 0, snakePart);
				break;
			case Snake.DIR_LEFT_RIGHT_FACE:
			case Snake.DIR_LEFT_RIGHT_FACE_EATING:
				var snakePart = new BodyPart(1,{
					x:aParts[0].gridPosition.x,
					y:aParts[0].gridPosition.y
				},Snake.DIR_LEFT_RIGHT);
				aParts[0].gridPosition.x+=1;

				aParts[0].direction = Snake.DIR_LEFT_RIGHT_FACE;
					//fruitsCheck For EATING PART
					fruitCheck : for (i = 0; i < aFruits.length; i++) {
						if(aFruits[i].gridPosition.x==aParts[0].gridPosition.x+1 && aFruits[i].gridPosition.y == aParts[0].gridPosition.y){
							aParts[0].direction = Snake.DIR_LEFT_RIGHT_FACE_EATING;
						}
					}
				if(aParts[0].gridPosition.x != aParts[1].gridPosition.x && aParts[0].gridPosition.y != aParts[1].gridPosition.y){
					snakePart.direction = curbLookup(aParts[0],aParts[1],snakePart);
				}
				if(aParts[0].gridPosition.x > Game.PLAYFIELD_MAXPOSITION_WIDTH)aParts[0].gridPosition.x=0;
				aParts.splice(1, 0, snakePart);
				break;
			case Snake.DIR_RIGHT_LEFT_FACE:
			case Snake.DIR_RIGHT_LEFT_FACE_EATING:
				var snakePart = new BodyPart(1,{
					x:aParts[0].gridPosition.x,
					y:aParts[0].gridPosition.y
				},Snake.DIR_RIGHT_LEFT);
				aParts[0].gridPosition.x-=1;
				aParts[0].direction = Snake.DIR_RIGHT_LEFT_FACE;
					//fruitsCheck For EATING PART
					fruitCheck : for (i = 0; i < aFruits.length; i++) {
						if(aFruits[i].gridPosition.x==aParts[0].gridPosition.x-1 && aFruits[i].gridPosition.y == aParts[0].gridPosition.y){
							aParts[0].direction = Snake.DIR_RIGHT_LEFT_FACE_EATING;
						}
					}
				if(aParts[0].gridPosition.x != aParts[1].gridPosition.x && aParts[0].gridPosition.y != aParts[1].gridPosition.y){
					snakePart.direction = curbLookup(aParts[0],aParts[1],snakePart);
				}
				if(aParts[0].gridPosition.x < 0)aParts[0].gridPosition.x=Game.PLAYFIELD_MAXPOSITION_WIDTH;
				aParts.splice(1, 0, snakePart);
				break;
			default:
				break;
		}
	}
	function curbLookup(part1,part2,part3){
		Debugger.log("directionLookup");
		var retVal;
		if(((part1.gridPosition.x > part2.gridPosition.x && part1.gridPosition.y > part2.gridPosition.y) || (part1.gridPosition.y == 0 && part2.gridPosition.y == Game.PLAYFIELD_MAXPOSITION_HEIGHT))  && (part1.gridPosition.y == part3.gridPosition.y && part1.gridPosition.x > part3.gridPosition.x) && (part1.gridPosition.y != Game.PLAYFIELD_MAXPOSITION_HEIGHT || part2.gridPosition.y != 0)){
			Debugger.log("DIR_TOP_RIGHT");
			if(part1.gridPosition.y == 0 && part2.gridPosition.y == Game.PLAYFIELD_MAXPOSITION_HEIGHT)Debugger.log("WATCH OUT TOP");
			retVal = Snake.DIR_TOP_RIGHT;
			return retVal;
		}
		if(((part1.gridPosition.x < part2.gridPosition.x && part1.gridPosition.y > part2.gridPosition.y) || (part1.gridPosition.y == 0 && part2.gridPosition.y == Game.PLAYFIELD_MAXPOSITION_HEIGHT)) && (part1.gridPosition.y == part3.gridPosition.y && part1.gridPosition.x < part3.gridPosition.x) && (part1.gridPosition.y != Game.PLAYFIELD_MAXPOSITION_HEIGHT || part2.gridPosition.y != 0)){
			Debugger.log("DIR_TOP_LEFT");
			if(part1.gridPosition.y == 0 && part2.gridPosition.y == Game.PLAYFIELD_MAXPOSITION_HEIGHT)Debugger.log("WATCH OUT TOP");
			retVal = Snake.DIR_TOP_LEFT;
			return retVal;
		}
		if(((part1.gridPosition.x > part2.gridPosition.x && part1.gridPosition.y < part2.gridPosition.y) || (part1.gridPosition.y == Game.PLAYFIELD_MAXPOSITION_HEIGHT && part2.gridPosition.y == 0)) && (part1.gridPosition.y == part3.gridPosition.y && part1.gridPosition.x > part3.gridPosition.x) && (part1.gridPosition.y != 0 || part2.gridPosition.y != Game.PLAYFIELD_MAXPOSITION_HEIGHT)){
			Debugger.log("DIR_BOTTOM_RIGHT");
			if(part1.gridPosition.y == Game.PLAYFIELD_MAXPOSITION_HEIGHT && part2.gridPosition.y == 0)Debugger.log("WATCH OUT BOTTOM");
			retVal = Snake.DIR_BOTTOM_RIGHT;
			return retVal;
		}
		if(((part1.gridPosition.x < part2.gridPosition.x && part1.gridPosition.y < part2.gridPosition.y) || (part1.gridPosition.y == Game.PLAYFIELD_MAXPOSITION_HEIGHT && part2.gridPosition.y == 0)) && (part1.gridPosition.y == part3.gridPosition.y && part1.gridPosition.x < part3.gridPosition.x) && (part1.gridPosition.y != 0 || part2.gridPosition.y != Game.PLAYFIELD_MAXPOSITION_HEIGHT)){
			Debugger.log("DIR_BOTTOM_LEFT");
			if(part1.gridPosition.y == Game.PLAYFIELD_MAXPOSITION_HEIGHT && part2.gridPosition.y == 0)Debugger.log("WATCH OUT BOTTOM");
			retVal = Snake.DIR_BOTTOM_LEFT;
			return retVal;
		}

		if(((part1.gridPosition.x > part2.gridPosition.x && part1.gridPosition.y > part2.gridPosition.y) || (part1.gridPosition.x == 0  && part2.gridPosition.x == Game.PLAYFIELD_MAXPOSITION_WIDTH)) && (part1.gridPosition.x == part3.gridPosition.x && part1.gridPosition.y > part3.gridPosition.y) && (part1.gridPosition.x != Game.PLAYFIELD_MAXPOSITION_WIDTH || part2.gridPosition.x != 0)){
			Debugger.log("DIR_LEFT_BOTTOM");
			retVal = Snake.DIR_LEFT_BOTTOM;
			return retVal;
		}
		if(((part1.gridPosition.x > part2.gridPosition.x && part1.gridPosition.y < part2.gridPosition.y) || (part1.gridPosition.x == 0  && part2.gridPosition.x == Game.PLAYFIELD_MAXPOSITION_WIDTH)) && (part1.gridPosition.x == part3.gridPosition.x && part1.gridPosition.y < part3.gridPosition.y)&& (part1.gridPosition.x != Game.PLAYFIELD_MAXPOSITION_WIDTH || part2.gridPosition.x != 0)){
			Debugger.log("DIR_LEFT_TOP");
			retVal = Snake.DIR_LEFT_TOP;
			return retVal;
		}
		if(((part1.gridPosition.x < part2.gridPosition.x && part1.gridPosition.y > part2.gridPosition.y) || (part1.gridPosition.x == Game.PLAYFIELD_MAXPOSITION_WIDTH  && part2.gridPosition.x == 0)) && (part1.gridPosition.x == part3.gridPosition.x && part1.gridPosition.y > part3.gridPosition.y) && (part1.gridPosition.x != 0 || part2.gridPosition.x != Game.PLAYFIELD_MAXPOSITION_WIDTH)){
			Debugger.log("DIR_RIGHT_BOTTOM");
			retVal = Snake.DIR_RIGHT_BOTTOM;
			return retVal;
		}
		if(((part1.gridPosition.x < part2.gridPosition.x && part1.gridPosition.y < part2.gridPosition.y) || (part1.gridPosition.x == Game.PLAYFIELD_MAXPOSITION_WIDTH  && part2.gridPosition.x == 0)) && (part1.gridPosition.x == part3.gridPosition.x && part1.gridPosition.y < part3.gridPosition.y) && (part1.gridPosition.x != 0 || part2.gridPosition.x != Game.PLAYFIELD_MAXPOSITION_WIDTH)){
			Debugger.log("DIR_RIGHT_TOP");
			retVal = Snake.DIR_RIGHT_TOP;
			return retVal;
		}
		
	}
	function makeShorter(){
		var snakePart = {};
		switch (aParts[aParts.length-2].direction) {
			//FACE
			case Snake.DIR_TOP_BOTTOM:
			case Snake.DIR_LEFT_BOTTOM:
			case Snake.DIR_RIGHT_BOTTOM:
				snakePart = new BodyPart(aParts.length-2,{
					x:aParts[aParts.length-2].gridPosition.x,
					y:aParts[aParts.length-2].gridPosition.y
				},Snake.DIR_TOP_BOTTOM_TAIL);
				break;
			case Snake.DIR_BOTTOM_TOP:
			case Snake.DIR_LEFT_TOP:
			case Snake.DIR_RIGHT_TOP:
				snakePart= new BodyPart(aParts.length-2,{
					x:aParts[aParts.length-2].gridPosition.x,
					y:aParts[aParts.length-2].gridPosition.y
				},Snake.DIR_BOTTOM_TOP_TAIL);
				break;
			case Snake.DIR_LEFT_RIGHT:
			case Snake.DIR_TOP_RIGHT:
			case Snake.DIR_BOTTOM_RIGHT:
				snakePart = new BodyPart(aParts.length-2,{
					x:aParts[aParts.length-2].gridPosition.x,
					y:aParts[aParts.length-2].gridPosition.y
				},Snake.DIR_LEFT_RIGHT_TAIL);
				break;
			case Snake.DIR_RIGHT_LEFT:
			case Snake.DIR_TOP_LEFT:
			case Snake.DIR_BOTTOM_LEFT:
				snakePart = new BodyPart(aParts.length-2,{
					x:aParts[aParts.length-2].gridPosition.x,
					y:aParts[aParts.length-2].gridPosition.y
				},Snake.DIR_RIGHT_LEFT_TAIL);
				break;
			default:
				break;
		}
		aParts.splice(aParts.length-1, 1);
		aParts.splice(aParts.length-1, 1,snakePart);
		for (i = 2; i < length-1; i++) {
			aParts[i].position+=1;
		}
	}

	function collisionCheck(){
		var retvall = false;
			check : for (i = 1; i < aParts.length; i++) {
				if(aParts[0].gridPosition.x == aParts[i].gridPosition.x && aParts[0].gridPosition.y == aParts[i].gridPosition.y){
					retvall = true;
					break check;
				}
			}
		return retvall;
	}

	this.currentDirection = function(){
		return current_direction;
	}
	this.canBeMoved = function(){
		return canmovMe;
	}
	this.head = function(){
		return aParts[0];
	}

	this.parts = function(){
		return aParts;
	}
}

Snake.prototype.initSnake = function(){
	this.initMe();
}


//--MODES
Snake.MODE_NORMAL = 'MODE_NORMAL';
Snake.MODE_OVERDRIVE = 'MODE_OVERDRIVE';
Snake.MODE_SPECIAL = 'MODE_SPECIAL';

//--DIRECTIONS
//STRAIGHT PARTS
Snake.DIR_TOP_BOTTOM = 0;
Snake.DIR_BOTTOM_TOP = 1;
Snake.DIR_LEFT_RIGHT = 2;
Snake.DIR_RIGHT_LEFT = 3;

//CORNER PARTS
Snake.DIR_TOP_RIGHT = 4;
Snake.DIR_TOP_LEFT = 5;
Snake.DIR_BOTTOM_RIGHT = 6;
Snake.DIR_BOTTOM_LEFT = 7;

Snake.DIR_LEFT_BOTTOM = 8;
Snake.DIR_LEFT_TOP= 9;
Snake.DIR_RIGHT_BOTTOM = 10;
Snake.DIR_RIGHT_TOP = 11;

//SPECIAL PARTS
//TAIL
Snake.DIR_TOP_BOTTOM_TAIL = 12;
Snake.DIR_BOTTOM_TOP_TAIL = 13;
Snake.DIR_LEFT_RIGHT_TAIL = 14;
Snake.DIR_RIGHT_LEFT_TAIL = 15;

//FACE
Snake.DIR_TOP_BOTTOM_FACE = 16;
Snake.DIR_BOTTOM_TOP_FACE = 17;
Snake.DIR_LEFT_RIGHT_FACE = 18;
Snake.DIR_RIGHT_LEFT_FACE = 19;

//FACE_EATING
Snake.DIR_TOP_BOTTOM_FACE_EATING = 20;
Snake.DIR_BOTTOM_TOP_FACE_EATING = 21;
Snake.DIR_LEFT_RIGHT_FACE_EATING = 22;
Snake.DIR_RIGHT_LEFT_FACE_EATING = 23;