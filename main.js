//Requirements
require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const Discord = require("discord.js");
const client = new Discord.Client();

// Global Variables
let RIOT_KEY;
let names = ["Fahd", "Amine", "Omar", "Mehdi", "Samar", "Yahia", "Sarah", "Axed", "Imane", "Jihwan"];
let usernames = ["9JlZKTcvMO_XU2IBV-uvTyg65cN7Oghn0BrLP2JCS-SdQiq9", "kmIMD61kpFj__vdcmkFmWRTO3Y4iTcdo8v9RM8wT5r3oarmV", "sZSQ7WVlb8PjS1DVSLp8-qaQ15b2-yjWPrGWXJcRSzEBmPF4", "OYzdKBrBZlppkK0z7QAPUHV7Bz1znrLhD2k_Im4eTYFNdFuB", "GQG72tn5Ap1mrhn-LOqj6LyE56iCbIMeji9qTDCxqJ_Z2SUb", "001gvTdfRTfrToRzGEk-sr4M1p1u70A4cTR1zhTIwNn8QdVD", "FI5IP0jcSLuwHxaSZH-dJSNRLC2m65VurjA-LB57Pg8W1-wU", "3D_wRaLbvZS19lw8GD38C-X2VzGPnU8TaWWJmkWlNPlPaNaQ", "kpDMq3qrUAZkPy3IVd-s2urPQyKsIHZot_MF8qeQJznatFr7", "w6-mWOTSRvKTQyKyDVefKcyZgEQEiaGYIGDkBNRhWpu9d2OS"];
let leaderboardArray = [];

// Main Script
const app = express();
app.listen(process.env.PORT, () => console.log("Starting server on port: " + process.env.PORT));
client.login(process.env.DISCORD_TOKEN);
client.on("ready", main);
client.on("message", messageEvent);

// Functions
function messageEvent(msg) {
	if(msg.content.substring(0, 4) === "KEY="){
		let providedKey = msg.content.substring(4);
		checkApiKey(providedKey).then(() => {
			RIOT_KEY = providedKey;
			msg.channel.send("Successfully Updated API Key");
		}).catch(() => {
			msg.channel.send("Invalid API Key Provided");
		});
	}
}

async function main() {

	let channel = await client.channels.fetch("831148754181816351").catch(() => console.log("Failed to retrieve ranking leaderboard channel"));
	let message = await channel.messages.fetch("831189816040357898").catch(() => console.log("Failed to retrieve ranking leaderboard message from leaderboard channel"));

	while(true) {
		leaderboard = "";
		leaderboardArray = [];
		leaderboard += "Congratulations to everyone for ranking up. Summer just started, we all got no life so I don't expect anyone to be travelin... That said, Goodluck and Have fun on the rift!! :)\n\n";

		// Adding ranks to leaderboard
		for(let i = 0; i < names.length; i++){
			let player = await getRank(usernames[i]).catch(function(){});
			if(typeof player == "undefined"){
				i = -1;
				sleep(5000);
				continue;
			}
			let mmr = rankToMMR(player.tier, player.rank, player.lp);
			let name = names[i];
			leaderboardArray.push({name, player, mmr});
			sleep(1000);
		}

		// Sorting the array
		leaderboardArray.sort(compare);

		// Updating leaderboard with sorted array of ranks
		for(let i = 0; i < leaderboardArray.length; i++){
			let player = leaderboardArray[i].player;
			leaderboard += (i + 1) + ") " + leaderboardArray[i].name + " " + player.tier + " " + player.rank + " " + player.lp + " LP" + "\n";
		}

		// Adding date and time to leaderboard
		leaderboard += "\n";

		const date =  new Date(new Date().getTime() + 5 * 60000);
		const day = date.getDate();
		const month = date.getMonth();
		const year = date.getFullYear();
		const hours = date.getHours();
		let minutes = date.getMinutes();

		if(parseInt(minutes) < 10){
			minutes = "0" + minutes;
		}

		leaderboard += `Next Update: ${day}/${month}/${year} ${hours}:${minutes} UTC`;

		//Updating the discord leaderboard message
		await message.edit(leaderboard).catch(() => console.log("Failed to update discord leaderboard message"));

		sleep(300000);
	}

}

function checkApiKey(key){
	return new Promise((resolve, reject) => {
		fetch("https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + usernames[0] + "?api_key=" + key).then(response => {
			if(response.status == 200){
				resolve();
			}else{
				reject();
			}
		}).catch(() => {
			console.log("Failed to get response code");
		});
	});
}

function compare(a, b){
     return b.mmr - a.mmr;
}

function rankToMMR(tier, rank, lp){
	let number = 0;
	switch(tier){
		case "challenger":
			number += 90000;
		break;
		case "grandmaster":
			number += 80000;
		break;
		case "grandmaster":
			number += 70000;
		break;
		case "master":
			number += 60000;
		break;
		case "diamond":
			number += 50000;
		break;
		case "platinum":
			number += 40000;
		break;
		case "gold":
			number += 30000;
		break;
		case "silver":
			number += 20000;
		break;
		case "bronze":
			number += 10000;
		break;
	}
	switch(rank){
		case "I":
			number += 4000;
		break;
		case "II":
			number += 3000;
		break;
		case "III":
			number += 2000;
		break;
		case "IV":
			number += 1000;
		break;
	}

	number += parseInt(lp);

	return number;
}



function getRank(puuid){
	return new Promise((resolve, reject) => {
		if (puuid == "kpDMq3qrUAZkPy3IVd-s2urPQyKsIHZot_MF8qeQJznatFr7") {
			fetch("https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + puuid + "?api_key=" + RIOT_KEY)
			.then(playerData => playerData.json())
			.then(data => {
				if (isNaN(data.length)) reject();
				for (let i = 0; i < data.length; i++) {
					if (data[i].queueType == "RANKED_SOLO_5x5") {
						let tier = data[i].tier.toLowerCase();
						let rank = data[i].rank;
						let lp = data[i].leaguePoints;
						resolve({ tier, rank, lp });
					}
				}
			}).catch(() => console.log("Failed to get NA rank of player"));
		} else {
			fetch("https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + puuid + "?api_key=" + RIOT_KEY)
			.then(playerData => playerData.json())
			.then(data => {
				if(isNaN(data.length)) reject();
				for (let i = 0; i < data.length; i++) {
					if (data[i].queueType == "RANKED_SOLO_5x5") {
						let tier = data[i].tier.toLowerCase();
						let rank = data[i].rank;
						let lp = data[i].leaguePoints;
						resolve({ tier, rank, lp });
					}
				}
			}).catch(() => console.log("Failed to get EUW rank of player"));
		}
	});
	
}

function sleep(delay) {
	var start = new Date().getTime();
	while (new Date().getTime() < start + delay);
}
