import TWEEN from "@tweenjs/tween.js";
import * as PIXI from "pixi.js";
import { appConfig, gameConfig } from "./appConfig";
import { Globals } from "./Globals";

export class Player
{
    constructor(horizontalIndex = 0, verticalIndex = 0, ludoBoard)
    {
        this.container = new PIXI.Container();
        this.container.x = (horizontalIndex == 0) ? 0 : appConfig.width;
        if(verticalIndex == 0)
            this.container.y = (appConfig.height/2) + (ludoBoard.container.height/2 + 25 );
        else
            this.container.y = (appConfig.height/2) - (ludoBoard.container.height/2 + 20 );

        this.container.scale.set(gameConfig.currentResolutionRatio);
        
        this.playerSide = horizontalIndex;

        this.createAvatar();
        this.createDice();
        this.setDice(5);
        //this.playDiceAnimation();
    }

    createAvatar()
    {
        this.avatar = new PIXI.Sprite(Globals.resources.avatar.texture);
        
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
        this.diceContainer.interactive = true;
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