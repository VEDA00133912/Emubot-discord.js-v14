const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deletemessage')
    .setDescription('メッセージを削除します')
    .addIntegerOption(option =>
      option.setName('count')
      .setDescription('削除したいメッセージの数')
      .setRequired(true)),

async execute(interaction) {
  if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
    return interaction.reply({ content: 'このコマンドを実行する権限がありません。', ephemeral: true });
  }

  try {
    await interaction.deferReply({ ephemeral: true });

    const count = interaction.options.getInteger('count');
    const channel = interaction.channel; // Get the channel object from the interaction

    const messages = await channel.messages.fetch({ limit: count });
    const promises = messages.map(msg => msg.delete());
    await Promise.all(promises);

    const embed = new EmbedBuilder()
      .setColor(0xee99ff)
      .setTitle('削除完了！')
      .setDescription(`削除したメッセージ数: ${promises.length}`);

    await interaction.editReply({ content: '削除完了！' });
    interaction.channel.send({ embeds: [embed] });
  } catch (error) {
    console.error('メッセージの削除中にエラーが発生しました:', error);
    interaction.channel.send('メッセージの削除中にエラーが発生しました');
  }
},
};