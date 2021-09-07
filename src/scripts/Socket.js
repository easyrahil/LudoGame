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
                gid : "230869",
                tableTypeID : "2",
                entryFee : "6",
                pName : "Guest1",
                pImage : "https://cdn.freelogovectors.net/wp-content/uploads/2015/06/Cool-Male-Avatars-07.png"
            }

            this.sendMessage(distmsg);
        };

        this.socket.onmessage = e => {
            let type;

            console.log("Message Recieved : "  + e.data);

            const msg = JSON.parse(e.data);
            if(msg.t == "joined")
            {
                Globals.gameData.plId = msg.data;
                Globals.gameData.players[msg.data] = {
                    balance : msg.bal
                };

                Object.keys(msg.snap).forEach(key => {
                    const data = msg.snap[key];
                    if(!(data.plId in Globals.gameData.players))
                    {
                        Globals.gameData.players[data.plId] = data;
                    } else
                    {
                        const mergeData = {...Globals.gameData.players[data.plId], ...data};
                        Globals.gameData.players[data.plId] = mergeData;
                    }
                });
                
                Globals.emitter.emit("gameStart");

                //Call GameStart and Update Board with Players

            } else if (msg.t == "pAdd")
            {
                Globals.gameData.players[msg.data.plId] = msg.data;


                Object.keys(msg.snap).forEach(key => {
                    const data = msg.snap[key];
                    if(!(data.plId in Globals.gameData.players))
                    {
                        Globals.gameData.players[data.plId] = data;
                    } else
                    {
                        const mergeData = {...Globals.gameData.players[data.plId], ...data};
                        Globals.gameData.players[data.plId] = mergeData;
                    }
                });

                Globals.emitter.emit("gameStart");
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