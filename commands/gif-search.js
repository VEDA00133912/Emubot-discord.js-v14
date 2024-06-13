// https://developers.google.com/tenor/guides/quickstart API取得せいやー
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const fs = require('fs');

const cooldowns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search-gif')
    .setDescription('指定したワードに関するGIFを送信します')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('検索したいワード')
        .setRequired(true)),
  async execute(interaction) {
    if (cooldowns.has(interaction.guildId)) {
      const cooldown = cooldowns.get(interaction.guildId);
      const now = Date.now();
      if (cooldown > now) {
        const remainingTime = Math.ceil((cooldown - now) / 1000); 
        await interaction.reply({ content: `クールダウン中です。\nあと${remainingTime} 秒後にもう一度やってね！`, ephemeral: true });
        return;
      }
    }


    const configData = fs.readFileSync('config.json');
    const config = JSON.parse(configData);
    const apiKey = config.tenorAPI;
    const query = interaction.options.getString('query');

    await interaction.deferReply();

    try {
      const response = await axios.get(`https://tenor.googleapis.com/v2/search?q=${query}&key=${apiKey}&random=true`);
      const gifUrl = response.data.results[0].media_formats.gif.url;

      const embed = new EmbedBuilder()
        .setColor(0xf8b4cb)
        .setTitle(`${query}のGIFです！`)
        .setImage(gifUrl);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('gif nai..');
      await interaction.editReply('GIFが見つかりませんでした');
    }

    const cooldownTime = 15000; 
    cooldowns.set(interaction.guildId, Date.now() + cooldownTime);
    setTimeout(() => cooldowns.delete(interaction.guildId), cooldownTime);
  },
};
