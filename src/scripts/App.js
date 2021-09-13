import * as PIXI from "pixi.js";
import TWEEN from "@tweenjs/tween.js";
import { Loader } from "./Loader";
import { MainScene } from "./MainScene";
import { Globals } from "./Globals";
import { SceneManager } from "./SceneManager";
import { appConfig, gameConfig } from "./appConfig";
import { GameScene } from "./GameScene";
import { MyEmitter } from "./MyEmitter";

export class App {
    run() {
        // create canvas
       // PIXI.settings.RESOLUTION = window.devicePixelRatio;
        //{width : (window.innerWidth > gameConfig.maxWidth) ? gameConfig.maxWidth : window.innerWidth, height : window.innerHeight}
        this.app = new PIXI.Application({width : (window.innerWidth > gameConfig.maxWidth) ? gameConfig.maxWidth : window.innerWidth, height : window.innerHeight});
        document.body.appendChild(this.app.view);
        appConfig.width = this.app.screen.width;
        appConfig.height = this.app.screen.height;
        console.log(appConfig.width);
        console.log(window.innerWidth);
        //this.app.raenderer.resolution = window.devicePixelRatio;

        
        Globals.emitter = new MyEmitter();
        

        Globals.scene = new SceneManager();
        this.app.stage.addChild(Globals.scene.container);
        this.app.ticker.add(dt => Globals.scene.update(dt));

        // load sprites
        const loaderContainer = new PIXI.Container();
        this.app.stage.addChild(loaderContainer);
        this.loader = new Loader(this.app.loader, loaderContainer);
        
        //this.pushSampleData();

        this.loader.preload().then(() => {
            setTimeout(() => {
                loaderContainer.destroy();
                Globals.scene.start(new MainScene());
                //Globals.scene.start(new GameScene());
            }, 1000);
            
            
        });

        this.loader.preloadSounds();
        
    }

    pushSampleData()
    {
        Globals.gameData.plId = 0;
        for (let i = 0; i < 4; i++) {
            
            Globals.gameData.players[i] = {
                balance : "12",
                plId : i,
                pName : "Player " + i,
                pImage : "../src/sprites/68.png"
            };
        }

        

    }

    addOrientationCheck()
    {
        if(PIXI.utils.isMobile)
        {
           // console.log(window.orientation);

            

            window.addEventListener("orientationchange", function() {
                if (window.orientation == 90 || window.orientation == -90) {
                    Globals.scene.drawImageAbove();
                } else {
                    Globals.scene.removeImageAbove();
                }
                });
        }
    }

}