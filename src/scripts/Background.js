import * as PIXI from "pixi.js";
import { appConfig, gameConfig } from "./appConfig";
import { Globals } from "./Globals";

export class Background {
    constructor(topImage, backImage) {
        this.container = new PIXI.Container();

        //this.container.scale.set(gameConfig.currentResolutionRatio);


        this.createSprite(topImage);
        this.createSprite(backImage);

        
    }

    
    createSprite(image) {
        const sprite = new PIXI.Sprite(image);
        sprite.width = appConfig.width;
        sprite.height = appConfig.height;
        this.container.addChild(sprite);
    }

    

}