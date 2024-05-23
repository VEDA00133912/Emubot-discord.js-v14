// ping値を表示するコマンド
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('ping'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0xf8b4cb)
      .setTitle('bot｜ping')
      .setDescription('Ping値')
      .addFields(
        { name: 'WebSocket Ping', value: `${interaction.client.ws.ping}ms`, inline: true },
        { name: 'API-Endpoint Ping', value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true },
        );

    try {
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      console.log("ping error");
    }
  },
};
