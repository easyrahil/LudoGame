import * as PIXI from "pixi.js";
import TWEEN, { Tween } from "@tweenjs/tween.js";
import { appConfig, gameConfig } from "./appConfig";
import { Background } from "./Background";
import { boardData, PawnsHomeIndex, playerData, starsPosition } from "./boardConfig";
import { DebugText } from "./DebugText";
import { Globals } from "./Globals";
import { LudoBoard } from "./LudoBoard";
import { Pawn } from "./Pawn";
import { Player } from "./Player";
import { Prompt } from "./Prompt";
import { DebugCircle } from "./DebugCircle";
import "pixi-spine";
import { Spine } from "@pixi-spine/runtime-3.8";
import { GameEndScene } from "./GameEndScene";

export class GameScene {
	constructor() {
		this.container = new PIXI.Container();

		this.container.sortableChildren = true;

		this.players = {};

		this.createBackground();
		this.createTimer();
		this.createPot();
		this.createBoard();
		this.addBoardOverlays();
		
		this.createPlayers(Globals.gameData.plId, Globals.automationOn);
		this.createInteractiveDice();
		this.assignPawns();
		this.createSkipHeartBlock();

		this.addSpineAnimation();

		
		this.turnChanged(Globals.gameData.currentTurn);



		//this.updateProgress(14/15);

		//	this.updateVisualPerTick();
		
		

		
	}

    recievedMessage(msgType, msgParams)
    {
		

		if(msgType == "timer")
		{
			this.updateTimer(msgParams.time);
			this.updateVisualPerTick();
		} else if (msgType == "turnTimer")
		{
			this.players[msgParams.id].updateTimer(1 - (msgParams.time/15));

			if(Globals.gameData.plId == msgParams.id)
			{

				this.updateProgress(1 - (msgParams.time / 15));
			}
		} else if (msgType == "rollDiceResult")
		{
			
			this.players[msgParams.id].setDice(msgParams.value);
			this.players[msgParams.id].stopDiceAnimation(msgParams.value);
			
			if(msgParams.id == Globals.gameData.plId)
			{
				
				this.stopDiceAnimation(msgParams.value);
				

				this.players[Globals.gameData.plId].ActivatePointerChoose(msgParams.pawnArr, this);
			}
		} else if (msgType == "movePawn")
		{
			this.movePawnTo(msgParams.id, msgParams.moveArr);

			this.updateScore(msgParams.scoreObj);
		} else if (msgType == "turnChanged")
		{
			this.playAnimation("info4");
			this.players[msgParams.plId].deductHealth();
			this.turnChanged(msgParams.nextRoll);


		} else if (msgType == "threeSix")
		{
			const prompt = new Prompt("Three Six", {x : appConfig.leftX,
                y : appConfig.height / 2 + this.ludoBoard.container.height / 2 + this.ludoBoard.container.height * 0.3},
                30,
                "#fff");

            setTimeout(() => {
                prompt.container.destroy();
            }, 2000);
                
            this.container.addChild(prompt.container);
            
            console.log("Inside Three Six");
            this.players[msgParams.id].setDice(6);
            
            if(msgParams.id == Globals.gameData.plId)
			{
				this.stopDiceAnimation(6);
				this.players[msgParams.id].stopDiceAnimation(6);
			}
                
            //this.players[data.id].ActivatePointerChoose();
            this.turnChanged(msgParams.nextRoll);
		} else if (msgType == "choosePawnAgain")
		{
			
			const prompt = new Prompt("Choose Token Again", {x : appConfig.leftX,
                y : appConfig.height / 2 + this.ludoBoard.container.height / 2 + this.ludoBoard.container.height * 0.3},
                30,
                "#fff");

            setTimeout(() => {
                prompt.container.destroy();
            }, 2000);
                
            this.container.addChild(prompt.container);

			this.players[Globals.gameData.plId].ActivatePointerChoose();
		} else if(msgType == "gameEnd")
		{
			const prompt = new Prompt(msgParams.reason, {x : appConfig.leftX,
                y : appConfig.height / 2 + this.ludoBoard.container.height / 2 + this.ludoBoard.container.height * 0.3},
                30,
                "#fff");

            setTimeout(() => {
                prompt.container.destroy();
            }, 1000);
                
            this.container.addChild(prompt.container);
			setTimeout(() => {
				Globals.scene.start(new GameEndScene());
			}, 1500);

			
		} else if (msgType == "noValidMove")
		{
			const prompt = new Prompt("No Valid Move.", {x : appConfig.leftX,
                y : appConfig.height / 2 + this.ludoBoard.container.height / 2 + this.ludoBoard.container.height * 0.3},
                30,
                "#fff");

            setTimeout(() => {
                prompt.container.destroy();
            }, 1000);
                
            this.container.addChild(prompt.container);


			this.turnChanged(msgParams.nextRoll);
		} else if (msgType == "diceRollNotif")
		{
			this.players[msgParams.id].playDiceAnimation();
		} else if (msgType == "playerLeft")
		{
			console.log("msg param : " + msgParams.id);
			this.players[msgParams.id].destroy();
			
			delete this.players[msgParams.id];
			delete Globals.gameData.players[msgParams.id];
		}
    }

    

	createBackground() {
		const fullbg = new Background(Globals.resources.background.texture);

		this.container.addChild(fullbg.container);

		this.bg = new Background(Globals.resources.gameBg.texture, null, appConfig.innerWidth, appConfig.innerHeight);
		this.bg.container.x = appConfig.leftX;
		this.container.addChild(this.bg.container);
	}

	createTimer() {

		const timerBlock = new PIXI.Sprite(Globals.resources.timerBlock.texture);
		const timerIcon = new PIXI.Sprite(Globals.resources.timerIcon.texture);
		
		timerBlock.anchor.set(0.5, 0);
		timerBlock.scale.set(gameConfig.widthRatio);
		timerBlock.x = appConfig.width/2;
		timerBlock.y = timerBlock.height;

		timerIcon.anchor.set(0.5);
		timerIcon.scale.set(gameConfig.widthRatio);
		timerIcon.x = appConfig.width/2 - timerBlock.width/2;
		timerIcon.y = timerBlock.y + timerBlock.height * 0.4;
		

		this.timer = new DebugText("00:00", appConfig.width / 2 + timerBlock.width * 0.4, timerBlock.y + timerBlock.height / 2, "#fff", timerBlock.height * 0.7, "Luckiest Guy");
		this.timer.style.fontWeight = 10;
		this.timer.anchor.set(1, 0.5);
		this.container.addChild(timerBlock);
		this.container.addChild(timerIcon);
		this.container.addChild(this.timer);
	}

	updateTimer(time) {
		const seconds = Math.floor(time % 60);
		const minutes = Math.floor(time / 60);
		const timeString = minutes + ":" + seconds;
		this.timer.text = timeString;
	}

	updateVisualPerTick()
	{
		//return;
		let pawnArray = Object.entries(Globals.pawns);
		
		pawnArray = pawnArray.sort((a, b) => a[1].globalPosition.y - b[1].globalPosition.y);

		let i = 16;
		pawnArray.reverse().forEach((pawnObj) => {
			pawnObj[1].zIndex = i;
			i--;
		});
	}


	createPot()
	{
		const container = new PIXI.Container();
		const pot = new PIXI.Sprite(Globals.resources.pot.texture);
		const potInfo = new PIXI.Sprite(Globals.resources.potInfo.texture);

		potInfo.anchor.set(0.5);

		this.potText = new DebugText("234", 0, 0, "#fff", 72, "Luckiest Guy");		
		pot.anchor.set(0.5);

		pot.y = pot.height * 2;

		container.x = appConfig.width/2;
		
		this.potText.anchor.set(0, 0.5);

		this.potText.x += 50;
		this.potText.y = pot.y;

		potInfo.y = pot.y - pot.height/2;
		potInfo.x += pot.width/2;

		container.scale.set(gameConfig.widthRatio);
		container.addChild(pot);
		container.addChild(this.potText);
		container.addChild(potInfo);
		this.container.addChild(container);
	}
	
	createSkipHeartBlock()
    {
		this.heartSkipContainers = [];

		Object.keys(this.players).forEach(key => {
			const player = this.players[key];

			const skipContainer = new PIXI.Container();
			//skipContainer.sortableChildren = true;

			const heartSkipBlock = new PIXI.Sprite(Globals.resources.heartSkipBlock.texture);

			heartSkipBlock.anchor.set(0.5, 1);
			
			
			const heartClose = new PIXI.Sprite(Globals.resources.heartSkipClose.texture);
			heartClose.anchor.set(0.5);
			heartClose.interactive = true;

			heartClose.on('pointerdown', () => {
				skipContainer.renderable = false;
			}, this);
			heartClose.x += heartSkipBlock.width/2 - 10;
			heartClose.y -= heartSkipBlock.height - 10;

			const heartText = new PIXI.Sprite(Globals.resources.heartSkipText.texture);
			heartText.anchor.set(0.5, 0);

			
			heartText.y -= heartSkipBlock.height - heartText.height;
			
			skipContainer.addChild(heartSkipBlock);
			skipContainer.addChild(heartClose);
			skipContainer.addChild(heartText);

			let xPos = -1;
			skipContainer.hearts = [];
			skipContainer.heartsBlack = [];


			for (let i = 1; i <= 3; i++) {
				const heart = new PIXI.Sprite(Globals.resources["heartSkip"+i].texture);
				const heartBlack = new PIXI.Sprite(Globals.resources["heartSkipBlack"+i].texture);

				
				heart.anchor.set(0.5);
				heartBlack.anchor.set(0.5);

				heart.x = xPos * heart.width;
				heart.y -= heartSkipBlock.height/2;

				heartBlack.x = xPos * heartBlack.width;
				heartBlack.y -= heartSkipBlock.height/2;

				skipContainer.addChild(heartBlack);
				skipContainer.addChild(heart);
				

				skipContainer.heartsBlack.push(heartBlack);
				skipContainer.hearts.unshift(heart);
				xPos++;
			}


			let point = new PIXI.Point();

			player.infoButton.getGlobalPosition(point, false);

			skipContainer.scale.set(gameConfig.widthRatio);
			skipContainer.position =point;

			skipContainer.zIndex= 20;

			this.container.addChild(skipContainer);
			player.assignHeartSkipBlock(skipContainer);
			this.heartSkipContainers.push(skipContainer);

			player.deactivateHeartSkipBlock();
		});

        
    }

	createBoard() {
		this.ludoBoard = new LudoBoard(appConfig.width / 2, appConfig.height / 2);
		this.container.addChild(this.ludoBoard.container);
	}

	addBoardOverlays()
	{
		const house = new PIXI.Sprite(Globals.resources.house.texture);
		house.anchor.set(0.5);
		house.scale.set(gameConfig.widthRatio);
		house.position = new PIXI.Point(appConfig.width/2, appConfig.height/2);
		this.container.addChild(house);
	}

	createPawns(y) {
		const pawnIds = ["Y", "B", "R", "G"]

		const pawnId = pawnIds[y];

		for (let x = 1; x <= 4; x++) {

			const pawn = new Pawn(`${pawnId}${x}`, "pawn" + (parseInt(y) + 1), this.ludoBoard);
			Globals.pawns[`${pawnId}${x}`] = pawn;
			pawn.x = (x * 50);
			pawn.y = y * 20 + 50;

			pawn.indication = new PIXI.Sprite(Globals.resources.circleIndication.texture);
			pawn.indication.position = new PIXI.Point(pawn.x, pawn.y);
			pawn.indication.anchor.set(0.5);
			pawn.indication.width = this.ludoBoard.container.height * 0.07;
			pawn.indication.height = this.ludoBoard.container.height * 0.07;
			pawn.indication.defaultWidth = pawn.indication.width;

			pawn.indication.width = pawn.indication.defaultWidth * 0.3;
			pawn.indication.height = pawn.indication.defaultWidth * 0.3;

			pawn.indication.on('pointerdown', () => {
				pawn.emit("pawnSelected", pawn.pawnID);
			}, this);

			this.container.addChild(pawn.indication);
			this.container.addChild(pawn);
		}
	}

	createPlayers(playerId, hasAutomation) {
		//console.log("Player ID :" + playerId);
		this.ludoBoard.rotateBoard(boardData[playerId].angle);


		Object.keys(Globals.gameData.players).forEach(key => {
			

			this.createPawns(key);

			const data = playerData[this.ludoBoard.container.angle][key];
			let player1;
			if (Globals.gameData.plId == key && hasAutomation)
			{
				player1 = new Player(key, data.h, data.v, this.ludoBoard, hasAutomation);
			} 	
			else
			{
				player1 = new Player(key, data.h, data.v, this.ludoBoard);
			}
				
			player1.setStartIndex(boardData[key].startIndex);
			player1.squeezeAnchor = data.anchor;
			
			player1.container.on("pressedDiceRoll", () => {
				this.playDiceAnimation();
			}, this);
			
			this.players[key] = player1;

			//Debug Pivot
			//const debugPoint = new DebugCircle(player1.container.x, player1.container.y);

			this.container.addChild(player1.container);
			//this.container.addChild(debugPoint);
			// playerId++;
			// if(playerId > 3)
			//     playerId = 0;
		});
	}

	createInteractiveDice() {
		this.interactiveDiceContainer = new PIXI.Container();
		this.interactiveDiceContainer.sortableChildren = true;


		const background = new PIXI.Sprite(Globals.resources.diceBG.texture);
		
		background.anchor.set(0.5);

		// this.circleGraphic = new PIXI.Graphics();
		// this.circleGraphic.lineStyle(10, 0x00FF00, 1);
		// this.circleGraphic.beginFill(0x650a5a, 0);
		// this.circleGraphic.drawCircle(0, 0, 120);
		// this.circleGraphic.endFill();


		this.radialGraphic = new PIXI.Graphics();
		this.radialGraphic.angle = -90;
		this.radialGraphic.beginFill();
		this.radialGraphic.lineStyle(50, 0x00FF00, 0.5);
		this.radialGraphic.arc(0, 0, 60, 0, (Math.PI * 2), true);
		this.radialGraphic.endFill();

		//this.circleGraphic.mask = this.radialGraphic;


		this.interactiveDiceContainer.on("pointerdown", () => {
			const distmsg = {
				t: "pDiceRoll"
			}
			Globals.socket.sendMessage(distmsg);
			Globals.soundResources.click.play();
			//Send Message to server
			this.playDiceAnimation();
			
		}, this);


		this.dices = []

		for (let i = 1; i <= 6; i++) {
			const dice = new PIXI.Sprite(Globals.resources[`dice${i}`].texture);

			dice.anchor.set(0.5, 0.5);
			dice.width = background.width * 0.6;
			dice.height = background.height * 0.6;
			dice.renderable = false;
			this.dices.push(dice);
			this.interactiveDiceContainer.addChild(dice);
		}


		const textureArrayOfAnimation = []

		for (let x = 1; x <= 6; x++) {
			textureArrayOfAnimation.push(Globals.resources[`diceEdge${x}`].texture);
		}

		this.animatedDice = new PIXI.AnimatedSprite(textureArrayOfAnimation);

		this.animatedDice.anchor.set(0.5, 0.5);
		this.animatedDice.width = background.width * 0.7;
		this.animatedDice.height = background.height * 0.7;
		this.animatedDice.loop = true;
		this.animatedDice.animationSpeed = 0.2;



		this.animatedDice.tween = new TWEEN.Tween(this.animatedDice)
			.to({ angle: 360 }, 800)
			.repeat(10);

		
		this.interactiveDiceContainer.addChild(background);
		
		//this.interactiveDiceContainer.addChild(this.circleGraphic);
		this.interactiveDiceContainer.addChild(this.radialGraphic);
		this.interactiveDiceContainer.addChild(this.animatedDice);
		this.interactiveDiceContainer.x = appConfig.width / 2;
		this.interactiveDiceContainer.y = appConfig.height / 2 + this.ludoBoard.container.height / 2 + this.ludoBoard.container.height * 0.3;
		this.interactiveDiceContainer.scale.set(gameConfig.widthRatio);
		this.container.addChild(this.interactiveDiceContainer);
	}

	updateProgress(value) {
		this.radialGraphic.clear();
		this.radialGraphic.beginFill();
		this.radialGraphic.lineStyle(50, 0x00FF00, 0.5);
		this.radialGraphic.arc(0, 0, 60, 0, (Math.PI * 2) * value, true);
		this.radialGraphic.endFill();

		
	}

	updateScore(scoreObj)
	{
		Object.keys(scoreObj).forEach(key => {
			if(key in this.players)
				this.players[key].updateScore(scoreObj[key]);
		});
	}


	setDiceInteractive(value) {
		

		if (value) {
			this.animatedDice.renderable = true;
			this.dices.forEach(dice => {
				dice.renderable = false;
			});
		}


		this.interactiveDiceContainer.renderable = value;
		this.interactiveDiceContainer.alpha = value ? 1 : 0.5;
		this.interactiveDiceContainer.interactive = value;
	}



	playDiceAnimation() {
		this.interactiveDiceContainer.interactive = false;
		this.animatedDice.renderable = true;
		Globals.soundResources.dice.play();
	

		this.dices.forEach(dice => {
			dice.renderable = false;
		});

		this.animatedDice.play();
		this.animatedDice.tween.start();


	}

	stopDiceAnimation(diceValue) {
		this.animatedDice.stop();
		this.animatedDice.tween.stop();
		this.animatedDice.renderable = false;

		this.setDice(diceValue);
		//this.interactiveDiceContainer.interactive = false;
	}

	setDice(index) {
		index--;
		this.dices.forEach(dice => {

			if (this.dices.indexOf(dice) == index) {
				dice.zIndex = 1;
				dice.renderable = true;
			} else {
				dice.zIndex = 0;
				dice.renderable = false;
			}
		});
	}

	assignPawns() {
		const pawnIds = ["Y", "B", "R", "G"];

		Object.keys(this.players).forEach(key => {

			for (let i = 1; i <= 4; i++) {
				this.players[key].pawnsID.push(`${pawnIds[key]}${i}`);

				Globals.pawns[`${pawnIds[key]}${i}`].on("pawnSelected", (pId) => this.players[key].pawnSelected(pId), this);
			}
			this.players[key].resetPawns();
		});
	}


	setPawnPointIndex(pawnIndex, pointIndex) {
		Globals.pawns[pawnIndex].setPointIndex(pointIndex);
	}

	movePawnTo(pawnId, pointsArray) {

		if(PawnsHomeIndex.includes(Globals.pawns[pawnId].currentPointIndex))
		{
			this.playAnimation("win");
		}

		if (pointsArray.length == 0) {

			Globals.pawns[pawnId].reachedFinalPosition();

			if (Globals.gameData.isCut) {
				const pawnId = Globals.gameData.cutPawn.tokenId;
				const pointToCompare = Globals.gameData.cutPawn.pos[0];
				const pointIndex =Globals.pawns[pawnId].currentPointIndex;
				this.playHitAnimation("hit",  Globals.gridPoints[pointIndex].globalPosition);
				this.moveBackPawnTo(pawnId, pointToCompare);
			} else {
				console.log("Turn Changed : " + Globals.gameData.currentTurn);

				this.turnChanged(Globals.gameData.currentTurn, (Globals.gameData.currentTurn == Globals.gameData.lastTurn));
			}

			return;
		}


		Globals.pawns[pawnId].move(pointsArray.shift()).then(() => {
			this.movePawnTo(pawnId, pointsArray);
		});
	}

	moveBackPawnTo(pawnId, pointToCompare) {

		if (Globals.pawns[pawnId].currentPointIndex == pointToCompare) {
			Globals.pawns[pawnId].reachedFinalPosition();
			console.log("Turn Changed : " + Globals.gameData.currentTurn);
			this.turnChanged(Globals.gameData.currentTurn, (Globals.gameData.currentTurn == Globals.gameData.lastTurn));
			return;
		}


		let nextPointIndex = Globals.pawns[pawnId].currentPointIndex == 1 ? 52 : Globals.pawns[pawnId].currentPointIndex - 1;
		Globals.pawns[pawnId].move(nextPointIndex, false).then(() => {
			this.moveBackPawnTo(pawnId, pointToCompare);
		});
	}

	addSpineAnimation()
	{

		this.spineAnimation = new Spine(Globals.resources.spineAnim.spineData);
		this.spineAnimation.scale.set(gameConfig.widthRatio * 2);
		this.spineAnimation.x = appConfig.width/2;
		this.spineAnimation.y = appConfig.height/2;
		this.container.addChild(this.spineAnimation);

		this.spineAnimation.defaultPosition = new PIXI.Point();
		this.spineAnimation.position.copyTo(this.spineAnimation.defaultPosition);
		
		

		this.spineAnimation.state.addListener(
			{
				complete: (entry) => {
					this.spineAnimation.renderable = false;
				},
				start : (entry) => this.spineAnimation.renderable = true 
			}
		);
		this.spineAnimation.renderable = false;
		this.spineAnimation.zIndex = 17;
			
		this.rollDiceAnimation = new Spine(Globals.resources.spineAnim.spineData);
		this.rollDiceAnimation.scale.set(gameConfig.widthRatio * 2);
		this.rollDiceAnimation.x = appConfig.width/2;
		this.rollDiceAnimation.y = this.ludoBoard.container.y + this.ludoBoard.container.height/2 + this.ludoBoard.container.height * 0.1;
		this.container.addChild(this.rollDiceAnimation);
		this.rollDiceAnimation.state.addListener(
			{
				complete: (entry) => this.rollDiceAnimation.renderable = false,
				start : (entry) => this.rollDiceAnimation.renderable = true 
			}
		);

		this.rollDiceAnimation.renderable = false;
		this.rollDiceAnimation.zIndex = 17;



		this.hitAnimation = new Spine(Globals.resources.spineAnim.spineData);
		this.hitAnimation.scale.set(gameConfig.widthRatio * 2);
		this.hitAnimation.x = appConfig.width/2;
		this.hitAnimation.y = appConfig.height/2;
		this.container.addChild(this.hitAnimation);
		this.hitAnimation.state.addListener(
			{
				complete: (entry) => this.hitAnimation.renderable = false,
				start : (entry) => this.hitAnimation.renderable = true 
			}
		);

		this.hitAnimation.renderable = false;
		this.hitAnimation.zIndex = 17;
		//console.log(this.rollDiceAnimation);

		//new DebugCircle(this.spineAnimation.x, this.spineAnimation.y, 5, this.container);
		//this.playAnimation("win");
	}

	playAnimation(stateName)
	{

		if (this.spineAnimation.state.hasAnimation(stateName))
		{
			this.spineAnimation.state.setAnimation(0, stateName, false);
		}

	}

	playHitAnimation(stateName, position)
	{
		this.hitAnimation.position = position;

		if (this.hitAnimation.state.hasAnimation(stateName))
		{
			this.hitAnimation.state.setAnimation(0, stateName, false);
		}

	}

	playRollDiceAnimation(rollAnimationString = null)
	{
		console.log(navigator.vibrate(500));

		if (this.rollDiceAnimation.state.hasAnimation((rollAnimationString != null) ? rollAnimationString : "info1"))
		{
			this.rollDiceAnimation.state.setAnimation(0, (rollAnimationString != null) ? rollAnimationString : "info1", false);
		}
	}


	turnChanged(turnValue, again = false) {

		if(turnValue == -1)
		{
			Globals.scene.start(new GameEndScene());

		} else
		{
			Globals.gameData.isCut = false;
			Globals.gameData.cutPawn = null;
	
			Object.keys(this.players).forEach(key => {
				if (key == turnValue) {
					this.players[turnValue].assignTurn();
				} else {
					this.players[key].removeTurn();
				}
			});
	
			if (turnValue == Globals.gameData.plId) {
				this.activateDiceRolling(again);
			} else {
				this.deactivateDiceRolling();
			}

			Globals.gameData.lastTurn = turnValue;
		}



	}

	activateDiceRolling(again) {
		//this.players[Globals.gameData.plId].activateDiceRolling();
		this.setDiceInteractive(true);
		
		
		this.playRollDiceAnimation((again) ? "info3" : null);
		if(this.players[Globals.gameData.plId].hasAutomation)
		{
			console.log("Roll Dice");
			this.players[Globals.gameData.plId].automation.RollDice(this);
		}


	}

	deactivateDiceRolling() {
		this.setDiceInteractive(false);


	}

}