import * as PIXI from "pixi.js";
import TWEEN from "@tweenjs/tween.js";
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
        this.createInteractiveDice();
        this.assignPawns();

        this.turnChanged(Globals.gameData.currentTurn);
        
        //  this.setPawnPointIndex("Y1", 1);
        //  this.movePawnTo("Y1", [2, 3, 4,5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
        //  this.setPawnPointIndex("B3", 45);
        //  this.moveBackPawnTo("B3", 14);

        Globals.emitter.on("timer", (time) => {
            this.updateTimer(time);
        }, this);

        Globals.emitter.on("turnTimer", (time) => 
        {
            // console.log("Timer");
            //  if(this.players[Globals.gameData.plId].hasTurn)
            //  {
                
            //      this.updateProgress((10 - time) / 10);
            //  }
        });

        Globals.emitter.on("rollDiceResult", (data) => {
            
            this.players[data.id].setDice(data.value);
            
            if(this.players[Globals.gameData.plId].hasTurn)
            {
                this.stopDiceAnimation();
                console.log(this);
               // console.log("")
               // this.players[Globals.gameData.plId].ActivatePointerChoose();
            }
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

    createInteractiveDice()
    {
        this.interactiveDiceContainer = new PIXI.Container();
        this.interactiveDiceContainer.sortableChildren = true;
        
        
        const background = new PIXI.Graphics();
        background.lineStyle(10, 0xc3c3c3, 0.8);
        background.beginFill(0x650a5a, 0);
        background.drawCircle(0, 0, 120);
        background.endFill();

        this.circleGraphic = new PIXI.Graphics();
        this.circleGraphic.lineStyle(10, 0x00FF00, 1);
        this.circleGraphic.beginFill(0x650a5a, 0);
        this.circleGraphic.drawCircle(0, 0, 120);
        this.circleGraphic.endFill();


        this.radialGraphic = new PIXI.Graphics();
        this.radialGraphic.lineStyle(100, 0x00FF00, 1);
        this.radialGraphic.angle = -90;
        this.radialGraphic.arc(0, 0, 140, 0, (Math.PI * 2), true);


        this.circleGraphic.mask = this.radialGraphic;
        

        this.interactiveDiceContainer.on("pointerdown", () => {
            const distmsg = {
                t : "pDiceRoll"
            }
            Globals.socket.sendMessage(distmsg);
            Globals.resources.click.sound.play();
            //Send Message to server
            this.playDiceAnimation();
        }, this);


        const textureArrayOfAnimation = []

        for (let x = 1; x <= 6; x++) {
            textureArrayOfAnimation.push(Globals.resources[`diceEdge${x}`].texture);
        }

        this.animatedDice = new PIXI.AnimatedSprite(textureArrayOfAnimation);
        
        this.animatedDice.anchor.set(0.5, 0.5);
        this.animatedDice.width = this.circleGraphic.width * 0.7;
        this.animatedDice.height = this.circleGraphic.height * 0.7;
        this.animatedDice.loop = true;
        this.animatedDice.animationSpeed = 0.2;

    

        this.animatedDice.tween = new TWEEN.Tween(this.animatedDice)
                                    .to({angle : 360}, 800)
                                    .repeat(10);

        this.interactiveDiceContainer.addChild(this.animatedDice);
        this.interactiveDiceContainer.addChild(background);
        this.interactiveDiceContainer.addChild(this.circleGraphic);
        this.interactiveDiceContainer.addChild(this.radialGraphic);

        this.interactiveDiceContainer.x = appConfig.width /2;
        this.interactiveDiceContainer.y = appConfig.height/2 + this.ludoBoard.container.height/2 + this.ludoBoard.container.height * 0.3;
        this.interactiveDiceContainer.scale.set(gameConfig.widthRatio);
        this.container.addChild(this.interactiveDiceContainer);
    }

    updateProgress(value)
    {
        this.radialGraphic.arc(0, 0, 140, 0, (Math.PI * 2) * (value), true);
    }

    
    setDiceInteractive(value)
    {
        console.log("Dice Interactive : " + value);
        this.interactiveDiceContainer.alpha = value ? 1 : 0.5;
        this.interactiveDiceContainer.interactive = value;

    }

    

    playDiceAnimation()
    {
        this.animatedDice.renderable  = true;
        Globals.resources.dice.sound.play();
        this.interactiveDiceContainer.interactive = false;
        // this.dices.forEach(dice => {
        //     dice.renderable = false;
        // });

        this.animatedDice.play();
        this.animatedDice.tween.start();

        
    }

    stopDiceAnimation(diceValue)
    {
        this.animatedDice.stop();
        this.animatedDice.tween.stop();
        
        //this.interactiveDiceContainer.interactive = false;
    }

    assignPawns()
    {
        const pawnIds = ["Y", "B", "R", "G"];

        Object.keys(this.players).forEach(key => {
            
            for (let i = 1; i <= 4; i++) {
                this.players[key].pawnsID.push(`${pawnIds[key]}${i}`);
                Globals.pawns[`${pawnIds[key]}${i}`].on("pawnSelected", (pId) => this.players[key].pawnSelected(pId), this);
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


    turnChanged(turnValue)
    {
        Object.keys(this.players).forEach(key => 
        {
            if(key == turnValue)
            {
                this.players[turnValue].assignTurn();
            } else
            {
                this.players[key].removeTurn();
            }
        });

        if(turnValue == Globals.gameData.plId)
        {
            
            this.activateDiceRolling();
        }
        
    }

    activateDiceRolling()
    {
        this.setDiceInteractive(true);

        this.updateProgress(0.01);

        
    }

}