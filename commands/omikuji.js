const { SlashCommandBuilder } = require('discord.js');

const fortunes = ["大吉", "中吉", "小吉", "吉", "末吉", "凶", "大凶"];
const dailyFortunes = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('omikuji')
    .setDescription('おみくじを引けます'),
  async execute(interaction) {
    try {
      const userId = interaction.user.id;

      if (!dailyFortunes.has(userId) || !isToday(dailyFortunes.get(userId))) {
        let result = '';
        do {
          result = fortunes[Math.floor(Math.random() * fortunes.length)];
        } while (dailyFortunes.get(userId) === result); 
        await interaction.reply(`今日のあなたは **${result}** です`);

        dailyFortunes.set(userId, new Date());
      } else {
        await interaction.reply('またあした引いてください！');
      }
    } catch (error) {
      console.error('おみくじの実行中にエラーが発生しました：', error);
      await interaction.reply('おみくじの実行中にエラーが発生しました。');
    }
  },
};

function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}
