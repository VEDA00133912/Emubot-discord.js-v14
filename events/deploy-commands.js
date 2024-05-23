const { REST, Routes } = require('discord.js');
const { clientId,token } = require('../config.json');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, '..', 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log(`${commands.length} 個のコマンドを登録するよ`);

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );
        

        console.log(`${commands.length} 個のコマンドを登録したよ`);
    } catch (error) {
        console.error(error);
    }
})();
