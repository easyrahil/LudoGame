import * as PIXI from "pixi.js";
import { appConfig, gameConfig } from "./appConfig";
import { Background } from "./Background";
import { GameScene } from "./GameScene";
import { Globals } from "./Globals";
import TWEEN from "@tweenjs/tween.js";
import { MatchmakingScene } from "./MatchmakingScene";

export class MainScene {
    constructor() {
        this.container = new PIXI.Container();
        // Globals.resources.music.sound.play({
        //     loop: true,
        //     volume: 0.2
        // });
      

        this.createBackground();
        this.createLogo();
        this.createPlayBtn();
        
    }

    createBackground()
    {
        this.background = new Background(Globals.resources.background.texture, Globals.resources.background.texture);
        this.container.addChild(this.background.container);
    }

    createLogo()
    {
        this.logo = new PIXI.Sprite(Globals.resources.logo.texture);
        //this.logo.scale.set(gameConfig.currentResolutionRatio);
        this.logo.anchor.set(0.5);
        this.logo.x = appConfig.width/2;
        this.logo.y = appConfig.height/2;

        this.logo.interactive = true;
        this.logo.on("pointerdown", () => {
            Globals.resources.click.sound.play();
            Globals.scene.start(new MatchmakingScene());
        }, this);

        this.logo.on("pointerover", () => {
            const tween = new TWEEN.Tween(this.logo)
                                    .to({scale : {x : gameConfig.currentResolutionRatio * 1.2, y : gameConfig.currentResolutionRatio * 1.2} }, 300)
                                    .start();
        }, this);

        this.logo.on("pointerout", () => {
            const tween = new TWEEN.Tween(this.logo)
                                    .to({scale : {x : gameConfig.currentResolutionRatio, y : gameConfig.currentResolutionRatio} }, 100)
                                    .start();
        }, this);

        this.container.addChild(this.logo);
    }

    createPlayBtn()
    {

    }

    update(dt) {
        
    }
}