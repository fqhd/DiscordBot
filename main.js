require("dotenv").config();
const fetch = require("node-fetch");
const discord = require("discord.js");
const client = new discord.Client();
const riotKey = "RGAPI-ff870cd5-cddd-4e92-a027-ae763bfcaedb";
var message;

//String of names
let names = [
     "verdilet",
     "samar",
     "redtide"
];

client.login(process.env.TOKEN);
client.on("message", entered);

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

     const summonerIdLink = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${urlName}?api_key=${riotKey}`;

     let reponse = await fetch(summonerIdLink);
     let data = await reponse.json();

     const playerLink = "https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + data.id + "?api_key=" + riotKey;

     response = await fetch(playerLink);
     data = await response.json();

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
