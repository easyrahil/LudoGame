import * as PIXI from "pixi.js";
import { appConfig } from "./appConfig";
import { Background } from "./Background";
import { DebugText } from "./DebugText";
import { Globals } from "./Globals";


export class GameEndScene {
    constructor() {
        this.container = new PIXI.Container();
      

        this.createBackground();

        this.createGameEndText();

    }

    createBackground() {
		const fullbg = new Background(Globals.resources.background.texture);

		this.container.addChild(fullbg.container);

		this.bg = new Background(Globals.resources.gameBg.texture, null, appConfig.innerWidth, appConfig.innerHeight);
		this.bg.container.x = appConfig.leftX;
		this.container.addChild(this.bg.container);
	}

    createGameEndText()
    {
        this.container.addChild(new DebugText("Game Ended", appConfig.width/2, appConfig.height/2, "000", 44));

    }
}