import * as PIXI from "pixi.js";
import { appConfig, gameConfig } from "./appConfig";
import { Globals } from "./Globals";

export class Background {
	constructor(topImage, backImage = null, width = window.innerWidth, height = window.innerHeight) {
		this.container = new PIXI.Container();

		//this.container.scale.set(gameConfig.currentResolutionRatio);


		this.createSprite(topImage, width, height);
		if (backImage)
			this.createSprite(backImage, width, height);


	}


	createSprite(image, width, height) {
		const sprite = new PIXI.Sprite(image);
		sprite.width = width;
		sprite.height = height;
		this.container.addChild(sprite);
	}



}