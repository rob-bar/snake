// 
//  Game.js
//  portfolio_trunk
//  
//  Created by Robbie on 2012-02-13.
//  Copyright 2012 __MyCompanyName__. All rights reserved.
// 

function Game(context,canvas){
	(context === undefined)? this.context = 0 : this.context = context;
	(canvas === undefined)? this.canvas = 0 : this.canvas = canvas;
	var clearMePrevious = "";
	var tblposcntr = 0;
	var maxtblpos = 0;
	var dataIsFetched = false;
	var scoreIsSaved = false;
	var gameState = 'STATE_TITLE';
	var IntervalId=0;
	var activeGame;
	var animateObject = {};
	var midImage = new Image();
	var titleImage = new Image();
	var cnt=0;
	var key_press_list = [];
	//LOADING THE TITLE SCREEN
	this.drawTitleScreen = function(){
		midImage.src = "images/snakeAssets/intro_screen.png";
		midImage.addEventListener('load', onmidLoaded, false);
		titleImage.src = "images/snakeAssets/snake_title.png";
		titleImage.addEventListener('load', onmidLoaded, false);
	}

	//REMOVE THE TITLE SCREEN AND LAUNCHING THE GAME
	this.removeTitleScreen = function(){
		$('#buttons-introscreen').css('visibility', 'hidden');
		IntervalId = setInterval(animateToGameScreen,getMillisecondsInterval(Game.frameRate));
	}

	function onmidLoaded (){
		cnt+=1;
		Debugger.log(cnt);
		if(cnt >= 2){
			Debugger.log(cnt);
			animateObject.beginY = Math.round(canvas.height * .4 - titleImage.height * .6);
			context.drawImage(midImage,Math.round(canvas.width * .5 - midImage.width * .5),Math.round(canvas.height * .5 - midImage.height * .3));
			context.drawImage(titleImage,Math.round(canvas.width * .5 - titleImage.width * .5),animateObject.beginY);
			animateObject.endY = 5;
		}
	}

	function animateToGameScreen(){
		context.globalAlpha -=.05;
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.drawImage(midImage,Math.round(canvas.width * .5 - midImage.width * .5),Math.round(canvas.height * .5 - midImage.height * .3));
		
		if(context.globalAlpha<=.05){
			context.globalAlpha =1;
			context.clearRect(0, 0, canvas.width, canvas.height);
			var dy = animateObject.endY - animateObject.beginY;
			animateObject.velocityY = dy * .1;
			animateObject.beginY += animateObject.velocityY;
			context.drawImage(titleImage,Math.round(canvas.width * .5 - titleImage.width * .5),animateObject.beginY);
			if(dy > -.1){
				context.drawImage(titleImage,Math.round(canvas.width * .5 - titleImage.width * .5),animateObject.endY);
				clearInterval(IntervalId);
				initGame();
			}
			context.globalAlpha =0;
		}else{
			var prevAlpha = context.globalAlpha;
			context.globalAlpha =1;
			context.drawImage(titleImage,Math.round(canvas.width * .5 - titleImage.width * .5),Math.round(canvas.height * .4 - titleImage.height * .6));
			context.globalAlpha = prevAlpha ;
		}
	}
	
	function initGame(){
		Debugger.log("this.activeGame => "+gameState);
		if (gameState === Game.STATE_INFINIT_HUNGER) {
			activeGame = new InfinitHunger(context,canvas);
			var o = {
				i:titleImage,
				_x:Math.round(canvas.width * .5 - titleImage.width * .5),
				_y:animateObject.endY
			};
			activeGame.initInfinitHunger(o);
		} else {
			activeGame = new TakeThePosition(context,canvas);
		}
	}

	this.setGameState = function(str){
		gameState = str;
	}
	this.getGameState = function(){
		return gameState;
	}
	//KEY EVENTS
	$(document).keydown(function(event) {
		key_press_list[event.keyCode] = true;
		activeGame.updateKeylist(key_press_list);
	});
	$(document).keyup(function(event) {
		key_press_list[event.keyCode] = false;
		activeGame.updateKeylist(key_press_list);
	});
	//MOUSE EVENTS
	$("#btn-1-game-over").click(function() {
		//replay
		closeTT();
		$('#game-over').animate({
			top:-250
		},{
			duration: 500,
			easing: 'easeOutExpo',
			complete:compl
		});

		function compl(){
			Debugger.log("compl");
			dataIsFetched = false;
			scoreIsSaved = false;
			activeGame.replay();
		}
		return false;
	});

	$("#btn-2-game-over").click(function() {
		//SUBMITSCORE
		var scr = $('#game-over-score').text();
		scr = scr.substring(8,scr.length);
		$.ajax({
			type:"GET",
			url:"games/canvassnakeajaxgeturlscoretwitter/"+scr,
			success:function(str_url){
				//				Debugger.log("str_url"+str_url);
				$('.game-over-tt-btn3').attr("href",str_url);
			}
		})
		$.ajax({
			type:"GET",
			url:"games/canvassnakeajaxgeturlscorefacebook/"+scr,
			success:function(str_url){
				//				Debugger.log("str_url"+str_url);
				$('.game-over-tt-btn2').attr("href",str_url);
			}
		})

		keycheckandissavedcheck();
		scoreSavecheck();
		$('#tooltip-game-over').css('visibility', 'visible');
		$('#tooltip-game-over').animate({
			top:30,
			opacity: 1
		},{
			duration: 500,
			easing: 'easeOutExpo',
			complete:function(){
				
			}
		});
		
	});

	$("#game-over").mouseleave(function() {
		//SUBMITSCORE
		closeTT();
	});
	
	function closeTT(){
		$('#tooltip-game-over').animate({
			top:30,
			opacity: 0
		},{
			duration: 500,
			easing: 'easeOutExpo',
			complete:function(){
				Debugger.log("ONCOMPLE");
				$('#tooltip-game-over').css('top', '25px');
				$('#tooltip-game-over').css('visibility', 'hidden');
			}
		});
	}



	$("#btn-3-game-over").click(function() {
		//LEADERBOARD
		closeTT();
		if(!dataIsFetched){
			$.ajax({
				type:"GET",
				url:"games/canvassnakeajaxgetscores",
				success:function(scores){
					dataIsFetched = true;
					$('#score-board-tbl2').empty();
					$('#score-board-tbl2').append(scores);
					$('#game-over').animate({
						top:-250
					},{
						duration: 500,
						easing: 'easeOutExpo',
						complete:compl
					});
				}
			})
		}else{
			//			$('#score-board-tbl2').append(scores);
			$('#game-over').animate({
				top:-250
			},{
				duration: 500,
				easing: 'easeOutExpo',
				complete:compl
			});
		}
		
		return false;
	});
	function compl(){
		Debugger.log("compl");
		$('#score-board').animate({
			top:125
		},{
			duration: 500,
			easing: 'easeOutExpo'
		});
	}
	//SCORE BOARD
	$("#btn-1-score-board").click(function() {
		//replay
		$('#score-board').animate({
			top:-400
		},{
			duration: 500,
			easing: 'easeOutExpo',
			complete:compl
		});

		function compl(){
			Debugger.log("compl");
			dataIsFetched = false;
			scoreIsSaved = false;
			activeGame.replay();
		}
		return false;
	});
	$("#btn-4-score-board").click(function() {
		//LEADERBOARD
		//		$('#game-over').css('position', 'static');
		$('#score-board').animate({
			top:-400
		},{
			duration: 500,
			easing: 'easeOutExpo',
			complete:compl
		});

		function compl(){
			Debugger.log("compl");
			$('#game-over').animate({
				top:200
			},{
				duration: 500,
				easing: 'easeOutExpo'
			//			complete:compl
			});
		}
		return false;
	});
	$(".game-over-tt-btn1").click(function() {
		//LEADERBOARD
		Debugger.log("$(this).css('opacity')"+$(this).css('opacity'));
		if($(this).css('opacity')==1){
			if(!scoreIsSaved){
				var post_data = {
					name :$('#txt-name-tt1').val(),
					score : $('#game-over-score').text(),
					time : $('#info-3').text()
				}
				$.ajax({
					url: "games/canvassnakeSaveScore",
					type: "POST",
					data: post_data,
					success: function(){
						scoreIsSaved = true;
						dataIsFetched = false;
						scoreSavecheck();
					}
				});
			}
		}
		return false;
	});
	
	// clear input on focus
	$('.clearMeFocus').focus(function()
	{
		if($(this).val()==$(this).attr('title'))
		{
			clearMePrevious = $(this).val();
			$(this).val("");
		}
	});

	// if field is empty afterward, add text again
	$('.clearMeFocus').blur(function()
	{
		if($(this).val()=="")
		{
			$(this).val(clearMePrevious);
		}
	});
	
	$('.clearMeFocus').keyup(function() {
		keycheckandissavedcheck();
	});
	
	function keycheckandissavedcheck(){
		if($('.clearMeFocus').val()!=""&& $('.clearMeFocus').val()!=$('.clearMeFocus').attr('title')){
			$('.game-over-tt-btn1').css('opacity', '1');
			$('.game-over-tt-btn1').css('cursor', 'pointer');
		}else{
			$('.game-over-tt-btn1').css('opacity', '.3');
			$('.game-over-tt-btn1').css('cursor', 'auto');
		}
	}
	
	function scoreSavecheck(){
		if(scoreIsSaved == true){
			$('.clearMeFocus').attr("disabled",true);
			$('.clearMeFocus').css('opacity', '.3');
			$('.game-over-tt-btn1').css('opacity', '.3');
			$('.game-over-tt-btn1').css('cursor', 'auto');
		}else{
			$('.clearMeFocus').attr("disabled",false);
			$('.clearMeFocus').css('opacity', '1');
			keycheckandissavedcheck();
		}
	}
	
	$(".score-board-btn").mouseenter(function() {
		//SUBMITSCORE
		//		$('#tooltip').css('visibility', 'visible');
		Debugger.log("Hover");
		$(this).animate({
			//			'background-position-x': '-22'
			backgroundPosition:'-20 0'
		},{
			duration: 500,
			easing: 'easeOutExpo'
		});
	});
	$(".score-board-btn").mouseleave(function() {
		//SUBMITSCORE
		Debugger.log("Out");
		$(this).animate({
			//			'background-position-x': '-25'
			backgroundPosition:'-30 0'
		},{
			duration: 500,
			easing: 'easeOutExpo'
		});
	});
	
	$("#score-board-btndown").click(function() {
		//LEADERBOARD
		
		Debugger.log("tblposcntr = "+tblposcntr);
		Debugger.log("Math.floor($('#score-board-tbl2 tr').size() /10)"+Math.floor($('#score-board-tbl2 tr').size() /10));
		//$('#game-over').css('position', 'static');
		if(tblposcntr < Math.floor($('#score-board-tbl2 tr').size() / 10 ) -1 ){
			tblposcntr++;
			$('#score-board-tbl2').animate({
				top:-210*tblposcntr
			},{
				duration: 1000,
				easing: 'easeInOutQuint'
			});
		}
		return false;
	});
	$("#score-board-btnup").click(function() {
		//LEADERBOARD
		
		Debugger.log("tblposcntr = "+tblposcntr);
		//		$('#game-over').css('position', 'static');
		if(tblposcntr>0){
			tblposcntr--;
			$('#score-board-tbl2').animate({
				top:-210*tblposcntr
			},{
				duration: 1000,
				easing: 'easeInOutQuint'
			});
		}
		return false;
	});
	
	$("#btn-1-share").mouseenter(function() {
		Debugger.log("test");
		//		$('#baloon-1').css('display', 'block');
		$('#balloon-1').css('opacity', '1');
		$('#balloon-2').css('opacity', '0');
	//		$('#baloon-2').css('display', 'block');
	});
	$("#btn-1-share").mouseleave(function() {
		//		$('#baloon-1').css('display', 'none');
		$('#balloon-1').css('opacity', '0');
	});
	$("#btn-2-share").mouseenter(function() {
		Debugger.log("test2");
		//		$('#baloon-2').css('display', 'block');
		$('#balloon-2').css('opacity', '1');
		$('#balloon-1').css('opacity', '0');
	//		$('#baloon-1').css('display', 'none');
	});
	$("#btn-2-share").mouseleave(function() {
		//		$('#baloon-2').css('display', 'none');
		$('#balloon-2').css('opacity', '0');
	});
}

//PROTOTYPE FUNCTIONS
Game.prototype.setGameMode = function(str){
	if (str === Game.STATE_INFINIT_HUNGER ||str === Game.STATE_TAKE_THE_POSITION){
		this.setGameState(str);
		$('#buttons-introscreen').animate({
			opacity: 0
		},1000,this.removeTitleScreen);
	}
}


//STATICS
Game.STATE_TITLE = 'STATE_TITLE';
Game.STATE_INFINIT_HUNGER= 'STATE_INFINIT_HUNGER';
Game.STATE_TAKE_THE_POSITION= 'STATE_TAKE_THE_POSITION';
Game.STATE_IN_GAME= 'STATE_IN_GAME';
Game.STATE_GAME_OVER= 'STATE_GAME_OVER';

Game.frameRate = 60;
Game.PLAYFIELD_XOFFSET = 50;
Game.PLAYFIELD_YOFFSET = 100;
Game.PLAYFIELD_MAXPOSITION_WIDTH = 35;
Game.PLAYFIELD_MAXPOSITION_HEIGHT = 17;