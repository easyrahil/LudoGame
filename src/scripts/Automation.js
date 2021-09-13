import { Globals } from "./Globals";


export class Automation
{
    constructor(playerRef)
    {
        this.player = playerRef;
    }

    RollDice(gameSceneRef)
    {
        if(gameSceneRef.players[Globals.gameData.plId].hasAutomation)
		{
			const distmsg = {
				t: "pDiceRoll"
			}
			Globals.socket.sendMessage(distmsg);
            Globals.soundResources.click.play();
			
			//Send Message to server
			gameSceneRef.playDiceAnimation();
		}
    }

    selectPawn()
    {
        this.player.pawnSelected(this.player.pawnsID[Math.ceil(Math.random() * this.player.pawnsID.length) - 1]);
    }




}