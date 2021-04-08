//Requirements
require("dotenv").config();
const fetch = require("node-fetch");
const discord = require("discord.js");
const client = new discord.Client();

//Environment variables
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const RIOT_KEY = process.env.RIOT_KEY;

//Main Script
client.login(DISCORD_TOKEN);
client.on("message", entered);

//Functions
function entered(message){
     let command = message.content.substring(0, 5);
     let name = message.content.substring(6);
     if(command != "?rank") return;

     getRank(name)
          .then(player => message.channel.send(name + " is " + player.tier + " " + player.rank + " with " + player.lp + "LP"))
          .catch(() => message.channel.send("that shit aint workin"));

}

async function getRank(name){
     let urlName = name.replace(/ /g, "%20");
     const summonerIdLink = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${urlName}?api_key=${RIOT_KEY}`;
     fetch(summonerIdLink)
          .then(response => response.json())
          .then(json => {
               const playerLink = "https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + data.id + "?api_key=" + RIOT_KEY;
               return fetch(playerLink);
          })
          .then(response => response.json())
          .then(json => {
               for(let i = 0; i < data.length; i++){
                    if(data[i].queueType == "RANKED_SOLO_5x5"){
                         let tier = data[i].tier.toLowerCase();
                         let rank = data[i].rank;
                         let lp = data[i].leaguePoints;
                         return {tier, rank, lp};
                    }
               }
          }).catch(err => console.log(err));
}
