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

        this.createGameEndText();

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
            //this.waitingText.text = "Waiting for Others.. " + msgParams.data;
        }
    }

    createBackground() {
		const fullbg = new Background(Globals.resources.background.texture);

		this.container.addChild(fullbg.container);

		this.bg = new Background(Globals.resources.gameEndScreen.texture, null, appConfig.innerWidth, appConfig.innerHeight);
		this.bg.container.x = appConfig.leftX;
		this.container.addChild(this.bg.container);
	}

    createGameEndText()
    {
        this.gameEndText = new DebugText("Game Ended", appConfig.width/2, appConfig.height/2, "#fff", 80 * gameConfig.widthRatio, "Luckiest Guy")
        this.gameEndText.style.fontWeight = "normal";
        this.container.addChild(this.gameEndText);

    }

    updateTimer(value)
    {
        this.gameEndText.text = "Game Ended, \nNext Game Starts in "+value;
    }
}