import "pixi-sound";

import { App } from "./App";
import { Globals } from "./Globals";
import { Socket } from "./Socket";




const app = new App();
app.run();
app.addOrientationCheck();


Globals.socket = new Socket();



