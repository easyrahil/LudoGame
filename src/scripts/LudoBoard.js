
import * as PIXI from "pixi.js";
import { appConfig, gameConfig } from "./appConfig";
import { houseData, outerPath } from "./boardConfig";
import { Globals } from "./Globals";
import { Point } from "./Point";

export class LudoBoard
{
    constructor(x,y)
    {
        this.houses = [];
        this.gridPath = {};
        this.container = new PIXI.Container();
        this.container.x = x;
        this.container.y = y;
        this.container.sortableChildren = true;

        this.createBoardSprite();
        
        this.createGrid();


        this.container.scale.set(gameConfig.currentResolutionRatio);

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
                    this.gridPath[element] = this.createGridPoint(element, x, y);
                }
                y+=66;
            });
            x+=66;
        });
    }

    createGridPoint(id, xPos, yPos)
    {
        const point = new Point(id, xPos, yPos);
       // this.container.addChild(point);
        return point;
    }

    

 

    
}