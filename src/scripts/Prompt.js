import * as PIXI from "pixi.js";
import { Globals } from "./Globals";


export class Prompt
{
    constructor()
    {
        this.container = new PIXI.Container();
        

        this.createBackground();
        this.createForegroundText();
    }


    createBackground()
    {
        this.background = new PIXI.Sprite(Globals.resources.promptBG.texture);
        this.background.anchor.set(0, 0.5);
    }

    createForegroundText(text)
    {
        this.text = new PIXI.Text(text,{

        });

        this.text.style = {
            fontFamily: "Verdana",
            fontWeight: "bold",
            fontSize: size,
            fill: [color]
        };
        this.text = text;
    }
}