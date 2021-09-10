
import * as PIXI from "pixi.js";
import { appConfig, gameConfig } from "./appConfig";
import { DebugText } from "./DebugText";
import { Globals } from "./Globals";

export class Player
{
    constructor(id, horizontalIndex = 0, verticalIndex = 0, ludoBoard)
    {
        this.playerID = id;
        this.playerDataUpdated = false;
        this.squeezeAnchor = {};
        this.pawnsID = [];
        this.hasTurn = false;
        this.container = new PIXI.Container();
        this.container.x = (horizontalIndex == 0) ? appConfig.leftX : appConfig.rightX;
        if(verticalIndex == 0)
            this.container.y = (appConfig.height/2) + (ludoBoard.container.height/2 + ludoBoard.container.height * 0.065);
        else
            this.container.y = (appConfig.height/2) - (ludoBoard.container.height/2 + ludoBoard.container.height * 0.06);

        this.container.scale.set(gameConfig.widthRatio);
        
        this.playerSide = horizontalIndex;
        this.playerVerticalSide = verticalIndex;

        this.createAvatar();
        this.createDice();
        //this.setDice(5);
        //this.playDiceAnimation();
    }
    
    setStartIndex(index)
    {
        this.startIndex = index;
    }

    createAvatar()
    {
        this.avatar = new PIXI.Sprite(Globals.resources.avatar.texture);
        console.log("Texture url : " + Globals.gameData.players[this.playerID].pImage);
        
        
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
            this.avatar.x -= 40;
            this.playerName.x -= 60;
        } else
        {
            this.avatar.anchor.set(0, 0.5);
            this.avatarImage.anchor.set(0, 0.5);
            this.playerName.anchor.set(0, 0.5);
            this.avatar.x += 40;
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

        const graphics = new PIXI.Graphics();
        graphics.beginFill(0xFF3300);
        graphics.drawRect(this.avatar.x + (this.avatar.width * 0.1), this.avatar.y - (this.avatar.height*0.9)/2, this.avatar.width*0.8, this.avatar.height*0.8);
        graphics.endFill();
        
        this.avatarImage.mask = graphics;
        this.container.addChild(this.avatar);
        this.container.addChild(this.avatarImage);
        console.log(this.avatarImage);
        this.container.addChild(graphics);

        this.container.addChild(this.playerName);


        

        
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

        this.container.addChild(this.diceBG);
        this.container.addChild(this.diceContainer);
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

    
    ActivatePointerChoose()
    {
        const gridPoint = Globals.pawns[this.pawnsID[0]].currentPointIndex;
        const pawnAtSamePlace = this.pawnsID.filter(id => Globals.pawns[id].currentPointIndex == gridPoint);

        if(pawnAtSamePlace.length == this.pawnsID.length)
        {
            this.pawnSelected(this.pawnsID[0]);
        } else
        {
            this.pawnsID.forEach((id) => {
                Globals.pawns[id].setInteractive();
            });
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
}