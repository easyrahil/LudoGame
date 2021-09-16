import * as PIXI from "pixi.js";

export class DebugCircle extends PIXI.Graphics
{
    constructor(x, y, radius = 5)
    {
        super();


        this.lineStyle(0); 
        this.beginFill(0xDE3249, 1);
        this.drawCircle(x, y, radius);
        this.endFill();
    }
}