import * as PIXI from "pixi.js";
import { appConfig } from "./appConfig";
import { Background } from "./Background";
import { LudoBoard } from "./LudoBoard";

export class GameScene
{
    constructor()
    {
        this.container = new PIXI.Container();
        
        this.createBackground();
        this.createBoard();
    }

    createBackground()
    {
        this.bg = new Background(appConfig.width, appConfig.height, 1);
        
        

        this.container.addChild(this.bg.container);
    }

    createBoard()
    {
        this.ludoBoard = new LudoBoard(appConfig.width/2, appConfig.height/2);
        this.container.addChild(this.ludoBoard.container);
    }
}