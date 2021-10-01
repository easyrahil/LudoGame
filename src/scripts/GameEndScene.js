import * as PIXI from "pixi.js";
import { appConfig, gameConfig } from "./appConfig";
import { Background } from "./Background";
import { DebugText } from "./DebugText";
import { GameScene } from "./GameScene";
import { Globals } from "./Globals";


export class GameEndScene {
    constructor() {
        this.container = new PIXI.Container();
      

        this.createBackground();

     
        this.createWaitingScreen();
        this.createAvatars();


        Object.keys(Globals.gameData.players).forEach(key => {
            const player = Globals.gameData.players[key];

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
            this.waitingText.text = "Waiting for Others.. " + msgParams.data;
        }else if (msgType == "playerJoined")
        {
            this.activateAvatarImage(Globals.gameData.tempPlayerData[msgParams.index].pImage, this.avatars[msgParams.index]);
            //init addon player avatar
        } else if(msgType == "playerLeft")
        {
            this.removePlayerAvatar(msgParams.id);
        }
    }

    createBackground() {
		const fullbg = new Background(Globals.resources.background.texture);

		this.container.addChild(fullbg.container);

		this.bg = new Background(Globals.resources.gameEndScreen.texture, null, appConfig.innerWidth, appConfig.innerHeight);
		this.bg.container.x = appConfig.leftX;
		this.container.addChild(this.bg.container);
	}

    createWonModal()
    {
        this.wonBlock = new PIXI.Sprite(Globals.resources.wonBlock.texture);
        this.wonBlock.anchor.set(0.5);
        this.wonBlock.x = appConfig.width/2;
        this.wonBlock.y = appConfig.height/2;
        

        const playerWonData = [
            {name : "Player 1", won: "456"},
            {name : "Player 2", won: "23"},
            {name : "Player 3", won: "524"},
            {name : "Player 4", won: "123"},
        ];
        

        for (let i = 0; i < playerWonData.length; i++) {
            const wonData = playerWonData[i];
            
            const wonPlayerBlock = new PIXI.Sprite(Globals.resources.wonPlayerBlock.texture);
            wonPlayerBlock.anchor.set(0.5);
            wonPlayerBlock.y -= this.wonBlock.height/2 - wonPlayerBlock.height * 1.6;

            wonPlayerBlock.playerText = new DebugText(wonData.name, 0, 0, "#eaff93", 64, "Luckiest Guy");
            wonPlayerBlock.playerText.anchor.set(0, 0.5);
            wonPlayerBlock.playerText.x -= wonPlayerBlock.width * 0.4 ;
            wonPlayerBlock.addChild(wonPlayerBlock.playerText);

            const divider = new DebugText(":", 0, 0, "#eaff93", 64, "Luckiest Guy");
            wonPlayerBlock.addChild(divider);

            const rupee = new PIXI.Sprite(Globals.resources.rupee.texture);
            rupee.anchor.set(0, 0.5);
            rupee.x += wonPlayerBlock.width * 0.05;
            rupee.y += rupee.height * 0.1;
            wonPlayerBlock.addChild(rupee);

            const prize = new DebugText(wonData.won, wonPlayerBlock.width * 0.1 + rupee.width/2, 0, "#fff", 64, "Luckiest Guy");
            prize.anchor.set(0, 0.5);
            wonPlayerBlock.addChild(prize);
            
            
            wonPlayerBlock.y +=  i * wonPlayerBlock.height * 1.2;

           this.wonBlock.addChild(wonPlayerBlock);
        }

        const close = new PIXI.Sprite(Globals.resources.close.texture);
        close.anchor.set(0.5, 0.3);
        
        close.x += this.wonBlock.width/2;
        close.y -= this.wonBlock.height/2;

        close.interactive = true;
        close.once("pointerdown", () => {
            this.wonBlock.destroy();
            this.gameEndText.destroy();
        }, this);
        this.wonBlock.addChild(close);

        this.wonBlock.scale.set(gameConfig.widthRatio);
        this.container.addChild(this.wonBlock);
        
        this.createGameEndText();
    }

    createGameEndText()
    {
        this.gameEndText = new DebugText("", appConfig.width/2, appConfig.height/2, "#1e729b", 48 * gameConfig.widthRatio, "Luckiest Guy")
        //this.gameEndText.x = this.wonBlock.x + this.wonBlock.width/2;
        this.gameEndText.anchor.set(0.5, 1);
        this.gameEndText.y = this.wonBlock.y + this.wonBlock.height/2 - this.gameEndText.height;

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

        const logo = new PIXI.Sprite(Globals.resources.logo.texture);
        logo.scale.set(gameConfig.widthRatio);
        logo.anchor.set(0.5);
        logo.x = appConfig.width/2;
        logo.y = appConfig.height/2 - (this.avatars[0].height * 1.2);

        this.container.addChild(logo);  
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
        const avatar = this.avatars[index];

        avatar.plImage.destroy();
    }
}