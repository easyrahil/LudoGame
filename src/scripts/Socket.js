import { Globals } from "./Globals";

export class Socket
{
    constructor()
    {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const servAddress = urlParams.get('debug');

        this.socket = new WebSocket("ws://2407-2405-201-5006-10c7-c9ca-3b5-d321-d04f.ngrok.io");

        this.socket.onopen = e => {
            console.log("Connection with socket made");

            const distmsg = {
                t : "connect",
                gid : 230869,
                tableTypeID : 2,
                entryFee : 80
            }

            this.sendMessage(distmsg);
        };

        this.socket.onmessage = e => {
            let type;

            const msg = JSON.parse(e.data);

            if(msg.t == "joined")
            {
                Globals.gameData.plId = msg.data.plId;
                Globals.gameData.players[msg.data.plId] = {
                    balance : msg.bal
                };

                Globals.gameData.snap = msg.snap;
                
                Globals.emitter.emit("gameStart");

                //Call GameStart and Update Board with Players

            } else if (msg.t == "pAdd")
            {
                Globals.gameData.players[msg.data.plId] = msg.data;
                //Update Board with Players

            } else if (msg.t == "pLeft")
            {
                delete Globals.gameData.players[msg.data.plId];

                //Update Board with Player Left if game is running
            } else if (msg.t == "RollDiceResult")
            {   
                //stop dice rolling animation

                //
            } else if (msg.t == "moveToken")
            {
                
            } else if (msg.t == "turnSkipped")
            {

            } else if (msg.t == "turnTimer")
            {

            } else if (msg.t = "timer")
            {

            }
        };

        this.socket.onclose = e => {
            if(e.wasClean)
            {
                console.log(`[close] Connection closed cleanly, code=${e.code} reason=${e.reason}`);
            } else
            {
                console.log(`[close] Connection Died`);
            }
        };

        this.socket.onerror = e => {
            console.log(`[error] ${e.message}`);
        };
    }


    sendMessage(msg)
    {
        console.log("Message Sent : " + JSON.stringify(msg));
        this.socket.send(JSON.stringify(msg));
    }
}