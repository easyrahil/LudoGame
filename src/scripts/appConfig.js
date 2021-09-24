export const appConfig = {
    innerHeight: window.innerHeight,
    innerWidth : window.innerHeight * 0.5625,
    width : 0,
    height : 0,
    get leftX (){
        return this.width/2 - this.innerWidth/2;
    },
    get rightX (){
        return this.width/2 + this.innerWidth/2;
    }
};

export const gameConfig = {
    maxWidth : 1024,
    maxHeight : 1920,
    currentResolutionRatio : appConfig.height/1920,
    get heightRatio() {
        return appConfig.innerHeight / 1920;
    },
    get widthRatio() {
        return appConfig.innerWidth / 1080;
    },
};

