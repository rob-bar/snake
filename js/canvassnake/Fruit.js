/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function Fruit(img,life,gridPosition,kind){
	(img === undefined)? this.img = new Image() : this.img = img;
	(life === undefined)? this.life = 3 : this.life = life;
	(gridPosition === undefined)? this.gridPosition = {
		x:0,
		y:0
	} : this.gridPosition = gridPosition;
	(kind === undefined)? this.kind = 0 : this.kind = kind;
	this.score = ((kind+1)*50);
}

Fruit.prototype.draw = function(context,bg){
	var sourceX = Math.floor(this.kind % 5) * BodyPart.DEFAULT_WIDTH;
	var sourceY = Math.floor(this.kind / 5) * BodyPart.DEFAULT_HEIGHT;
	context.clearRect( this.gridPosition.x * Fruit.DEFAULT_WIDTH + Game.PLAYFIELD_XOFFSET-1,  this.gridPosition.y * Fruit.DEFAULT_HEIGHT + Game.PLAYFIELD_YOFFSET-1,29,29);
	context.drawImage(bg, (26 + (this.gridPosition.x * Fruit.DEFAULT_WIDTH)), (47 + (this.gridPosition.y * Fruit.DEFAULT_HEIGHT)), Fruit.DEFAULT_WIDTH+4, Fruit.DEFAULT_HEIGHT+4,this.gridPosition.x * Fruit.DEFAULT_WIDTH + Game.PLAYFIELD_XOFFSET-1, this.gridPosition.y * Fruit.DEFAULT_HEIGHT + Game.PLAYFIELD_YOFFSET-1, Fruit.DEFAULT_WIDTH+4, Fruit.DEFAULT_HEIGHT+4);

	if(this.life <= 1){
		this.life -= .05;
		context.globalAlpha = this.life.toFixed(2);
		if(this.life <= 0)context.globalAlpha = 0;
	}
	else {
		this.life -= .02;
		context.globalAlpha = 1;
	}
	if(jQuery.browser.webkit){
		context.shadowColor = 'rgba(0,0,0,.5)';
		context.shadowOffsetX = 1;
		context.shadowOffsetY = .5;
		context.shadowBlur = 1.5;
	}
	if(jQuery.browser.mozilla){
		context.shadowColor = 'rgba(0,0,0,.5)';
		context.shadowOffsetX = 1;
		context.shadowOffsetY = 1;
		context.shadowBlur = 1.5;
	}
	context.drawImage(this.img, sourceX, sourceY, Fruit.DEFAULT_WIDTH, Fruit.DEFAULT_HEIGHT, this.gridPosition.x * Fruit.DEFAULT_WIDTH + Game.PLAYFIELD_XOFFSET, this.gridPosition.y * Fruit.DEFAULT_HEIGHT + Game.PLAYFIELD_YOFFSET, Fruit.DEFAULT_WIDTH, Fruit.DEFAULT_HEIGHT);
	context.shadowColor = '#000000';
	context.shadowOffsetX = 0;
	context.shadowOffsetY = 0;
	context.shadowBlur = 0;
	context.globalAlpha = 1;
}

Fruit.KIND_APPLE_GREEN = 0;
Fruit.KIND_MANGO = 1;
Fruit.KIND_LEMON = 2;
Fruit.KIND_APPLE_RED = 3;
Fruit.KIND_PEACH = 4;

Fruit.KIND_PEAR = 5;
Fruit.KIND_CHERRY = 6;
Fruit.KIND_STRAWBERRY = 7;
Fruit.KIND_DRAPPES_BLUE = 8;
Fruit.KIND_DRAPPES_GREEN = 9;

Fruit.DEFAULT_WIDTH = 25;
Fruit.DEFAULT_HEIGHT = 25;