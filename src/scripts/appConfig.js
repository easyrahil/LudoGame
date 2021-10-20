export const appConfig = {
	innerHeight: window.innerHeight,
	innerWidth: window.innerHeight * 0.5625,
	width: 0,
	height: 0,
	get leftX() {
		return this.width / 2 - this.innerWidth / 2;
	},
	get rightX() {
		return this.width / 2 + this.innerWidth / 2;
	}
};

export const gameConfig = {
	maxWidth: 1024,
	maxHeight: 1920,
	currentResolutionRatio: appConfig.height / 1920,
	get heightRatio() {
		return appConfig.innerHeight / 1920;
	},
	get widthRatio() {
		return appConfig.innerWidth / 1080;
	},
};

export const config = {
	logicalWidth: 720,
	logicalHeight: 1280,
	scaleFactor: 1,
	get topX()
	{
		return (window.innerHeight - (this.logicalHeight * this.scaleFactor))/2;
	},
	get bottomX()
	{
		return window.innerHeight - this.topX;
	},
	get leftX()
	{
		return (window.innerWidth - (this.logicalWidth * this.scaleFactor))/2;
	},
	get rightX()
	{
		return window.innerWidth - this.leftX;
	}
}