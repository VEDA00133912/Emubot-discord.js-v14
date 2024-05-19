// 翻訳時に使うAPIは https://qiita.com/tanabee/items/c79c5c28ba0537112922 の記事のものを使わせていただきました。
// 参考として https://qiita.com/narikakun/items/5371853304da77675589 も
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('日本語を他言語に翻訳します。')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('翻訳したいテキストを入力してください。')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('language')
        .setDescription('翻訳したい言語を選択してください。')
        .setRequired(true)
        .addChoices(
                   { name:"英語", value:"en" },
                   { name:"中国語", value:"zh-cn" },
                   { name:"韓国語", value:"ko" },
                   { name:"ロシア語", value:"ru" })
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const text = interaction.options.getString('text');
    const targetLanguage = interaction.options.getString('language');

    try {
      const translatedText = await gasTranslate(text, 'ja', targetLanguage);

      await interaction.editReply(translatedText);
    } catch (error) {
      console.error(error);
      await interaction.editReply('翻訳エラーが発生しました。');
    }
  },
};

function gasTranslate(text, source, target) {
  return axios.get(`https://script.google.com/macros/s/AKfycbweJFfBqKUs5gGNnkV2xwTZtZPptI6ebEhcCU2_JvOmHwM2TCk/exec`, {
    params: {
      text,
      source,
      target
    }
  }).then(response => {
    return response.data;
  }).catch(error => {
    throw error;
  });
}

