import * as PIXI from 'pixi.js';
import { Globals } from './Globals';

export class MyEmitter extends PIXI.utils.EventEmitter
{
    constructor()
    {
        super();
        console.log("Emitter Created!");

     
    }

    
}