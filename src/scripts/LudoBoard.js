
import * as PIXI from "pixi.js";
import { appConfig, gameConfig } from "./appConfig";
import { outerPath } from "./boardConfig";
import { DebugText } from "./DebugText";
import { Globals } from "./Globals";
import { LabelScore } from "./LabelScore";

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
        //this.createHouse();

        this.container.scale.set(gameConfig.currentResolutionRatio);
    }

    createBoardSprite()
    {
        const boardSprite = new PIXI.Sprite(Globals.resources.board1.texture);
        boardSprite.anchor.set(0.5);
        this.container.addChild(boardSprite);
    }

    createHouse()
    {
        //this.houses.push("");
    }

    createGrid()
    {
        // for (let x = -462 ; x < 528; x+=66) {
        //     for (let y = -462; y < 528; y+=66) {
        //         this.container.addChild(new DebugText("0", x, y));
        //     }
        // }

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
        this.container.addChild(new DebugText(id, xPos, yPos));
        return {position : {x : xPos, y :  yPos}}
    }

    
}