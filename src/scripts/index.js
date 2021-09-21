

import { App } from "./App";
import { Globals } from "./Globals";
import { Socket } from "./Socket";
import {Loader} from "pixi.js";
import {Spine, SpineParser } from "pixi-spine";



//SpineParser.registerLoaderPlugin();

const app = new App();
app.run();
app.addOrientationCheck();


//Globals.socket = new Socket();



