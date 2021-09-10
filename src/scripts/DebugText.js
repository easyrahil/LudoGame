import * as PIXI from "pixi.js";

export class DebugText extends PIXI.Text {
    constructor(text, x = 10, y = 10, color = "#000", size = 20) {
        super();
        this.x = x;
        this.y = y;
        this.zIndex = 1;
        this.anchor.set(0.5);
        this.style = {
            fontFamily: "Verdana",
            fontWeight: "bold",
            fontSize: size,
            fill: [color]
        };
        this.text = text;
    }

    get textBound()
    {
        const bounds = new PIXI.Rectangle();

        this.getBounds(false, bounds);

        return bounds;
    }


}