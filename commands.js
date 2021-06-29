

module.exports = async function (message){
	if(message.channel.id == '831148754181816351'){ // Ranking Leaderboard channel
		// We delete the message to keep the channel clean
		console.log('Got a message, deleting it...');
		await message.delete();
	} else if(message.channel.id == '844341451344314398'){ // Bot Commands Channel
		// Process the message
		const tokens = message.content.split(' ');
		const command = tokens.shift();
		if(command.charAt(0) === '_'){
			command.substring(1);
			console.log('Tokens: '+ tokens);
		}
	}
}
