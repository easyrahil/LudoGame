import * as PIXI from "pixi.js";
import { appConfig, gameConfig } from "./appConfig";
import { Background } from "./Background";
import { boardData, playerData } from "./boardConfig";
import { Globals } from "./Globals";
import { LudoBoard } from "./LudoBoard";
import { Pawn } from "./Pawn";
import { Player } from "./Player";


export class GameScene
{
    constructor()
    {
        this.container = new PIXI.Container();
        
        

        this.players = {};
        
        this.createBackground();
        this.createBoard();
       this.createPawns();
        this.createPlayers(2);
        this.assignPawns();
        
        
       // this.setPawnPointIndex("Y1", 1);
        this.movePawnTo("Y1", [2, 3, 4,5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
        //this.setPawnPointIndex("B3", 45);
        //this.moveBackPawnTo("B3", 14);
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
                Globals.pawns[`${pawnId}${x}`] = pawn;
                pawn.x = (x * 50);
                pawn.y = y*20 + 50;
                this.container.addChild(pawn);
            }
        }
    }

    createPlayers(playerId)
    {
        this.ludoBoard.container.angle = boardData[playerId].angle;

        Object.keys(playerData).forEach(key => {
            const data = playerData[key];
            const player1 = new Player(playerId, data.h,data.v,this.ludoBoard);
            player1.setStartIndex(boardData[playerId].startIndex);
            player1.squeezeAnchor = data.anchor;
            this.players[playerId] = player1;
            this.container.addChild(player1.container);
            playerId++;
            if(playerId > 4)
                playerId = 1;
        });

 
    }

    assignPawns()
    {
        const pawnIds = ["Y", "B", "R", "G"];

        Object.keys(this.players).forEach(key => {
            
            for (let i = 1; i <= 4; i++) {
                this.players[key].pawnsID.push(`${pawnIds[key - 1]}${i}`);
                
            }
            this.players[key].resetPawns();
        });
    }

    setPawnPointIndex(pawnIndex, pointIndex)
    {
        Globals.pawns[pawnIndex].setPointIndex(pointIndex);
    }

    movePawnTo(pawnId, pointsArray)
    {
        if(pointsArray.length == 0)
            return;
        
        Globals.pawns[pawnId].move(pointsArray.shift()).then(() => {
            this.movePawnTo(pawnId, pointsArray);
        });
    }

    moveBackPawnTo(pawnId, pointToCompare)
    {
        if(Globals.pawns[pawnId].currentPointIndex == pointToCompare)
            return; 
        
        Globals.pawns[pawnId].move(Globals.pawns[pawnId].currentPointIndex - 1, false).then(() => {
            this.moveBackPawnTo(pawnId, pointToCompare);
        });
    }
}