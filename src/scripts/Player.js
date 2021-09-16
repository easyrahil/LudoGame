
import * as PIXI from "pixi.js";
import { appConfig, gameConfig } from "./appConfig";
import { Automation } from "./Automation";
import { DebugText } from "./DebugText";
import { Globals } from "./Globals";

export class Player
{
    constructor(id, horizontalIndex = 0, verticalIndex = 0, ludoBoard, hasAutomation)
    {
        this.playerID = id;
        this.playerDataUpdated = false;
        this.squeezeAnchor = {};
        this.pawnsID = [];
        this.activePawnsId = [];
        this.hasTurn = false;
        this.container = new PIXI.Container();

        let ludoBoardPos = new PIXI.Point();
        //ludoBoard.getGlo

        this.container.x = (horizontalIndex == 0) ? appConfig.leftX + appConfig.innerWidth * 0.22: appConfig.rightX - appConfig.innerWidth * 0.22;
        if(verticalIndex == 0)
            this.container.y = (appConfig.height/2) + (ludoBoard.container.height/3);
        else
            this.container.y = (appConfig.height/2) - (ludoBoard.container.height/3);

        this.container.scale.set(gameConfig.widthRatio);
        
        this.playerSide = horizontalIndex;
        this.playerVerticalSide = verticalIndex;

        this.createHeartBlock();
        this.createAvatar();
        this.createDice();
        this.createScore();

        this.hasAutomation = hasAutomation;
        if(this.hasAutomation)
            this.createAutomation();
        
        
        //this.setDice(5);
        //this.playDiceAnimation();
    }
    
    setStartIndex(index)
    {
        this.startIndex = index;
    }

    createHeartBlock()
    {
        const heartBlock = new PIXI.Sprite(Globals.resources.heartBlock.texture);

       // this.container.addChild(heartBlock);
    }

    createAvatar()
    {
        this.avatar = new PIXI.Sprite(Globals.resources.avatar.texture);
        
        this.avatarImage = PIXI.Sprite.from(Globals.gameData.players[this.playerID].pImage);
       //this.avatarImage.renderable = false;

        this.playerName = new PIXI.Text(Globals.gameData.players[this.playerID].pName);
        this.playerName.zIndex = 1;
        this.playerName.anchor.set(0.5);
        this.playerName.style = {
            fontFamily: "Verdana",
            fontWeight: "bold",
            fontSize: 44,
            fill: ["#000"]
        };

        if(this.playerSide == 1)
        {
            this.avatar.anchor.set(1, 0.5);
            this.avatarImage.anchor.set(1, 0.5);
            this.playerName.anchor.set(1, 0.5);
            this.avatarImage.x -= 40;
            this.avatar.x -= 80;
            this.playerName.x -= 60;
        } else
        {
            this.avatar.anchor.set(0, 0.5);
            this.avatarImage.anchor.set(0, 0.5);
            this.playerName.anchor.set(0, 0.5);
            this.avatar.x += 80;
            this.avatarImage.x += 40;
            this.playerName.x += 60;
        }

        if(this.playerVerticalSide == 1)
        {
            this.playerName.anchor.y = 0;
            this.playerName.y += 115;
        } else
        {
            this.playerName.anchor.y = 1;
            this.playerName.y -= 120;
        }

        this.avatar.anchor.set(0.5);
        this.avatar.x = 0;
        this.avatar.y = 0;

        // const graphics = new PIXI.Graphics();
        // graphics.beginFill(0xFF3300);
        // graphics.drawRect(this.avatar.x + (this.avatar.width * 0.1), this.avatar.y - (this.avatar.height*0.9)/2, this.avatar.width*0.8, this.avatar.height*0.8);
        // graphics.endFill();
        
        //this.avatarImage.mask = graphics;
        
        this.container.addChild(this.avatar);
        //this.container.addChild(this.avatarImage);
        
        //this.container.addChild(graphics);

        //this.container.addChild(this.playerName);

        
        

        
    }

    createScore()
    {
        this.scoreText = new PIXI.Container();
        this.scoreText.textElement = new DebugText("0", 0, 0, "#000", 100);
        

        const score = new DebugText("SCORE", 0, this.scoreText.textElement.textBound.height/2, "#000", 40);
        this.scoreText.addChild(score);
        this.scoreText.addChild(this.scoreText.textElement);
        //this.container.addChild(this.scoreText);
    }

    updateScore(score)
    {
        this.scoreText.textElement.text = score;
    }

    resetPawns()
    {
        console.log(this.pawnsID);
        
        this.pawnsID.forEach(element => {
            Globals.pawns[element].setPointIndex(this.startIndex);
            Globals.pawns[element].reachedFinalPosition();
           // Globals.pawns[element].setSqueezeAnchor(this.squeezeAnchor);
        });
    }

    createDice()
    {
        this.diceBG = new PIXI.Sprite(Globals.resources.diceBG.texture);
        if(this.playerSide == 1)
        {
            this.diceBG.anchor.set(1, 0.5);
            this.diceBG.x -= 300;
        } else
        {
            this.diceBG.anchor.set(0, 0.5);
            this.diceBG.x += 300;
        }

        this.diceContainer = new PIXI.Container();
        this.diceContainer.sortableChildren = true;
        this.diceContainer.position = new PIXI.Point(this.diceBG.x + (this.diceBG.width * 0.1 * (this.playerSide ? -1 : 1) ), this.diceBG.y);
        this.diceContainer.alpha = 0.3;

        this.dices = []

        for (let i = 1; i <= 6; i++) {
            const dice = new PIXI.Sprite(Globals.resources[`dice${i}`].texture);
             
            dice.anchor.set((this.playerSide == 1) ? 1 : 0, 0.5);
            dice.width = this.diceBG.width * 0.8;
            dice.height = this.diceBG.height * 0.8;
            if(i != 6)
                dice.renderable = false;
            this.dices.push(dice);
            this.diceContainer.addChild(dice);
        }

        //this.container.addChild(this.diceBG);
        //this.container.addChild(this.diceContainer);
    }

    setDice(index)
    {
        index--;
        this.dices.forEach(dice => {

            if(this.dices.indexOf(dice) == index)
            {
                dice.zIndex = 1;
                dice.renderable = true;
            } else
            {
                dice.zIndex = 0;
                dice.renderable = false;
            }
        });
    }

    assignTurn()
    {
        this.diceContainer.alpha = 1;
        this.hasTurn = true;
    }

    removeTurn()
    {
        this.diceContainer.alpha = 0.2;
        this.hasTurn = false;
    }

    
    ActivatePointerChoose(pawnsArr)
    {
        this.activePawnsId = [];
        

        const gridPoint = Globals.pawns[this.pawnsID[0]].currentPointIndex;
        const pawnAtSamePlace = this.pawnsID.filter(id => Globals.pawns[id].currentPointIndex == gridPoint);

        if(pawnAtSamePlace.length == this.pawnsID.length || pawnsArr.length == 1)
        {
            this.pawnSelected(pawnsArr[0]);
        } else
        {
            pawnsArr.forEach((id) => {
                Globals.pawns[id].setInteractive();
                this.activePawnsId.push(id);
            });

            // this.pawnsID.forEach((id) => {
            //     Globals.pawns[id].setInteractive();
            // });

            if(this.hasAutomation)
            {
                this.automation.selectPawn();
            }
        }

        

        
    }

    DeactivatePointerChoose()
    {
        this.pawnsID.forEach((id) => {
            Globals.pawns[id].removeInteractive();
        });
    }
    
    pawnSelected(id)
    {
        this.pawnsID.forEach((id) => {
            Globals.pawns[id].removeInteractive();
        });
        const distmsg = {
            t: "pTokenSelect",
            token : id
        }
        Globals.socket.sendMessage(distmsg);
    }

    createAutomation()
    {
        this.automation = new Automation(this);
    }
}