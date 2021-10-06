import * as PIXI from "pixi.js";
import { appConfig, gameConfig } from "./appConfig";
import { DebugText } from "./DebugText";

export class FinalScene {
    constructor(textToShow = null) {
        this.container = new PIXI.Container();
        
        
        const text = new DebugText("You've been disconnected.", appConfig.width/2, appConfig.height/2, "#fff", 100 * gameConfig.widthRatio, "Luckiest Guy");

        if(textToShow != null)
            text.text = textToShow+"\nYou've been disconnected.";

        this.container.addChild(text);
    }

  


}