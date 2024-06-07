// CHUNITHMのランダム選曲コマンド
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chunithm')
    .setDescription('チュウニズムの曲をランダムに選択します。')
    .addStringOption(option =>
      option.setName('action')
        .setDescription('選曲オプションを選択します。')
        .setRequired(true)
        .addChoices(
          { name: "全曲", value: "chuall" },
          { name: "ORIGINALのみ", value: "original" },
          { name: "WE,ULTIMAのみ", value: "weUL" }
        )
    )
    .addIntegerOption(option =>
      option.setName('count')
        .setDescription('選択する曲の数を指定します。')
        .setRequired(true)),

  async execute(interaction) {
    if (interaction.commandName === "chunithm") {
      const option = interaction.options.getString("action");
      const count = interaction.options.getInteger("count");

      let dataFilePath;

      switch (option) {
        case "chuall":
          dataFilePath = path.join(__dirname, '../chunithm/chu-ALL.txt');
          break;
        case "original":
          dataFilePath = path.join(__dirname, '../chunithm/AC-ori.txt');
          break;
        case "weUL":
          dataFilePath = path.join(__dirname, '../chunithm/weUL.txt');
          break;
        default:
          await interaction.reply("選択肢から選んでください：全曲、ORIGINALのみ、WE,ULTIMAのみ");
          return;
      }

      try {
        const rawData = fs.readFileSync(dataFilePath, 'utf8');
        const songList = rawData.split('\n').filter(song => song.trim() !== '');

        if (songList.length === 0) {
          await interaction.reply("テキストファイルに曲が見つかりませんでした。");
          return;
        }
        if (count < 1 || count > songList.length) {
          await interaction.reply("曲数は1以上、曲リストの総数以下で指定してください。");
          return;
        }

        const selectedSongs = [];
        while (selectedSongs.length < count) {
          const randomIndex = Math.floor(Math.random() * songList.length);
          const randomSong = songList[randomIndex];
          if (!selectedSongs.includes(randomSong)) {
            selectedSongs.push(randomSong);
          }
        }

        const embed = new EmbedBuilder()
          .setTitle(`ランダム選曲の結果 (${selectedSongs.length} 曲)`)
          .setDescription(selectedSongs.join("\n"))
          .setColor(0xf8b4cb);

        await interaction.reply({ embeds: [embed] });
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'エラーが発生しました。', ephemeral: true });
      }
    }
  }
};
