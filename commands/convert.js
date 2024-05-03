// 古代文字への変換コマンド
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('convert')
    .setDescription('テキストを古代文字に変換します。')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('変換タイプを選択します。')
        .setRequired(true)
        .addChoices({name:"rune文字", value:"rune"}, 
                    {name:"フェニキア文字", value:"phoenicia"},
                    {name:"ヒエログリフ",value:"hieroglyphs"})
    )
    .addStringOption(option =>
      option.setName('text')
        .setDescription('変換するテキストを入力してください。')
        .setRequired(true)),
                     
  async execute(interaction) {
    const type = interaction.options.getString('type');
    const text = interaction.options.getString('text');
    const conversionData = require('../convert.json');

    let convertedText = '';
    switch (type) {
      case 'rune':
        convertedText = convertText(text, conversionData.rune);
        break;
      case 'phoenicia':
        convertedText = convertText(text, conversionData.phoenicia);
        break;
      case 'hieroglyphs':
        convertedText = convertText(text, conversionData.hieroglyphs);
        break;
      default:
        await interaction.reply('その文字はサポートされていません。');
        return;
    }

    await interaction.reply(convertedText);
  },
};

function convertText(text, conversionMap) {
  return text.toUpperCase()
    .split('')
    .map(char => conversionMap[char] || char)
    .join('');
}
