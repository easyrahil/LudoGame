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
        this.pawnsOnIt = [];
        this.renderable = false;
        this.logPosition();

        Globals.gridPoints[this.pointID] = this;

        this.gridAnchorPoints = [
            {x : 1, y : 1},
            {x : 0, y : 1},
            {x : 0, y : 0.1},
            {x : 1, y : 0.1}
        ];
    }

    render()
    {
        
    }

    reached(pawn)
    {
        if(this.pawnsOnIt.indexOf(pawn) == -1)
        {
            this.pawnsOnIt.push(pawn);

            if(this.pawnsOnIt.length > 1)
            {   
                this.pawnsOnIt.forEach(item => {
                    item.squeeze(this.gridAnchorPoints[this.pawnsOnIt.indexOf(item)]);
                });
                
            }
        } else
        {
            console.error("Pawn is already in list.");
        }

        
    }

    left(pawn)
    {
        if(this.pawnsOnIt.indexOf(pawn) != -1)
        {
            this.pawnsOnIt = this.pawnsOnIt.filter(item => item !== pawn);
            pawn.reset();
        }
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