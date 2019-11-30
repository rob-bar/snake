/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function BodyPart(position,gridPosition,direction){
	(position === undefined)? this.position = 0 : this.position = position;
	(direction === undefined)? this.direction = 0 : this.direction = direction;
	(gridPosition === undefined)? this.gridPosition = {x:0,y:0} : this.gridPosition = gridPosition;
}

BodyPart.DEFAULT_WIDTH = 25;
BodyPart.DEFAULT_HEIGHT = 25;