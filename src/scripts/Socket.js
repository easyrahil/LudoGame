import { Globals } from "./Globals";

export class Socket
{
    constructor(uuid, name)
    {
       
        console.log("Socket Created");
        
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const servAddress = urlParams.get('debug');

        this.socket = new WebSocket("ws://6fee-2405-201-5006-10c7-805f-b7de-e670-8a93.ngrok.io");
      // this.socket = new WebSocket("ws://209.250.232.65:4400");
    
        
        this.socket.onopen = e => {
            console.log("Connection with socket made");

            const distmsg = {
                t : "connect",
                gid : uuid,
                tableTypeID : "2",
                entryFee : "6",
                pName : name,
                //pImage : "../src/sprites/68.png"
                pImage : "https://cccdn.b-cdn.net/1584464368856.png"
            }

            this.sendMessage(distmsg);
        };

        this.socket.onmessage = e => {
            let type;

            console.log("Message Recieved : "  + e.data);

            const msg = JSON.parse(e.data);
            if(msg.t == "joined")
            {

                Globals.gameData.tempPlayerData = [];
                Globals.gameData.bal = msg.bal;

               
                Object.keys(msg.snap).forEach(key => {
                    const data = msg.snap[key];

                    Globals.gameData.tempPlayerData.push(data);



                    // if(!(data.plId in Globals.gameData.players))
                    // {
                    //     Globals.gameData.players[data.plId] = data;
                    // } else
                    // {
                    //     const mergeData = {...Globals.gameData.players[data.plId], ...data};
                    //     Globals.gameData.players[data.plId] = mergeData;
                    // }
                });

                Globals.emitter.Call("joined", {});

            } else if (msg.t == "pAdd")
            {
                const plData = {
                    pName : msg.pName,
                    pImage : msg.pImage
                };

                Globals.gameData.tempPlayerData.push(plData);


                // Globals.gameData.players[msg.plId] = {
                //     balance : msg.bal,
                //     plId : msg.plId,
                //     pName : msg.pName,
                //     pImage : msg.pImage
                // };

                Globals.emitter.Call("playerJoined", {index : Globals.gameData.tempPlayerData.indexOf(plData)});

            } else if(msg.t == "gameStart")
            {
                Globals.gameData.plId = msg.plId;
                Globals.gameData.players = {};

                msg.snap.forEach(plData => {
                    Globals.gameData.players[plData.plId] = plData;
                });


                Globals.emitter.Call("gameStart", {turn : msg.turn});
            } 
            else if (msg.t == "pLeft")
            {

                Globals.emitter.Call("playerLeft", {id : msg.data});

                
                
                //Update Board with Player Left if game is running
            } else if (msg.t == "RollDiceResult")
            {   
                //stop dice rolling animation
                
                if(msg.nextroll == null || msg.nextroll == undefined)
                {
                    Globals.emitter.Call("rollDiceResult", {id : msg.plId, value : msg.dice, pawnArr : msg.movable});
                } else
                {
                    Globals.emitter.Call("noValidMove", {nextRoll : msg.nextroll, plId : msg.plId});
                }
                
                //
            } else if (msg.t == "moveToken")
            {
              //cutId: msg.data[1].tokenId, cutMoveArr : msg.data[1].moveArr
                const cutData = msg.data.filter(data => data["isCut"] == true);
                console.log("Filtered Data : ");
                console.log(cutData);
                
                Globals.gameData.currentTurn = msg.nextroll;
                Globals.gameData.isCut = (cutData.length > 0);
                if(Globals.gameData.isCut)
                {
                    Globals.gameData.cutPawn = cutData[0];
                    console.log(Globals.gameData.cutPawn);
                }
                    
                Globals.emitter.Call("movePawn", {id: msg.data[cutData.length].tokenId, moveArr : msg.data[cutData.length].pos, scoreObj : msg.gState.score});
                

            } else if (msg.t == "turnSkipped")
            {
                
                Globals.emitter.Call("turnChanged", {nextRoll : msg.nextRoll, plId : msg.plId});
                
            } else if (msg.t == "turnTimer")
            {
                Globals.emitter.Call("turnTimer", {time : msg.data, id : msg.currPlTurn});
            } else if (msg.t == "timer")
            {
                Globals.emitter.Call("timer", {time : msg.data});
            } else if (msg.t == "threeSix")     
            {   
                
                    Globals.emitter.Call("threeSix",{id : msg.plId, nextRoll :  msg.nextRoll});
            } else if (msg.t == "invalidMove")
            {
                Globals.emitter.Call("choosePawnAgain", {});
            } else if(msg.t == "gameEnded")
            {
                if(msg.data == null || Object.keys(msg.data).length == 0)
                {   

                    let responseMsg = ""

                    if(msg.msg == "moveToken")
                    {
                        responseMsg = "Token Moved.";
                    } else if(msg.msg == "threeSix")
                    {
                        responseMsg = "Rolled Six Three Times.";
                    }else if(msg.msg == "turnSkipped")
                    {
                        responseMsg = "Timer Ended.";
                    }else if(msg.msg == "noValidMove")
                    {
                        responseMsg = "No valid move.";
                    }else if(msg.msg == "allTokensIn")
                    {
                        responseMsg = "Reached Home.";
                    }else if(msg.msg == "allOpponentLeft")
                    {
                        responseMsg = "All opponents left.";
                    }

                    Globals.emitter.Call("gameEnd", {reason : responseMsg});
                    return;
                }

                const cutData = msg.data.filter(data => data["isCut"] == true);
                console.log("Filtered Data : ");
                console.log(cutData);
                
                Globals.gameData.currentTurn = -1;
                Globals.gameData.isCut = (cutData.length > 0);
                if(Globals.gameData.isCut)
                {
                    Globals.gameData.cutPawn = cutData[0];
                    console.log(Globals.gameData.cutPawn);
                }


                Globals.emitter.Call("movePawn", {id: msg.data[cutData.length].tokenId, moveArr : msg.data[cutData.length].pos, scoreObj : msg.gState.score});
            } else if(msg.t == "diceRollNotif")
            {
                Globals.emitter.Call("diceRollNotif", {id : msg.plId});
            } else if(msg.t == "waitTimer")
            {
                Globals.emitter.Call("waitTimer", {data : msg.data}); 
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