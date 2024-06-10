const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calc')
    .setDescription('数学式を計算します。')
    .addStringOption(option =>
      option.setName('expression')
        .setDescription('計算する数学式')
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      let expression = interaction.options.getString('expression');
      expression = expression.replace(/×/g, '*').replace(/÷/g, '/');
      const result = Function(`'use strict'; return ${expression}`)();
      await interaction.reply(`${expression} = ${result}`);
    } catch (error) {
      console.error(error);
      await interaction.reply('エラーが発生しました。数式の評価に失敗しました。');
    }
  },
};
