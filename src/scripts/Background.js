import * as PIXI from "pixi.js";
import { gameConfig } from "./appConfig";
import { Globals } from "./Globals";

export class Background {
    constructor(width, height, fxId = null) {
        this.container = new PIXI.Container();

        this.width = width;
        this.height = height;

        this.createSprite();
        if(fxId != null)
            this.createBgFx(fxId);

        this.container.scale.set(gameConfig.currentResolutionRatio);
    }

    
    createSprite() {
        const sprite = new PIXI.Sprite(Globals.resources["background"].texture);
        this.container.addChild(sprite);
    }

    createBgFx(id)
    {
        const fxSprite = new PIXI.Sprite(Globals.resources[`bgFx${id}`].texture);
        this.container.addChild(fxSprite);
    }

    

}