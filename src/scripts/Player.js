import TWEEN from "@tweenjs/tween.js";
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

        this.container = new PIXI.Container();
        this.container.x = (horizontalIndex == 0) ? appConfig.leftX : appConfig.rightX;
        if(verticalIndex == 0)
            this.container.y = (appConfig.height/2) + (ludoBoard.container.height/2 + ludoBoard.container.height * 0.065);
        else
            this.container.y = (appConfig.height/2) - (ludoBoard.container.height/2 + ludoBoard.container.height * 0.06);

        this.container.scale.set(gameConfig.widthRatio);
        
        this.playerSide = horizontalIndex;

        this.createAvatar();
        this.createDice();
        this.setDice(5);
        //this.playDiceAnimation();
    }
    
    setStartIndex(index)
    {
        this.startIndex = index;
    }

    createAvatar()
    {
        this.avatar = new PIXI.Sprite(Globals.resources.avatar.texture);
       // this.avatarImage = PIXI.Sprite.from(Globals.gameData.players[this.playerID].plImage);

        if(this.playerSide == 1)
        {
            this.avatar.anchor.set(1, 0.5);
            this.avatar.x -= 40;
        } else
        {
            this.avatar.anchor.set(0, 0.5);
            this.avatar.x += 40;
        }

        
        this.container.addChild(this.avatar);

        this.container.addChild(new DebugText(this.playerID, this.container.x, this.container.y, "#000", 44));
    }

    resetPawns()
    {
        this.pawnsID.forEach(element => {
            Globals.pawns[element].setPointIndex(this.startIndex);
            Globals.pawns[element].setSqueezeAnchor(this.squeezeAnchor);
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
        this.diceContainer.alpha = 0.5;

        this.diceContainer.on("pointerdown", () => {
            Globals.resources.click.sound.play();
            this.playDiceAnimation();
        }, this);

        this.dices = []

        for (let i = 1; i <= 6; i++) {
            const dice = new PIXI.Sprite(Globals.resources[`dice${i}`].texture);
             
            dice.anchor.set((this.playerSide == 1) ? 1 : 0, 0.5);
            dice.width = this.diceBG.width * 0.8;
            dice.height = this.diceBG.height * 0.8;
            this.dices.push(dice);
            this.diceContainer.addChild(dice);
        }

        const textureArrayOfAnimation = []

        for (let x = 1; x <= 6; x++) {
            textureArrayOfAnimation.push(Globals.resources[`diceEdge${x}`].texture);
        }

        this.animatedDice = new PIXI.AnimatedSprite(textureArrayOfAnimation);
        
        this.animatedDice.anchor.set(0.5, 0.5);
        this.animatedDice.width = this.diceBG.width * 0.8;
        this.animatedDice.height = this.diceBG.height * 0.8;
        this.animatedDice.x = (this.playerSide == 1) ? -this.animatedDice.width/2 : this.animatedDice.width/2;
        this.animatedDice.loop = true;
        this.animatedDice.animationSpeed = 0.2;

        this.animatedDice.tween = new TWEEN.Tween(this.animatedDice)
                                    .to({angle : 360}, 800)
                                    .onComplete(animatedDice => {
                                        this.setDice(5);
                                        this.diceContainer.interactive = true;
                                    });

        this.diceContainer.addChild(this.animatedDice);
        this.container.addChild(this.diceBG);
        this.container.addChild(this.diceContainer);
    }

    setDiceInteractive(value)
    {
        this.diceContainer.alpha = value ? 1 : 0.5;
        this.diceContainer.interactive = value;

    }

    setDice(index)
    {
        this.dices.forEach(dice => {
            if(!dice.renderable)
                dice.renderable = true;

            if(this.dices.indexOf(dice) == index)
            {
                dice.zIndex = 1;
            } else
            {
                dice.zIndex = 0;
            }
        });
    }

    playDiceAnimation()
    {
        Globals.resources.dice.sound.play();
        this.diceContainer.interactive = false;
        this.dices.forEach(dice => {
            dice.renderable = false;
        });

        this.animatedDice.play();
        this.animatedDice.tween.start();
    }
}