import * as PIXI from "pixi.js";
import { DebugText } from "./DebugText";

export class Point extends PIXI.DisplayObject
{
    constructor(id, x, y)
    {
        super();
        this.renderable = true;
        this.x = x;
        this.y = y;
        this.pointID = id;

        if(this.renderable)
            this.logPosition();
    }

    logPosition()
    {
        const debugText = new DebugText(this.pointID, this.x, this.y);
    }
}