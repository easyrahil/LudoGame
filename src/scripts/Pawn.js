import * as PIXI from "pixi.js";
import { Globals } from "./Globals";
import { appConfig, gameConfig } from "./appConfig";
import TWEEN from "@tweenjs/tween.js";

export class Pawn extends PIXI.Sprite
{
    constructor(id, textureId, ludoBoard)
    {
        
        super(Globals.resources[textureId].texture);
        this.pawnID = id;
        
        //this.sprite.scale.set(gameConfig.widthRatio * 0.1);

        this.zIndex = 1;

        this.currentPointIndex = null;
        this.widthByHeightRatio = this.width / this.height;
        this.currentWidth = ludoBoard.container.height * 0.07 * this.widthByHeightRatio;
        this.currentHeight = ludoBoard.container.height * 0.07;
        this.width = this.currentWidth;
        this.height = this.currentHeight;

        this.anchor.set(0.5, 0.8);

        // this.on('pointerdown', () => {
        //     this.emit("pawnSelected", this.pawnID);
        // }, this);

        
        
    }

    get globalPosition()
    {
        let point = new PIXI.Point();

        this.getGlobalPosition(point);

        return point;
    }

    
    

    reset(setPos = false)
    {
        if(this.squeezeTween.isPlaying())
            this.squeezeTween.stop();

        this.width = this.currentWidth;
        this.height = this.currentHeight;
        this.zIndex = 1;
        this.anchor.set(0.5, 0.8);

        if(setPos)
        {
            const point = Globals.gridPoints[this.currentPointIndex].globalPosition;
            this.x = point.x;
            this.y = point.y;
        }
    }

    

    squeeze(pos, zIndex)
    {
        this.zIndex = zIndex;
        this.squeezeTween =  new TWEEN.Tween(this)
                                .to({width: this.currentWidth * 0.8, height : this.currentHeight * 0.8, x : pos.x, y : pos.y}, 100)
                                .start();
    }

    setPointIndex(index)
    {
        this.currentPointIndex =  index;
        const point = Globals.gridPoints[index].globalPosition;
        this.x = point.x;
        this.y = point.y;
        this.indication.position = new PIXI.Point(this.x, this.y);
    }

    reachedFinalPosition()
    {
        this.isMoving = false;
        Globals.gridPoints[this.currentPointIndex].reached(this);
        // if(this.currentPointIndex != null)
        //     Globals.gridPoints[this.currentPointIndex].left(this);
                // Globals.gridPoints[index].reached(this);
    }

    beginMoving()
    {
        Globals.gridPoints[this.currentPointIndex].leave(this);
    }

    move(pointIndex, bounceEffect= true)
    {
        
        if(!this.isMoving)
        {
            this.isMoving = true;
            this.beginMoving();
        }

        return new Promise(resolve => {
            
            const point = Globals.gridPoints[pointIndex].globalPosition;
            
            const tween1 =  new TWEEN.Tween(this)
                                .to({x: point.x, y : point.y},(bounceEffect) ? 200 : 50)
                                .easing(TWEEN.Easing.Back.In)
                                .onComplete(() => {
                                        this.setPointIndex(pointIndex);
                                        resolve();
                                })
                                .start();

            if(bounceEffect)
            {
                
                const tween2 =  new TWEEN.Tween(this)
                .to({width: this.currentWidth * 1.3, height : this.currentHeight * 1.3}, 100)
                .yoyo(true)
                .easing(TWEEN.Easing.Back.In)
                .onComplete(() => {
                    Globals.soundResources.click.play();
                })
                .repeat(1)
                .start();
            }                    
            
        });
    }

    setInteractive()
    {
        this.indication.renderable = true;
        new TWEEN.Tween(this.indication)
                                .to({width: this.indication.defaultWidth, height : this.indication.defaultWidth},250)
                                .easing(TWEEN.Easing.Back.In)
                                .onComplete(() => {
                                    this.indication.interactive = true;
                                })
                                .start();
    }

    removeInteractive()
    {
        this.indication.interactive = false;
        new TWEEN.Tween(this.indication)
        .to({width: this.indication.defaultWidth * 0.1, height : this.indication.defaultWidth * 0.1},300)
        .easing(TWEEN.Easing.Back.In)
        .onComplete(() => {
            this.indication.renderable = false;
        })
        .start();
    }


    
}