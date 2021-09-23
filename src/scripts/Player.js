
import * as PIXI from "pixi.js";
import { appConfig, gameConfig } from "./appConfig";
import { Automation } from "./Automation";
import { DebugCircle } from "./DebugCircle";
import { DebugText } from "./DebugText";
import { Globals } from "./Globals";

export class Player
{
    constructor(id, horizontalIndex = 0, verticalIndex = 0, ludoBoard, hasAutomation = false)
    {
        this.playerID = id;
        this.playerDataUpdated = false;
        this.squeezeAnchor = {};
        this.pawnsID = [];
        this.activePawnsId = [];
        this.hasTurn = false;
        this.container = new PIXI.Container();

       

        this.container.x = (horizontalIndex == 0) ? appConfig.leftX: appConfig.width/2 + ludoBoard.container.width * 0.07;
        if(verticalIndex == 0)
            this.container.y = (appConfig.height/2) + (ludoBoard.container.height * 0.347);
        else
            this.container.y = (appConfig.height/2) - (ludoBoard.container.height * 0.248);

        this.container.scale.set(gameConfig.widthRatio);
        
        this.container.sortableChildren = true;

        this.playerSide = horizontalIndex;
        this.playerVerticalSide = verticalIndex;

        this.createHeartBlock();
        this.createAvatar();
        this.createDice();
        this.createScore();
        

        this.hasAutomation = hasAutomation;

        if(this.hasAutomation)
            this.createAutomation();
        
        

        this.currentHealth = 3;
        

    }
    
    setStartIndex(index)
    {
        this.startIndex = index;
    }

    createHeartBlock()
    {
        const heartBlock = new PIXI.Sprite(Globals.resources.heartBlock.texture);
            
        //heartBlock.anchor.set(0, 0);
        heartBlock.x += 180;
        heartBlock.y -= 20;

        this.heartList = new PIXI.Container();
        this.heartList.filledHeart = [];
        this.heartList.unfilledHeart = [];

        for (let i = -1; i <= 1; i++) {
            const heartFilled = new PIXI.Sprite(Globals.resources.heartFilled.texture);
            heartFilled.anchor.set(0.5);
            heartFilled.x = i * (heartFilled.width + heartFilled.width * 0.1) + heartFilled.width * 0.2;

            const heartUnfilled = new PIXI.Sprite(Globals.resources.heartUnfilled.texture);
            heartUnfilled.anchor.set(0.5);
            heartUnfilled.x = i * (heartUnfilled.width + heartUnfilled.width * 0.1) + heartUnfilled.width * 0.2;

            this.heartList.filledHeart.push(heartFilled);
            this.heartList.unfilledHeart.push(heartUnfilled);
            
            this.heartList.addChild(heartUnfilled);
            this.heartList.addChild(heartFilled);
            
        }

        
        this.heartList.x = heartBlock.x + heartBlock.width/2 ;
        this.heartList.y = heartBlock.y + heartBlock.height/2;


        this.infoButton = new PIXI.Sprite(Globals.resources["info"+this.playerID].texture);
        this.infoButton.interactive = true;

        this.infoButton.on("pointerdown", () => {
           this.activateHeartSkipBlock();
        }, this);
        this.infoButton.zIndex = 1;

        this.infoButton.anchor.set(0.5);
        
        this.infoButton.x = heartBlock.x + heartBlock.width;
        this.infoButton.y = heartBlock.y;

   
        this.container.addChild(heartBlock);
        this.container.addChild(this.heartList);
        this.container.addChild(this.infoButton);
    }



    updateHearts(noOfHearts)
    {
        //console.log(this.heartList.filledHeart.length);

        if(noOfHearts == 3)
        {
            this.heartList.filledHeart.forEach(heart => {
                heart.renderable = true;
            });
        } else
        {
            for (let i = 2; i >= noOfHearts; i--) {
           
            
                this.heartList.filledHeart[i].renderable = false
            
            }
        }
    }

    assignHeartSkipBlock(heartElement)
    {
        this.heartSkipBlock = heartElement;
    }



    deactivateHeartSkipBlock()
    {
        this.heartSkipBlock.renderable = false;
    }

    activateHeartSkipBlock()
    {
        this.heartSkipBlock.renderable = true;
    }
    

    createAvatar()
    {
        this.avatar = new PIXI.Sprite(Globals.resources.avatar.texture);
        
        this.avatarImage = PIXI.Sprite.from(Globals.gameData.players[this.playerID].pImage);
       //this.avatarImage.renderable = false;

        this.playerBlock = new PIXI.Sprite(Globals.resources["border"+this.playerID].texture);
        this.playerBlock.scale.set(0.98);
        
        this.playerBlock.y +=  80;

        this.playerName = new PIXI.Text(Globals.gameData.players[this.playerID].pName);
        this.playerName.zIndex = 1;
        this.playerName.anchor.set(0.5);
        this.playerName.style = {
            fontFamily: Globals.resources.luckiestGuyFont.name,
            fontWeight: "bold",
            stroke : "black",
            strokeThickness : 4,
            fontSize: 38,
            fill: ["#fff"]
        };

        this.avatar.anchor.set(0, 0.5);
        this.avatarImage.anchor.set(0, 0.5);
        const avatarRatio = (this.avatarImage.height/this.avatarImage.width);
        this.avatarImage.width = this.avatar.width;
        this.avatarImage.height = this.avatar.width *  avatarRatio;

        
        this.avatar.x += 60;
        this.avatarImage.x = this.avatar.x;

        this.playerName.y = this.playerBlock.y + this.playerBlock.height/2;
        this.playerName.x += 220;
        if(this.playerSide == 1)
        {
            this.playerBlock.x += 40;
            //this.playerName.anchor.y = 0;
            //this.playerName.y += 115;
        } else
        {
            this.playerBlock.x += 43;
            //this.playerName.anchor.y = 1;
            //this.playerName.y -= 120;
        }

        //this.avatar.anchor.set(0.5);
        //this.avatar.x = 0;
        this.avatar.y = 0;

         const maskGraphic = new PIXI.Graphics();
         maskGraphic.beginFill(0xFF3300);

         const widthPadding = (this.avatar.width * 0.07);
         const heightPadding = (this.avatar.height * 0.07);


         maskGraphic.drawRect((this.avatar.x) + widthPadding, (this.avatar.y - (this.avatar.height)/2) + heightPadding, this.avatar.width - (widthPadding * 2), this.avatar.height - (heightPadding * 2) );
         maskGraphic.endFill();
        
        this.avatarImage.mask = maskGraphic;
        
        this.container.addChild(this.avatar);
        this.container.addChild(this.playerBlock);
        this.container.addChild(this.avatarImage);
        
        this.container.addChild(maskGraphic);

        this.container.addChild(this.playerName);

        
        

        
    }

    createScore()
    {
        this.scoreText = new PIXI.Container();
        this.scoreText.textElement = new DebugText("102", 0, 0, "#fff", 64);
        this.scoreText.textElement.y += this.scoreText.textElement.height/2 + 20;
        
        switch(parseInt(this.playerID))
        {
            case 0:
                this.scoreText.textElement.style.stroke = "#988f40";
                break;
            case 1:
                this.scoreText.textElement.style.stroke = "#2a7092";
                break;
            case 2:
                this.scoreText.textElement.style.stroke = "#973a3b";
                break;
            case 3:
                this.scoreText.textElement.style.stroke = "#307040";
                break;
        }

        this.scoreText.textElement.style.strokeThickness = 10;
        const score = new PIXI.Sprite(Globals.resources.scoreText.texture);
        score.anchor.set(0.5);
        this.scoreText.addChild(score);

        this.scoreText.x += (110 + this.scoreText.width/2);
        this.scoreText.y -= 190;
        
 
      
        this.scoreText.addChild(this.scoreText.textElement);
        this.container.addChild(this.scoreText);
    }

    updateScore(score)
    {
        this.scoreText.textElement.text = score;
    }

    deductHealth()
    {
        this.currentHealth--;

        if(this.currentHealth < 0)
            console.log("KICKED : "+this.playerID);//Kick Him
        else
            this.updateHearts(this.currentHealth);
    }

    resetPawns()
    {
      
        
        this.pawnsID.forEach(element => {
            Globals.pawns[element].setPointIndex(this.startIndex);
            Globals.pawns[element].reachedFinalPosition();
           // Globals.pawns[element].setSqueezeAnchor(this.squeezeAnchor);
        });
    }

    createDice()
    {
        this.diceBG = new PIXI.Sprite(Globals.resources.diceBG.texture);

        this.diceBG.anchor.set(0, 1);
        this.diceBG.x += 240;
        this.diceBG.y -= 50;

               

        this.diceContainer = new PIXI.Container();
        this.diceContainer.sortableChildren = true;
        this.diceContainer.position = new PIXI.Point(this.diceBG.x + this.diceBG.width/2, this.diceBG.y - this.diceBG.height/2);
        this.diceContainer.alpha = 0.3;

        this.dices = []

        for (let i = 1; i <= 6; i++) {
            const dice = new PIXI.Sprite(Globals.resources[`dice${i}`].texture);
             
            dice.anchor.set(0.5);
            dice.width = this.diceBG.width * 0.6;
            dice.height = this.diceBG.height * 0.6;
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