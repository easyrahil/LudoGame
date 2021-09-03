import * as PIXI from "pixi.js";
import { appConfig, gameConfig } from "./appConfig";
import { Background } from "./Background";
import { Globals } from "./Globals";
import { LudoBoard } from "./LudoBoard";
import { Pawn } from "./Pawn";
import { Player } from "./Player";


export class GameScene
{
    constructor()
    {
        this.container = new PIXI.Container();
        
        this.pawns = {};
        
        this.createBackground();
        this.createBoard();
        this.createPawns();
        this.createPlayers();
        
        
        this.setPawnPointIndex("Y1", 1);
        this.movePawnTo("Y1", [2, 3, 4,5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
        this.setPawnPointIndex("B3", 45);
        this.moveBackPawnTo("B3", 14);
    }

    createBackground()
    {
        this.bg = new Background(Globals.resources.background.texture, Globals.resources.bgFx1.texture);
        this.container.addChild(this.bg.container);
    }

    createBoard()
    {
        this.ludoBoard = new LudoBoard(appConfig.width/2, appConfig.height/2);
        this.container.addChild(this.ludoBoard.container);
    }

    createPawns()
    {
        const pawnIds = ["Y", "B", "R", "G"]


        for (let y = 0; y < pawnIds.length; y++) {
            const pawnId = pawnIds[y];

            for (let x = 1; x <= 4; x++) {

                const pawn = new Pawn(`${pawnId}${x}`, "pawn"+(y+1), this.ludoBoard);
                this.pawns[`${pawnId}${x}`] = pawn;
                pawn.x = (x * 50);
                pawn.y = y*20 + 50;
                this.container.addChild(pawn);
            }
        }
    }

    createPlayers()
    {
        
        for (let index = 0; index < 2; index++) {
            for (let upIndex = 0; upIndex < 2; upIndex++) {
                const player1 = new Player(index,upIndex,this.ludoBoard);
                this.container.addChild(player1.container);
            }
        }
    }

    setPawnPointIndex(pawnIndex, pointIndex)
    {
        this.pawns[pawnIndex].setPointIndex(pointIndex);
    }

    movePawnTo(pawnId, pointsArray)
    {
        if(pointsArray.length == 0)
            return;
        
        this.pawns[pawnId].move(pointsArray.shift()).then(() => {
            this.movePawnTo(pawnId, pointsArray);
        });
    }

    moveBackPawnTo(pawnId, pointToCompare)
    {
        if(this.pawns[pawnId].currentPointIndex == pointToCompare)
            return; 
        
        this.pawns[pawnId].move(this.pawns[pawnId].currentPointIndex - 1, false).then(() => {
            this.moveBackPawnTo(pawnId, pointToCompare);
        });
    }
}