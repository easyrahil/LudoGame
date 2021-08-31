import * as PIXI from "pixi.js";
import { Globals } from "./Globals";
import { Background } from "./Background";
import { Platforms } from "./Platforms";
import { Hero } from "./Hero";
import { LabelScore } from "./LabelScore";
import { FinalScene } from "./FinalScene";

export class MainScene {
    constructor() {
        this.container = new PIXI.Container();
        // Globals.resources.music.sound.play({
        //     loop: true,
        //     volume: 0.2
        // });
        this.createBackground();
        this.createPlatforms();
        this.createHero();
        this.createUI();
    }

    createUI() {
        this.labelScore = new LabelScore();
        this.container.addChild(this.labelScore);
        this.hero.sprite.on("score", () => {
            this.labelScore.renderScore(this.hero.score);
        });
    }

    createBackground() {
        this.bg = new Background();
        this.container.addChild(this.bg.container);
    }

    createPlatforms() {
        this.platfroms = new Platforms();
        this.container.addChild(this.platfroms.container);
    }


    createHero() {
        this.hero = new Hero();
        this.container.addChild(this.hero.sprite);
        this.container.interactive = true;
        this.container.on("pointerdown", () => {
            this.hero.startJump();
        });
        this.hero.sprite.once("die", () => {
            Globals.scene.start(new FinalScene(this.hero.score));
        });
    }

    update(dt) {
        this.bg.update(dt);
        this.platfroms.checkCollision(this.hero);
        this.platfroms.update(dt);
        this.hero.update(dt);
    }
}