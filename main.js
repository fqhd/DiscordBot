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

     let reponse = await fetch(summonerIdLink);
     let data = await reponse.json();

     const playerLink = "https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + data.id + "?api_key=" + RIOT_KEY;

     response = await fetch(playerLink);
     data = await response.json();

     console.log(data);

     let tier = data[0].tier.toLowerCase();
     let rank = data[0].rank;
     let lp = data[0].leaguePoints;

     return {tier, rank, lp};
}

function sleep(miliseconds) {
     var currentTime = new Date().getTime();

     while (currentTime + miliseconds >= new Date().getTime()) {
     }
}
