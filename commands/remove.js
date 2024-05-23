// https://www.remove.bg/dashboard#api-key　ここでAPIキーを取得してください
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('画像の背景透過')
    .addAttachmentOption(option => option.setName('image').setDescription('背景を削除したい画像を選択').setRequired(true)),

  async execute(interaction) {
    try {
      await interaction.deferReply();

      const image = interaction.options.getAttachment('image');

      if (image.contentType === 'image/webp') {
        return await interaction.editReply('webpはできないんだよね..\n[ここ](<https://www.iloveimg.com/ja/convert-to-jpg/webp-to-jpg>)でPNG形式に変換してやってみて！');
      }

      const response = await axios.post('https://api.remove.bg/v1.0/removebg', 
        {
          image_url: image.proxyURL,
          size: 'auto'
        },
        {
          headers: {
            'X-Api-Key': 'remove.bgのAPIキー',
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );

      const buffer = Buffer.from(response.data, 'binary');
      const attachment = new AttachmentBuilder(buffer, { name: 'removebg.png' });

      await interaction.editReply({ content: '背景を削除したよ！', files: [attachment] });
    } catch (error) {
      console.error('画像の背景透過中にエラーが発生しました：', error);
      await interaction.reply('エラーが出ちゃったよ..');
    }
  },
};
