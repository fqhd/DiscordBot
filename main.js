require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const commandHandler = require("./commands");
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

// Main Script
client.login(DISCORD_TOKEN);
client.once('ready', () => {
	commandHandler.initGlobals(client);
	console.log("Bot Started!");
});
client.on('message', commandHandler.messageEntered);

