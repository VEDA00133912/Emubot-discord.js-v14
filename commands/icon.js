// アイコンをEmbedで表示するコマンド
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('icon')
    .setDescription('アイコン表示')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('表示したいユーザー')
        .setRequired(false)
    ),
  
  async execute(interaction) {
    const { options, user } = interaction;

    const targetUser = options.getUser('user') || user;
    const avatarURL = targetUser.displayAvatarURL({
      format: 'png',
      size: 1024,
    });
    
    const embed = new EmbedBuilder()
      .setTitle(`${targetUser.username}のアイコン`)
      .setImage(avatarURL)
      .setColor(0xf8b4cb);

    try {
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      console.log('icon error');
    }
  },
};
