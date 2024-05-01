const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('サーバー情報を表示します。'),
  async execute(interaction) {
    const guild = interaction.guild;
    const embed = new EmbedBuilder()
      .setColor(0xf8b4cb)
      .setTitle('Server Info')
      .addFields(
        { name: 'サーバー名', value: guild.name, inline: true },
        { name: 'メンバー数', value: guild.memberCount.toString(), inline: true },
      );

    try {
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      console.log("serverinfo error");
    }
  },
};
