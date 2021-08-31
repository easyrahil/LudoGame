import * as PIXI from "pixi.js";
import { Platform } from "./Platform";

export class Platforms {
    constructor() {
        this.platforms = [];
        this.container = new PIXI.Container();
        this.ranges = {
            rows: {
                min: 2,
                max: 6
            },
            cols: {
                min: 3,
                max: 9
            },
            offset: {
                min: 60,
                max: 200
            }
        };

        this.createPlatform({
            rows: 4,
            cols: 6,
            x: 200
        });
    }

    get randomData() {
        let data = { rows: 0, cols: 0, x: 0 };

        const offset = this.ranges.offset.min + Math.round(Math.random() * (this.ranges.offset.max - this.ranges.offset.min));

        data.x = this.current.right + offset;
        data.cols = this.ranges.cols.min + Math.round(Math.random() * (this.ranges.cols.max - this.ranges.cols.min));
        data.rows = this.ranges.rows.min + Math.round(Math.random() * (this.ranges.rows.max - this.ranges.rows.min));

        return data;
    }

    createPlatform(data) {
        const platform = new Platform(data.rows, data.cols, data.x);
        this.container.addChild(platform.container);
        this.platforms.push(platform);
        this.current = platform;

        platform.container.once("hidden", () => {
            this.platforms = this.platforms.filter(item => item !== platform);
            platform.container.destroy();
        });
    }

    checkCollision(hero) {
        this.platforms.forEach(platform => {
            platform.checkCollision(hero);
        });
    }

    update(dt) {
        if (this.current.right < window.innerWidth) {
            this.createPlatform(this.randomData);
        }

        this.platforms.forEach(platform => {
            platform.move();
        });
    }
}