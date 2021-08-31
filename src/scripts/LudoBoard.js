
import * as PIXI from "pixi.js";
import { appConfig } from "./appConfig";
import { Globals } from "./Globals";

export class LudoBoard
{
    constructor(x,y)
    {
        this.houses = [];

        this.container = new PIXI.Container();
        this.container.x = x;
        this.container.y = y;
        


        this.createBoardSprite();
        this.createHouse();
    }

    createBoardSprite()
    {
        const boardSprite = new PIXI.Sprite(Globals.resources.board1.texture);
        boardSprite.width = appConfig.width;
        boardSprite.height = appConfig.width;
        boardSprite.x = -boardSprite.width/2;
        boardSprite.y = -boardSprite.width/2;
        this.container.addChild(boardSprite);
    }

    createHouse()
    {
        this.houses.push("");
    }

    
}