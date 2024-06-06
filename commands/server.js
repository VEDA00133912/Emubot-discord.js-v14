// 参加しているサーバー一覧を表示するコマンド
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const cooldowns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('入ってる鯖一覧'),
  async execute(interaction) {
    const guilds = interaction.client.guilds.cache;

    const embed = new EmbedBuilder()
      .setColor('#f8b4cb')
      .setTitle('サーバー一覧')
      .setDescription(guilds.map(guild => guild.name).join('\n'));

 try {
  const reply = await interaction.reply({ embeds: [embed], ephemeral: true });
} catch (error) {
  console.error(error);
  await interaction.reply({ content: 'エラーが発生しました。', ephemeral: true });
}
    if (!cooldowns.has(interaction.guildId)) {
      cooldowns.set(interaction.guildId, new Set());
    }
    const now = Date.now();
    const expirationTime = now + 3600000;
    cooldowns.get(interaction.guildId).add(interaction.user.id);
    setTimeout(() => {
      cooldowns.get(interaction.guildId).delete(interaction.user.id);
    }, 3600000);
  },
};
