// ランダムに文字列を生成するコマンド(Embed化してもいいかも)
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('random')
    .setDescription('ランダム文字生成')
    .addIntegerOption(option =>
      option.setName('length')
        .setDescription('生成したい文字数')
        .setRequired(true)
    ),
  async execute(interaction) {
    const length = interaction.options.getInteger('length');

    if (length > 1999) {
      try {
        await interaction.reply("2000以下にしてください");
      } catch (error) {
        console.error(error);
        console.log("random error");
      }
    } else {
      const randomString = Array.from({ length }, () => Math.random().toString(36).charAt(2)).join("");
      try {
        await interaction.reply(randomString);
      } catch (error) {
        console.error(error);
        console.log("randomcreate error");
      }
    }
  },
};
