// 参加しているサーバー一覧を表示するコマンド
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('入ってる鯖一覧'),
  async execute(interaction) {
    const guilds = interaction.client.guilds.cache;
      
    const embed = new EmbedBuilder()
      .setColor(0xf8b4cb)
      .setTitle('サーバー一覧')
      .setDescription(guilds.map(guild => guild.name).join('\n'));

    try {
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      console.log("server error");
    }
  },
};
