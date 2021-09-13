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
        // Globals.resources.music.sound.play({
        //     loop: true,
        //     volume: 0.2
        // });
      

        this.createBackground();
        this.showWaitingTime();
        //this.createInteractiveDice();
        //this.createLogo();
        //this.createPlayBtn();

        this.createButton();

    }


    recievedMessage(msgType, msgParams)
    {
        if(msgType == "gameStart")
        {
            Globals.gameData.currentTurn = msgParams.turn;
            console.log("Turn :" + Globals.gameData.currentTurn);
            Globals.scene.start(new GameScene());
        }
    }

    createButton()
    {
        const button1 = new PIXI.Graphics();

        button1.beginFill(0xDE3249);
        button1.drawRect(appConfig.leftX, 50, 100, 100);
        button1.endFill();

        button1.interactive = true;
        button1.on("pointerdown", () => {
            console.log("Clicked 1");
            Globals.socket = new Socket("230869", "Player1");
        }, this);

        const button2 = new PIXI.Graphics();
        
        button2.beginFill(0xDE3249);
        button2.drawRect(appConfig.rightX, 50, 100, 100);
        button2.endFill();

        button2.interactive = true;
        button2.on("pointerdown", () => {
            console.log("Clicked 2");
            Globals.socket = new Socket("230870", "Player2");
        }, this);

        this.container.addChild(button1);
        this.container.addChild(button2);
    }

    createBackground()
    {
        this.background = new Background(Globals.resources.background.texture, Globals.resources.background.texture);
        this.container.addChild(this.background.container);
    }
    
    showWaitingTime()
    {
        this.waitingTime = new DebugText("Looking For Players", appConfig.width/2, appConfig.height/2, "#000");
        this.container.addChild(this.waitingTime);
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
            Globals.resources.click.sound.play();
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