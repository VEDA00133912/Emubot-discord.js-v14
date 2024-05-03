// ｺﾞﾏﾏﾖの動画を送信するコマンド(ゴママヨ機能廃止したし消してもいいかなあ)
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('goma')
    .setDescription('ゴママヨを送信します。'),
  async execute(interaction) {
    try {
      await interaction.reply("[ごままよ](https://www.youtube.com/watch?v=NofBgAsZjxI)");
    } catch (error) {
      console.error(error);
      console.log("goma error");
    }
  },
};
