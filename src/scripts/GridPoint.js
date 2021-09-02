import * as PIXI from "pixi.js";
import { DebugText } from "./DebugText";
import { Globals } from "./Globals";

export class GridPoint extends PIXI.DisplayObject
{
    constructor(id, x, y)
    {
        super();
        this.x = x;
        this.y = y;
        this.pointID = id;

        this.renderable = false;
        this.logPosition();

        Globals.gridPoints[this.pointID] = this;
    }

    render()
    {
        
    }

    get globalPosition()
    {
        let point = new PIXI.Point();
        this.getGlobalPosition(point);
        return point;
    }

    logPosition()
    {
        
        this.debugText = new DebugText(this.pointID, this.x, this.y);
    }
}