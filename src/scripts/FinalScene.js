import * as PIXI from "pixi.js";
import { appConfig, gameConfig } from "./appConfig";
import { DebugText } from "./DebugText";

export class FinalScene {
    constructor(textToShow = null) {
        this.container = new PIXI.Container();
        
        
        const text = new DebugText("You've been disconnected.", 0, 0, "#fff", 80, "Luckiest Guy");

        if(textToShow != null)
            text.text = textToShow;

        this.container.addChild(text);

        if(text.width > appConfig.innerWidth)
        {
            text.style.fontSize *= appConfig.innerWidth/text.width  * 0.9;
        }
    


      //  this.container.scale.set(gameConfig.widthRatio);
        this.container.x = appConfig.width/2;
        this.container.y = appConfig.height/2;
    }

  


}