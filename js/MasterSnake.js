
$(document).ready(function() {
	Debugger.isTracing = false;
	Debugger.log("This browsers support for canvas is "+ canvasSupport());
	Debugger.obj(jQuery.browser);

//	alert(canvasSupport());
	if(!canvasSupport() || jQuery.browser.msie){
		$('#browser-error').css('display','block');
		$('#canvas').css('display','none');
		$('#buttons-introscreen').css('display','none');
		$('#footer').css('visibility', 'visible');
		$('#footer').css('opacity', 1);
	}else{
		var canvas = document.getElementById("canvas");
		var context = canvas.getContext("2d");
		var game = new Game(context, canvas);
		game.drawTitleScreen();
	}
	

	$("#btn-1").click(function() {
		game.setGameMode(Game.STATE_INFINIT_HUNGER);
		return false;		
	});
	$("#btn-2").click(function() {
		//game.setGameMode(Game.STATE_TAKE_THE_POSITION);
		return false;
	});
	$("#btn-1-in-game").click(function() {
		//display ARE YOU SURE ?
		//game.setGameMode(Game.STATE_INFINIT_HUNGER);
		});
	$("#btn-2-in-game").click(function() {
		//display ARE YOU SURE ?
		//game.setGameMode(Game.STATE_INFINIT_HUNGER);
		});
});