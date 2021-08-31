import * as PIXI from "pixi.js";
import { Globals } from "./Globals";

export class Background {
    constructor(width, height, fxId = null) {
        this.container = new PIXI.Container();

        this.width = width;
        this.height = height;

        this.createSprite();
        if(fxId != null)
            this.createBgFx(fxId);
    }

    
    createSprite() {
        const sprite = new PIXI.Sprite(Globals.resources["background"].texture);
        sprite.width = this.width;
        sprite.height = this.height;
        this.container.addChild(sprite);
    }

    createBgFx(id)
    {
        const fxSprite = new PIXI.Sprite(Globals.resources[`bgFx${id}`].texture);
        fxSprite.width = this.width;
        fxSprite.height = this.height;

        this.container.addChild(fxSprite);
    }

    

}