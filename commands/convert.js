const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('convert')
    .setDescription('テキストを指定形式に変換します。')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('変換タイプを選択します。')
        .setRequired(true)
        .addChoices({name:"rune文字", value:"rune"}, 
                    {name:"フェニキア文字", value:"phoenicia"},
                    {name:"ヒエログリフ",value:"hieroglyphs"},
                    {name:"逆読み", value:"reverse"},
                    {name:"アナグラム", value:"anagram"})
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
      case 'reverse':
        convertedText = text.split('').reverse().join('');
        break;
      case 'anagram':
        convertedText = anagram(text);
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

function anagram(text) {
  const chars = text.split('');
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}
