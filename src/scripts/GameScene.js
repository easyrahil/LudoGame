import * as PIXI from "pixi.js";
import { appConfig, gameConfig } from "./appConfig";
import { Background } from "./Background";
import { boardData, playerData } from "./boardConfig";
import { DebugText } from "./DebugText";
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
        this.createTimer();
        this.createBoard();
        
        this.createPlayers(Globals.gameData.plId);
        this.assignPawns();

        
        //  this.setPawnPointIndex("Y1", 1);
        //  this.movePawnTo("Y1", [2, 3, 4,5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
        //  this.setPawnPointIndex("B3", 45);
        //  this.moveBackPawnTo("B3", 14);

        Globals.emitter.on("timer", (time) => {
            this.updateTimer(time);
        }, this);
    }

    createBackground()
    {
        this.bg = new Background(Globals.resources.background.texture, Globals.resources.bgFx1.texture);
        this.container.addChild(this.bg.container);
    }

    createTimer()
    {
        this.timer = new DebugText("Timer : 0", appConfig.width/2 , 0, "#fff", 30);
        this.timer.y = this.timer.height;
        this.container.addChild(this.timer);
    }

    updateTimer(time)
    {
        this.timer.text = "Timer :" +time;
    }

    createBoard()
    {
        this.ludoBoard = new LudoBoard(appConfig.width/2, appConfig.height/2);
        this.container.addChild(this.ludoBoard.container);
    }

    createPawns(y)
    {
        const pawnIds = ["Y", "B", "R", "G"]

            const pawnId = pawnIds[y];

            for (let x = 1; x <= 4; x++) {

                const pawn = new Pawn(`${pawnId}${x}`, "pawn"+(parseInt(y)+1), this.ludoBoard);
                Globals.pawns[`${pawnId}${x}`] = pawn;
                pawn.x = (x * 50);
                pawn.y = y*20 + 50;
                this.container.addChild(pawn);
            }
    }

    createPlayers(playerId)
    {
        console.log("Player ID :" + playerId);
        this.ludoBoard.container.angle = boardData[playerId].angle;

        
        Object.keys(Globals.gameData.players).forEach(key => {
            console.log("KEY " + key);
            
            this.createPawns(key);

            const data = playerData[this.ludoBoard.container.angle][key];

            const player1 = new Player(key, data.h,data.v,this.ludoBoard);
            player1.setStartIndex(boardData[key].startIndex);
            player1.squeezeAnchor = data.anchor;
            this.players[key] = player1;
            this.container.addChild(player1.container);
            // playerId++;
            // if(playerId > 3)
            //     playerId = 0;
        }); 
    }

    assignPawns()
    {
        const pawnIds = ["Y", "B", "R", "G"];

        Object.keys(this.players).forEach(key => {
            
            for (let i = 1; i <= 4; i++) {
                this.players[key].pawnsID.push(`${pawnIds[key]}${i}`);
                
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

    activateDiceRolling()
    {

    }
}