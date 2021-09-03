import * as PIXI from "pixi.js";

export class DebugText extends PIXI.Text {
    constructor(text, x = 10, y = 10, color = "#000") {
        super();
        this.x = x;
        this.y = y;
        this.zIndex = 1;
        this.anchor.set(0.5);
        this.style = {
            fontFamily: "Verdana",
            fontWeight: "bold",
            fontSize: 20,
            fill: [color]
        };
        this.text = text;
    }


}