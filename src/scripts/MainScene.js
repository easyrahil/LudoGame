import * as PIXI from "pixi.js";
import { appConfig, gameConfig } from "./appConfig";
import { Background } from "./Background";
import { GameScene } from "./GameScene";
import { Globals } from "./Globals";
import TWEEN from "@tweenjs/tween.js";
import { MatchmakingScene } from "./MatchmakingScene";
import { DebugText } from "./DebugText";
import { Socket } from "./Socket";
import { Prompt } from "./Prompt";

export class MainScene {
    constructor() {
        this.container = new PIXI.Container();

      

        this.createBackground();
        this.showWaitingTime();


        this.createButton();

       // this.createWaitingScreen();
        //this.createAvatars();
{
    const verText = new DebugText("Ver: 0.01", appConfig.leftX, 0);
    verText.y += verText.height;
    this.container.addChild(verText);
    console.log("VIBRATION : Active");
    console.log(navigator);
    navigator.vibrate(500);
}
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
            this.waitingText.text = "Waiting for Others.. " + msgParams.data;
        } else if (msgType == "joined")
        {

            Object.values(Globals.gameData.tempPlayerData).forEach(player => {
                this.activateAvatarImage(player.pImage, this.avatars[player.plId]);
            });

            //Init Avatars
        } else if (msgType == "playerJoined")
        {
           
            this.activateAvatarImage(Globals.gameData.tempPlayerData[msgParams.index].pImage, this.avatars[msgParams.index]);
            //init addon player avatar
        } else if(msgType == "playerLeft")
        {
            this.removePlayerAvatar(msgParams.id);
        }

    }

    createWaitingScreen()
    {
        // const darkBackground = new PIXI.Sprite(Globals.resources.darkBackground.texture);
        // darkBackground.width = appConfig.width;
        // darkBackground.height = appConfig.height;

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
        
        // this.container.addChild(darkBackground);
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


        maskGraphic.drawRect(avatarParent.x + widthPadding, (avatarParent.y - avatarParent.height/2) + heightPadding, avatarParent.width - widthPadding*2, avatarParent.height - heightPadding*2);
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

    createButton()
    {
        console.log(gameConfig.heightRatio);
        const fontSize = 50 * gameConfig.widthRatio;
        this.buttonContainer = new PIXI.Container();
        this.container.addChild(this.buttonContainer);

        const button1 = new PIXI.Graphics();

        button1.beginFill(0xDE3249);
        button1.drawRect(appConfig.leftX, appConfig.innerWidth/4/2, appConfig.innerWidth/4, appConfig.innerWidth/4);
        button1.endFill();

        button1.textComponent = new DebugText("Player 1 \n100111", appConfig.leftX + appConfig.innerWidth/8, appConfig.innerWidth/4/2 + appConfig.innerWidth/8, "#fff", fontSize, "Luckiest Guy");

        button1.addChild(button1.textComponent);
        
        button1.interactive = true;
        button1.on("pointerdown", () => {
            console.log("Clicked 1");
            Globals.automationOn = false;
            Globals.socket = new Socket("100111", "Player1");
            this.triggerButtonActive();
        }, this);

        const button2 = new PIXI.Graphics();
        
        button2.beginFill(0xDE3249);
        button2.drawRect(appConfig.rightX-appConfig.innerWidth/4, appConfig.innerWidth/4/2, appConfig.innerWidth/4, appConfig.innerWidth/4);
        button2.endFill();

        button2.interactive = true;
        button2.on("pointerdown", () => {
            console.log("Clicked 2");
            Globals.automationOn = false;
            Globals.socket = new Socket("100112", "Player2");
            this.triggerButtonActive();
        }, this);

        button2.textComponent = new DebugText("Player 2 \n100112", appConfig.rightX - appConfig.innerWidth/8, appConfig.innerWidth/4/2 + appConfig.innerWidth/8, "#fff", fontSize, "Luckiest Guy");

        button2.addChild(button2.textComponent);

        
        const button3 = new PIXI.Graphics();
        
        button3.beginFill(0xDE3249);
        button3.drawRect(appConfig.width/2-appConfig.innerWidth/8, appConfig.innerWidth/4/2, appConfig.innerWidth/4, appConfig.innerWidth/4);
        button3.endFill();

        button3.interactive = true;
        button3.on("pointerdown", () => {
            console.log("Clicked 2");
            Globals.automationOn = false;
            Globals.socket = new Socket("100113", "Player2");
            this.triggerButtonActive();
        }, this);

        

        button3.textComponent = new DebugText("Player 3 \n100113", appConfig.width/2 - appConfig.innerWidth/32, appConfig.innerWidth/4/2 + appConfig.innerWidth/8, "#fff", fontSize, "Luckiest Guy");

        button3.addChild(button3.textComponent);

        for (let i = 1; i <= 10; i++) {
                const button = new PIXI.Graphics();

                button.beginFill(0x00FF00);

                const xValue = (i % 2 == 0) ? appConfig.rightX - appConfig.innerWidth/5 : appConfig.leftX;
                const xTextValue = (i % 2 == 0) ? appConfig.rightX - appConfig.innerWidth/10 : appConfig.leftX + appConfig.innerWidth/10;
                const yValue = (appConfig.innerWidth/5) + (appConfig.innerWidth/4 * Math.ceil(i /2)) 
                button.drawRect(xValue, yValue, appConfig.innerWidth/5, appConfig.innerWidth/5);
                button.endFill();

                const id = 100100 + i;

                button.textComponent = new DebugText("Player "+ i +" \n"+id, xTextValue,
                    yValue + appConfig.innerWidth/10, "#000", fontSize, "Luckiest Guy");

                button.addChild(button.textComponent);


                

                
                button.interactive = true;
                button.on("pointerdown", () => {
                    console.log("Clicked 1");
                    Globals.automationOn = true;
                    Globals.socket = new Socket(id.toString(), "Player "+ i);
                    this.triggerButtonActive();
                    
                }, this);
                
                this.buttonContainer.addChild(button);
        }




        

        // const button4 = new PIXI.Graphics();
        
        // button4.beginFill(0x00FF00);
        // button4.drawRect(appConfig.rightX-appConfig.innerWidth/4, appConfig.innerWidth/4*2, appConfig.innerWidth/4, appConfig.innerWidth/4);
        // button4.endFill();

        // button4.textComponent = new DebugText("Player 2 \nAuto", appConfig.rightX - appConfig.innerWidth/8, appConfig.innerWidth/2 + appConfig.innerWidth/8, "#fff", fontSize, "Luckiest Guy");

        // button4.addChild(button4.textComponent);

        // button4.interactive = true;
        // button4.on("pointerdown", () => {
        //     console.log("Clicked 2");
        //     Globals.automationOn = true;
        //     Globals.socket = new Socket("230870", "Player2");
        //     this.triggerButtonActive();
        // }, this);

        this.buttonContainer.addChild(button1);
        this.buttonContainer.addChild(button2);
        this.buttonContainer.addChild(button3);
        //this.buttonContainer.addChild(button3);
        //this.buttonContainer.addChild(button4);
    }

    triggerButtonActive()
    {
        this.buttonContainer.destroy();
        
        //const waitingText = new DebugText("Waiting for other players.", appConfig.width/2, appConfig.height/2, "#fff", 28, "Luckiest Guy");
        //waitingText.style.fontWeight = 10;
        //this.container.addChild(waitingText);
        this.createWaitingScreen();
        this.createAvatars();
    }

    createBackground()
    {
        this.background = new Background(Globals.resources.background.texture, Globals.resources.background.texture);
        this.container.addChild(this.background.container);
    }
    
    showWaitingTime()
    {
       // this.waitingTime = new DebugText("Looking For Players", appConfig.width/2, appConfig.height/2, "#000");
        //this.container.addChild(this.waitingTime);
    }
    
    

    createLogo()
    {
        this.logo = new PIXI.Sprite(Globals.resources.logo.texture);
        this.logo.scale.set(gameConfig.widthRatio);
        this.logo.anchor.set(0.5);
        this.logo.x = appConfig.width/2;
        this.logo.y = appConfig.height/2;

        this.logo.interactive = true;
        this.logo.on("pointerdown", () => {
            if(Globals.debug.sound)
            Globals.soundResources.click.play();
            
            Globals.scene.start(new MatchmakingScene());
        }, this);

        this.logo.on("pointerover", () => {
            const tween = new TWEEN.Tween(this.logo)
                                    .to({scale : {x : gameConfig.widthRatio * 1.2, y : gameConfig.widthRatio * 1.2} }, 300)
                                    .start();
        }, this);

        this.logo.on("pointerout", () => {
            const tween = new TWEEN.Tween(this.logo)
                                    .to({scale : {x : gameConfig.widthRatio, y : gameConfig.widthRatio} }, 100)
                                    .start();
        }, this);

        this.container.addChild(this.logo);
    }

    createPlayBtn()
    {

    }

    update(dt) {
        
    }
}