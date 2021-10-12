

import { App } from "./App";
import { Globals } from "./Globals";
import { Socket } from "./Socket";
import {Loader} from "pixi.js";
import {Spine, SpineParser } from "pixi-spine";



//SpineParser.registerLoaderPlugin();

const app = new App();
app.run();
app.addOrientationCheck();


global.updateFromNative = function updateFromNative(message)
{
    const jsonData = JSON.parse(message);

    Globals.socket = new Socket(jsonData.token.playerID, jsonData.username, jsonData.token.tableTypeID, jsonData.useravatar);

    Globals.emitter.Call("socketConnection", {});
}

//Globals.socket = new Socket();



