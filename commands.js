const updateLeaderboard = require("./leaderboard-update");
let client;

const commands = { 
	update: updateLeaderboard,
	stop: function (_client){
		console.log("Stopping Bot...");
		_client.destroy();
	}
 };

async function messageEntered (message){
	if(message.channel.id == '831148754181816351'){ // Ranking Leaderboard channel
		// We delete the message to keep the channel clean
		console.log('Got a message in leaderboard channel, deleting it...');
		await message.delete();
	} else if(message.channel.id == '844341451344314398'){ // Bot Commands Channel
		// Process the message
		const tokens = message.content.split(' ');
		let command = tokens.shift();
		if(command.charAt(0) === '_'){
			command = command.substring(1);
			console.log('Command: ' + command);
			console.log('Tokens: '+ tokens);

			try{
				commands[command](client);
			}catch(err){
				console.log('User entered invalid command');
			}
		}
	}
}

function initGlobals(_client){
	client = _client;
}

module.exports = { initGlobals, messageEntered };