import { LoaderConfig } from "./LoaderConfig";
import { Globals } from "./Globals";
import { GLProgram } from "pixi.js";

export class Loader {
    constructor(loader) {
        this.loader = loader;
        this.resources = LoaderConfig;
    }

    preload() {
        return new Promise(resolve => {
            for (let key in this.resources) {
                this.loader.add(key, this.resources[key]);
            }
    
            this.loader.load((loader, resources) => {
                Globals.resources = resources;
                console.log(Globals);
                resolve();
            });
        });
    }
}