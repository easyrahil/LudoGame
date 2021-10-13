import * as PIXI from "pixi.js";
import { appConfig, gameConfig } from "./appConfig";
import { Background } from "./Background";
import { DebugCircle } from "./DebugCircle";
import { DebugText } from "./DebugText";
import { GameScene } from "./GameScene";
import { Globals } from "./Globals";
import TWEEN from "@tweenjs/tween.js";


export class GameEndScene {
    constructor() {
        this.container = new PIXI.Container();
      
        this.container.sortableChildren = true;
        this.createBackground();

     
        this.createWaitingScreen();
        this.createAvatars();

        Globals.gameData.tempPlayerData = {};

        Object.keys(Globals.gameData.players).forEach(key => {
            const player = Globals.gameData.players[key];
            Globals.gameData.tempPlayerData[key] = player;
            this.activateAvatarImage(player.pImage, this.avatars[parseInt(key)]);
        });

        this.createWonModal();

       
        
    }

    recievedMessage(msgType, msgParams)
    {
        if(msgType == "gameStart")
        {
            Globals.gameData.currentTurn = msgParams.turn;
            console.log("Turn :" + Globals.gameData.currentTurn);
            Globals.scene.start(new GameScene());
        } else if (msgType == "waitTimer")
        {
            this.updateTimer(msgParams.data);


            if(Object.keys(Globals.gameData.tempPlayerData).length == 1)
                this.waitingText.text = "Waiting for Others.. " + msgParams.data;
            else
                this.waitingText.text = "Game starting in.. " + msgParams.data;
        }else if (msgType == "playerJoined")
        {
            this.activateAvatarImage(Globals.gameData.tempPlayerData[msgParams.index].pImage, this.avatars[msgParams.index]);
            //init addon player avatar
        } else if(msgType == "playerLeft")
        {
            delete Globals.gameData.tempPlayerData[msgParams.id];
            this.removePlayerAvatar(msgParams.id);
        }
    }

    createBackground() {
		const fullbg = new Background(Globals.resources.background.texture);

		this.container.addChild(fullbg.container);

		this.bg = new Background(Globals.resources.gameOverShade.texture, null, appConfig.innerWidth, appConfig.innerHeight);
		this.bg.container.x = appConfig.leftX;

        this.ludoBoard = new PIXI.Sprite(Globals.resources.board1.texture);
        this.ludoBoard.scale.set(gameConfig.widthRatio);
        this.ludoBoard.anchor.set(0.5);
        this.ludoBoard.position = new PIXI.Point(appConfig.width/2, appConfig.height/2);

        this.bgSpark = new PIXI.Sprite(Globals.resources.gameOverSpark.texture);
        this.bgSpark.scale.set(gameConfig.widthRatio);
        this.bgSpark.anchor.set(0.5);
        this.bgSpark.position = new PIXI.Point(appConfig.width/2, appConfig.height/2);

        const maskSpark = new PIXI.Graphics();
        maskSpark.beginFill(0x00ff00);
        maskSpark.drawRect(appConfig.leftX, 0, this.bg.container.width, this.bg.container.height);
        maskSpark.endFill();

        this.bgSpark.mask = maskSpark;

        new TWEEN.Tween(this.bgSpark)
            .to({angle : 360}, 5000)
            .repeat(1000)
            .start();

        this.container.addChild(this.ludoBoard);
        this.container.addChild(this.bgSpark);
		this.container.addChild(this.bg.container);
        this.container.addChild(maskSpark);
	}

    createWonModal()
    {
        this.wonBlock = new PIXI.Sprite(Globals.resources.wonBlock.texture);
        this.wonBlock.anchor.set(0.5);
        this.wonBlock.x = appConfig.width/2;
        this.wonBlock.y = appConfig.height/2;
        
        this.wonBlock.zIndex = 20;

        // const playerWonData = [
        //     {name : "Player 1", won: "456", isMine : true},
        //     {name : "Player 2", won: "23", isMine : false},
        //     {name : "Player 3", won: "524", isMine : false},
        //     {name : "Player 4", won: "123", isMine : false},
        // ];
        

        for (let i = 0; i < Globals.gameData.winData.length; i++) {
            const wonData = Globals.gameData.winData[i];
            wonData.isMine = (wonData.plId == Globals.gameData.plId);
            const wonPlayerBlock = new PIXI.Sprite(wonData.isMine ?
                Globals.resources.wonPlayerSelfBlock.texture :
                Globals.resources.wonPlayerBlock.texture 
                );

            wonPlayerBlock.anchor.set(0.5);
            
            wonPlayerBlock.y -= wonPlayerBlock.height * 0.3;

            wonPlayerBlock.playerText = new DebugText(wonData.name.toUpperCase(), 0, 0,wonData.isMine ? "#fff" : "#555", 58, "Luckiest Guy");
            
                
                
            wonPlayerBlock.playerText.anchor.set(0.5);
            wonPlayerBlock.playerText.x -= wonPlayerBlock.width * 0.27 ;
            wonPlayerBlock.addChild(wonPlayerBlock.playerText);

            const rank = new DebugText(i+1, wonPlayerBlock.width * 0.1, 0, wonData.isMine ? "#fff" : "#555", 58, "Luckiest Guy");
            wonPlayerBlock.addChild(rank);
            
            const prize = new DebugText(wonData.win, wonPlayerBlock.width * 0.34, 0, wonData.isMine ? "#fff" : "#555", 58, "Luckiest Guy");
            prize.anchor.set(0.5);
            wonPlayerBlock.addChild(prize);
            
            if(wonData.isMine)
            {
                wonPlayerBlock.playerText.style.stroke = "#be3638";
                wonPlayerBlock.playerText.style.strokeThickness = 8;

                rank.style.stroke = "#be3638";
                rank.style.strokeThickness = 8;

                prize.style.stroke = "#be3638";
                prize.style.strokeThickness = 8;
            }
            
            wonPlayerBlock.y +=  i * wonPlayerBlock.height * 1.17;

           this.wonBlock.addChild(wonPlayerBlock);
        }

        const close = new PIXI.Sprite(Globals.resources.gameOverClose.texture);
        close.anchor.set(0.5, 0.3);
        
        close.x += this.wonBlock.width/2.1;
        close.y -= this.wonBlock.height/5;

        close.interactive = true;
        close.once("pointerdown", () => {
            this.wonBlock.destroy();
            this.gameEndText.destroy();
            this.logo.renderable = true;
        }, this);
        this.wonBlock.addChild(close);

        this.wonBlock.scale.set(gameConfig.widthRatio);
        this.container.addChild(this.wonBlock);
        
        this.createGameEndText();
    }

    createGameEndText()
    {
        this.gameEndText = new DebugText("", appConfig.width/2, appConfig.height/2, "#fff", 38 * gameConfig.widthRatio, "Luckiest Guy")
        //this.gameEndText.x = this.wonBlock.x + this.wonBlock.width/2;
        this.gameEndText.anchor.set(0.5, 1);
        this.gameEndText.y = this.wonBlock.y + this.wonBlock.height/2 - this.gameEndText.height;
        this.gameEndText.zIndex = 20;
        this.container.addChild(this.gameEndText);

    }

    updateTimer(value)
    {
        this.gameEndText.text = "Next Game Starts in "+value;
    }

    createWaitingScreen()
    {

        const timerContainer = new PIXI.Container();
        const block = new PIXI.Sprite(Globals.resources.waitingTextBlock.texture);
        block.anchor.set(0.5);

        this.waitingText = new DebugText("Waiting for Others..",0,0, "#fff", 48, "Luckiest Guy");
        this.waitingText.style.fontWeight = 'normal'

        timerContainer.x = appConfig.width/2;
        timerContainer.y = appConfig.height/2;

        timerContainer.addChild(block);
        timerContainer.addChild(this.waitingText);

        timerContainer.scale.set(gameConfig.widthRatio);
        
        this.container.addChild(timerContainer);
    }

    createAvatars()
    {

              

        this.avatars = [];

        for (let i = 0; i < 4; i++) {  
            

            const avatar = new PIXI.Sprite(Globals.resources.avatar.texture);
            avatar.anchor.set(0, 0.5);
            avatar.scale.set(gameConfig.widthRatio * 1.4);

            avatar.x = appConfig.leftX + appConfig.innerWidth/10;
            avatar.y = appConfig.height/2;

            avatar.x += i * (appConfig.innerWidth/5);
            avatar.y += (avatar.height * 1.2);

            const searchingText = new DebugText("Searching..", avatar.x + avatar.width/2, avatar.y, "#000", 24 * gameConfig.widthRatio, "Luckiest Guy");

            this.avatars.push(avatar);            
            
            this.container.addChild(avatar);
            this.container.addChild(searchingText);

            
            // this.activateAvatarImage("https://cccdn.b-cdn.net/1584464368856.png", avatar);
            
            
        }

        this.logo = new PIXI.Sprite(Globals.resources.logo.texture);
        this.logo.scale.set(gameConfig.widthRatio);
        this.logo.anchor.set(0.5);
        this.logo.x = appConfig.width/2;
        this.logo.y = appConfig.height/2 - (this.avatars[0].height * 1.2);
        this.logo.renderable = false;
        this.container.addChild(this.logo);  

    }

    activateAvatarImage(url, avatarParent)
    {
        avatarParent.plImage = PIXI.Sprite.from(url);
        avatarParent.plImage.anchor.set(0, 0.5);
        avatarParent.plImage.x = avatarParent.x;
        avatarParent.plImage.y = avatarParent.y;
        avatarParent.plImage.width = avatarParent.width;
        avatarParent.plImage.height = avatarParent.height;


        const maskGraphic = new PIXI.Graphics();
        maskGraphic.beginFill(0xFF3300);

        const widthPadding = (avatarParent.width * 0.07);
        const heightPadding = (avatarParent.height * 0.07);


        maskGraphic.drawRect(avatarParent.x  + widthPadding, (avatarParent.y - avatarParent.height/2) + heightPadding, avatarParent.width - widthPadding*2, avatarParent.height - heightPadding*2);
        maskGraphic.endFill();

        avatarParent.plImage.mask = maskGraphic;

        this.container.addChild(avatarParent.plImage);    
        this.container.addChild(maskGraphic);

    }


    removePlayerAvatar(index)
    {

        if(this.avatars[index] != undefined && this.avatars[index] != null)
        {
            const avatar = this.avatars[index];

            avatar.plImage.destroy();
        }

        
    }
}