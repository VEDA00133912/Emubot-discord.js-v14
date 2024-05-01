const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('入ってる鯖一覧'),
  async execute(interaction) {
    const serverInfo = interaction.client.guilds.cache.map(guild => `${guild.name}`).join("\n");
    try {
      await interaction.reply(`\`\`\`\n${serverInfo}\n\`\`\``);
    } catch (error) {
      console.error(error);
      console.log("server error");
    }
  },
};
