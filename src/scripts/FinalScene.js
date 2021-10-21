import * as PIXI from "pixi.js";
import {  config } from "./appConfig";
import { DebugText } from "./DebugText";

export class FinalScene {
    constructor(textToShow = null) {
        this.sceneContainer = new PIXI.Container();

        this.container = new PIXI.Container();
        this.container.x = config.leftX;
        this.container.y = config.topY;
        this.container.scale.set(config.scaleFactor);
        this.sceneContainer.addChild(this.container);

        const text = new DebugText("You've been disconnected", config.logicalWidth/2, config.logicalHeight/2, "#fff", 80, "Luckiest Guy");

        if(textToShow != null)
            text.text = textToShow;

        this.container.addChild(text);

        if(text.width > config.logicalWidth)
        {
            text.style.fontSize *= config.logicalWidth/text.width  * 0.9;
        }
    


      //  this.container.scale.set(gameConfig.widthRatio);

    }

  


}