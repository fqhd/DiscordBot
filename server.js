//Requirements
require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const Discord = require("discord.js");
const client = new Discord.Client();

//Environment variables
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const RIOT_KEY = process.env.RIOT_KEY;
const PORT = process.env.PORT || 3000;

//Main Script
const app = express();
app.listen(process.env.PORT, () => console.log("Starting server on port: " + PORT));
client.login(DISCORD_TOKEN);
client.on("ready", main);
client.on("message", onMessageEnter);


let names = ["Fahd", "Amine", "Omar", "Mehdi", "Samar", "Yahia", "Sarah", "Axed", "Imane", "Jihwan"];
let usernames = ["9JlZKTcvMO_XU2IBV-uvTyg65cN7Oghn0BrLP2JCS-SdQiq9", "kmIMD61kpFj__vdcmkFmWRTO3Y4iTcdo8v9RM8wT5r3oarmV", "sZSQ7WVlb8PjS1DVSLp8-qaQ15b2-yjWPrGWXJcRSzEBmPF4", "OYzdKBrBZlppkK0z7QAPUHV7Bz1znrLhD2k_Im4eTYFNdFuB", "GQG72tn5Ap1mrhn-LOqj6LyE56iCbIMeji9qTDCxqJ_Z2SUb", "001gvTdfRTfrToRzGEk-sr4M1p1u70A4cTR1zhTIwNn8QdVD", "FI5IP0jcSLuwHxaSZH-dJSNRLC2m65VurjA-LB57Pg8W1-wU", "3D_wRaLbvZS19lw8GD38C-X2VzGPnU8TaWWJmkWlNPlPaNaQ", "kpDMq3qrUAZkPy3IVd-s2urPQyKsIHZot_MF8qeQJznatFr7", "w6-mWOTSRvKTQyKyDVefKcyZgEQEiaGYIGDkBNRhWpu9d2OS"];

async function main(){
     //Events
     const channel = await client.channels.fetch("831148754181816351");
     let message = await channel.messages.fetch("831189816040357898");

     let leaderboard = "";
     while(true){
          //Creating the ranks
          leaderboard = "";
          leaderboard += "The month of April just started!! Good Luck on your ranked games!! \n Lets announce the Leaderboards!!\n\n";
          for(let i = 0; i < names.length; i++){
               let player = await getRank(usernames[i]);
               leaderboard += (i + 1) + ") " + names[i] + ": " + player.tier + " " + player.rank + " " + player.lp + " LP";
               leaderboard += "\n";
               sleep(1000);
          }

          //Updating the discord leaderboard message
          await message.edit(leaderboard);
          sleep(600000);
          console.log("Updated Leaderboard");
     }

}

async function onMessageEnter(message){
     let command = message.content.substring(0, 5);
     let name = message.content.substring(6);
     if(command == "?rank"){
          let urlName = name.replace(/ /g, "%20");
          const summonerIdLink = "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + urlName + "?api_key=" + RIOT_KEY;
          let response = await fetch(summonerIdLink);
          let json = await response.json();
          let player = await getRank(json.id);
          if(player == null){
               message.channel.send("That shit aint workin");
          }else{
               message.channel.send(name + " is " + player.tier + " " + player.rank + " with " + player.lp + " LP");
          }
     }

}

async function getRank(puuid){
     let playerData;
     if(puuid == "kpDMq3qrUAZkPy3IVd-s2urPQyKsIHZot_MF8qeQJznatFr7"){
          playerData = await fetch("https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + puuid + "?api_key=" + RIOT_KEY);
     }else{
          playerData = await fetch("https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + puuid + "?api_key=" + RIOT_KEY);
     }

     let data = await playerData.json();
     if(isNaN(data.length)) return;
     for(let i = 0; i < data.length; i++){
          if(data[i].queueType == "RANKED_SOLO_5x5"){
               let tier = data[i].tier.toLowerCase();
               let rank = data[i].rank;
               let lp = data[i].leaguePoints;
               return {tier, rank, lp};
          }
     }
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}
