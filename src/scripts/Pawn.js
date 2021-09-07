import * as PIXI from "pixi.js";
import { Globals } from "./Globals";
import { appConfig, gameConfig } from "./appConfig";
import TWEEN from "@tweenjs/tween.js";

export class Pawn extends PIXI.Sprite
{
    constructor(id, textureId, ludoBoard)
    {
        console.log(textureId);
        super(Globals.resources[textureId].texture);
        this.pawnID = id;
        
        //this.sprite.scale.set(gameConfig.widthRatio * 0.1);

        this.zIndex = 1;

        this.currentPointIndex = null;
        this.widthByHeightRatio = this.width / this.height;
        this.currentWidth = ludoBoard.container.height * 0.08 * this.widthByHeightRatio;
        this.currentHeight = ludoBoard.container.height * 0.08;
        this.width = this.currentWidth;
        this.height = this.currentHeight;

        this.anchor.set(1, 0.8);
        
    }

    

    reset()
    {
        this.width = this.currentWidth;
        this.height = this.currentHeight;
        this.anchor.set(0.5, 0.8);
    }

    squeeze(anchor)
    {
      //  console.log(this.squeezeAnchor.x);
        this.anchor = anchor;
        const tween1 =  new TWEEN.Tween(this)
                                .to({width: this.currentWidth * 0.4, height : this.currentHeight * 0.4}, 100)
                                .start();
    }

    setPointIndex(index)
    {
        if(this.currentPointIndex != null)
            Globals.gridPoints[this.currentPointIndex].left(this);

        this.currentPointIndex =  index;
        Globals.gridPoints[index].reached(this);

        const point = Globals.gridPoints[index].globalPosition;
        this.x = point.x;
        this.y = point.y;
    }

    move(pointIndex, bounceEffect= true)
    {
        
        return new Promise(resolve => {
            
            const point = Globals.gridPoints[pointIndex].globalPosition;
            
            const tween1 =  new TWEEN.Tween(this)
                                .to({x: point.x, y : point.y},(bounceEffect) ? 300 : 100)
                                .onComplete(() => {

                                        this.setPointIndex(pointIndex);
                                        resolve();
                                })
                                .start();

            if(bounceEffect)
            {
                
                const tween2 =  new TWEEN.Tween(this)
                .to({width: this.currentWidth * 1.3, height : this.currentHeight * 1.3}, 150)
                .yoyo(true)
                .easing(TWEEN.Easing.Quintic.Out)
                .onComplete(() => {
                    Globals.resources.click.sound.play();
                })
                .repeat(1)
                .start();
            }                    
            
        });
    }



    
}