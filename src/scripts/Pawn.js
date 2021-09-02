import * as PIXI from "pixi.js";
import { Globals } from "./Globals";
import { gameConfig } from "./appConfig";
import TWEEN from "@tweenjs/tween.js";

export class Pawn
{
    constructor(id, textureId)
    {
        this.pawnID = id;

        this.sprite = new PIXI.Sprite(Globals.resources[textureId].texture);
        this.sprite.zIndex = 1;
        this.sprite.anchor.set(0.5, 0.8);

        this.sprite.scale.set(gameConfig.currentResolutionRatio*gameConfig.currentResolutionRatio * 0.8);

        this.currentPointIndex = null;
        console.log(this.sprite);
    }

    setPointIndex(index)
    {
        this.currentPointIndex =  index;
        const point = Globals.gridPoints[index].globalPosition;
        this.sprite.x = point.x;
        this.sprite.y = point.y;
    }

    move(pointIndex, bounceEffect= true)
    {
        const scaleValue = {x : gameConfig.currentResolutionRatio*gameConfig.currentResolutionRatio, y : gameConfig.currentResolutionRatio*gameConfig.currentResolutionRatio} ;
        
        
        return new Promise(resolve => {
            
            const point = Globals.gridPoints[pointIndex].globalPosition;
            
            const tween1 =  new TWEEN.Tween(this.sprite)
                                .to({x: point.x, y : point.y},(bounceEffect) ? 1000 : 100)
                                .onComplete(() => {
                                        this.currentPointIndex = pointIndex;
                                        resolve();
                                })
                                .start();

            if(bounceEffect)
            {
                
                const tween2 =  new TWEEN.Tween(this.sprite)
                .to({scale: scaleValue}, 500)
                .yoyo(true)
                .onComplete(() => {
                    Globals.resources.click.sound.play();
                })
                .repeat(1)
                .start();
            }                    
            
        });
    }



    
}