import * as PIXI from "pixi.js";
import { gameConfig } from "./appConfig";
import { Globals } from "./Globals";

export class Background {
    constructor(topImage, backImage) {
        this.container = new PIXI.Container();

        this.container.scale.set(gameConfig.currentResolutionRatio);


        this.createSprite(topImage);
        this.createSprite(backImage);

        
    }

    
    createSprite(image) {
        const sprite = new PIXI.Sprite(image);
        this.container.addChild(sprite);
    }

    

}