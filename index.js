const Discord = require("discord.js");
const { Client, GatewayIntentBits, Partials, Intents, Collection } = require("discord.js");
const { token } = require('./config.json');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers,
  GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.MessageContent],
  partials: [Partials.User, Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction]
});

const fs = require('fs');

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once('ready', async () => {
  console.log('Ready!');

  const guildIds = client.guilds.cache.map(guild => guild.id);
  for (const guildId of guildIds) {
    try {
      const guild = await client.guilds.fetch(guildId);
      const commands = client.commands.map(command => command.data.toJSON());
      await guild.commands.set(commands);
      console.log(`Commands registered for guild: ${guildId}`);
    } catch (error) {
      console.error(`Failed to register commands for guild: ${guildId}`, error);
    }
  }

  client.user.setActivity("TEST", { type: "WATCHING" });
  client.user.setPresence({
    activity: { name: "your status" },
    status: "online",
  });

  const activitiesList = [{ name: 'TEST' }, { name: 'test', type: 'WATCHING' }];

  let i = 0;
  setInterval(() => {
    client.user.setActivity(activitiesList[i].name, { type: activitiesList[i].type });
    i = ++i % activitiesList.length;
  }, 20000);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true
    });
  }
});

client.login(token);

