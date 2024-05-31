// CHUNITHMのランダム選曲コマンド
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chunithm')
    .setDescription('チュウニズムの曲をランダムに選択します。')
    .addStringOption(option =>
      option.setName('action')
        .setDescription('選曲オプションを選択します。')
        .setRequired(true)
      .addChoices({name:"全曲", value:"chuall"}, 
                  {name:"ORIGINALのみ", value:"original"},
                  {name:"WE,ULTIMAのみ",value:"weUL"})
      )
    .addIntegerOption(option =>
      option.setName('count')
        .setDescription('選択する曲の数を指定します。')
        .setRequired(true)),

  async execute(interaction) {
    if (interaction.commandName === "chunithm") {
      const option = interaction.options.getString("action");
      const count = interaction.options.getInteger("count");

      let songs = [];
      let dataFilePath;

      dataFilePath = option === "chuall" ? '../chunithm/chu-ALL.json' : option === "original" ? '../chunithm/AC-ori.json' : option === "weUL" ? '../chunithm/weUL.json' : null;

      if (!dataFilePath) {
        await interaction.reply("全曲,オリジナルのみ,WE&ULTIMAのみから選んでね");
        return;
      }
      try {
        const data = require(dataFilePath);
        songs = data.songs;
        if (count < 1 || count > songs.length) {
          await interaction.reply("曲数を指定してね");
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
        await interaction.reply({ content: 'エラーが発生しました。', ephemeral: true });
      }
    }
  }
};
