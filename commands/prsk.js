// プロセカランダム選曲コマンド
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('prsk')
    .setDescription('プロセカの曲をランダムに選択します。')
    .addStringOption(option =>
      option.setName('action')
        .setDescription('選曲オプションを選択します。')
        .setRequired(true)
        .addChoices({name:"MASTER", value:"master"},
                   {name:"APPEND",value:"append"})
                   )
    .addIntegerOption(option =>
      option.setName('count')
        .setDescription('選択する曲の数を指定します。')
        .setRequired(true)),

  async execute(interaction) {
    if (interaction.commandName === "prsk") {
      const option = interaction.options.getString("action");
      const count = interaction.options.getInteger("count");

      let songs = [];
      let dataFilePath;

      dataFilePath = option === "append" ? '../prsk/APPEND.json' : option === "master" ? '../prsk/MASTER.json' : null;

      if (!dataFilePath) {
        await interaction.reply("MASTERかAPPENDを選んでください");
        return;
      }
      try {
        const data = require(dataFilePath);
        songs = data.songs;
        if (count < 1 || count > songs.length) {
          await interaction.reply("曲数を指定してください");
          return;
        }
        const selectedSongs = [];
        while (selectedSongs.length < count) {
          const randomIndex = Math.floor(Math.random() * songs.length);
          const randomSong = songs[randomIndex];
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
        console.log("prsk error");
      }
    }
  }
};
