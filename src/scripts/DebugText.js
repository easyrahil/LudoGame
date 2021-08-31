import * as PIXI from "pixi.js";

export class DebugText extends PIXI.Text {
    constructor(text, x = 10, y = 10) {
        super();
        this.x = x;
        this.y = y;
        this.zIndex = 1;
        this.anchor.set(0.5);
        this.style = {
            fontFamily: "Verdana",
            fontWeight: "bold",
            fontSize: 20,
            fill: ["#000"]
        };
        this.text = text;
    }


}