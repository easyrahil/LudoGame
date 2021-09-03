
import * as PIXI from "pixi.js";
import { gameConfig } from "./appConfig";
import { outerPath } from "./boardConfig";
import { Globals } from "./Globals";
import { GridPoint } from "./GridPoint";



export class LudoBoard
{
    constructor(x,y)
    {
        this.container = new PIXI.Container();
        this.container.x = x;
        this.container.y = y;


        this.container.sortableChildren = true;

        this.createBoardSprite();
        
        this.createGrid();
        //console.log("Ratio :" + gameConfig.widthRatio);
        this.container.scale.set(gameConfig.widthRatio);
        console.log("Width Ratio : " + gameConfig.widthRatio);
        console.log("Width : " + this.container.width);
        this.container.angle = 90;
       

      
    }

    createBoardSprite()
    {
        const boardSprite = new PIXI.Sprite(Globals.resources.board1.texture);
        boardSprite.anchor.set(0.5);
        
        this.container.addChild(boardSprite);
    }

    createGrid()
    {
        let x = -462;
        let y = -462;

        outerPath.forEach(arrayElement => {
            y = -462;
            arrayElement.forEach(element => {
                if(element != 0)
                {
                    this.createGridPoint(element, x, y);
                }
                y+=66;
            });
            x+=66;
        });
    }

    createGridPoint(id, xPos, yPos)
    {
        const point = new GridPoint(id, xPos, yPos);
        this.container.addChild(point);
       // this.container.addChild(point.debugText);
    }

    

 

    
}