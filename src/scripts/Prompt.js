import * as PIXI from "pixi.js";
import { gameConfig } from "./appConfig";
import { Globals } from "./Globals";
import TWEEN from "@tweenjs/tween.js";

export class Prompt
{
    constructor(text, position, size = "44", color = "#fff")
    {
        this.container = new PIXI.Container();
        

        this.createBackground();
        this.createForegroundText(text, size, color);

        this.container.scale.set(gameConfig.widthRatio);
        this.finalPosition = new PIXI.Point(position);
        this.container.position = new PIXI.Point(this.finalPosition.x - this.container.width, this.finalPosition.y);

        // const fallBackTween = new TWEEN.Tween(this.container)
        //                     .to({x : this.finalPosition.x - this.container.width}, 100)
        //                     .onComplete()
        //                     .start();
            

        const tween = new TWEEN.Tween(this.container)
                    .to({x : this.finalPosition.x}, 100)
                    .onComplete()
                    .start();
    }


    createBackground()
    {
        this.background = new PIXI.Sprite(Globals.resources.promptBG.texture);
        this.background.anchor.set(0, 0.5);
    }

    createForegroundText(text, size, color)
    {
        this.text = new PIXI.Text(text,{

        });
        
        this.text.style = {
            fontFamily: "Verdana",
            fontWeight: "bold",
            fontSize: size,
            fill: [color]
        };
        this.text.text = text;
        this.text.anchor.set(0.5);
    }
}