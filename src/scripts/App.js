import * as PIXI from "pixi.js";
import TWEEN from "@tweenjs/tween.js";
import { Loader } from "./Loader";
import { MainScene } from "./MainScene";
import { Globals } from "./Globals";
import { SceneManager } from "./SceneManager";
import { appConfig } from "./appConfig";
import { GameScene } from "./GameScene";

export class App {
    run() {
        // create canvas
        this.app = new PIXI.Application(appConfig);
        document.body.appendChild(this.app.view);

        

        Globals.scene = new SceneManager();
        this.app.stage.addChild(Globals.scene.container);
        this.app.ticker.add(dt => Globals.scene.update(dt));

        // load sprites
        this.loader = new Loader(this.app.loader);
        this.loader.preload().then(() => {
            Globals.scene.start(new GameScene());
        });
    }
}