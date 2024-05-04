const { SlashCommandBuilder,EmbedBuilder } = require("discord.js");
const buttonPages = require("../pagination.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('ヘルプを表示します。'),
  
  async execute(interaction) {
        const embed1 = new EmbedBuilder()
          .setColor(0xf8b4cb)
          .setTitle('えむbot｜help')
          .addFields({
            name: 'えむbotについて',value: '暇な音ゲーマーの作ってる謎多機能botです'},
          { name: 'このメッセージ', value: 'このhelpは放置してると一定期間後に自動で消えます'},
         {name: '操作方法', value: 'ボタンを押すことでコマンド一覧等が見れます'
          });

        const embed2 = new EmbedBuilder()
            .setTitle("えむbot｜help")
            .setDescription("コマンド一覧（1）")
     .addFields(
       { name: '**/help**', value: 'help(これ)を表示', inline: true },
           { name: '**/ping**', value: 'pingコマンド', inline: true },
           { name: '**/kon**', value: 'コンギョを送るよ(!?)', inline: true },
           { name: '**/omikuji**', value: 'おみくじが引けるよ', inline: true },
           { name: '**/random**', value: 'ランダム文字列をつくるよ', inline: true },
           { name: '**/icon**', value: 'アイコンを表示するよ', inline: true }
      )
      .setColor(0xf8b4cb);

        const embed3 = new EmbedBuilder()
            .setColor(0xee99ff)
            .setTitle("えむbot｜help")
            .setDescription('コマンド一覧 (2)')
            .addFields(
            { name: '**/server**', value: '参加サーバーをだすよ', inline: true },
            { name: '**/convert**', value: '英文を選んだものに変換するよ!', inline: true },
            { name: '**/serverinfo**', value: 'サーバー情報を表示するよ', inline: true },
            { name: '**/taiko**', value: '太鼓の達人ランダム選曲だよ', inline: true },
            { name: '**/prsk**', value: 'プロセカランダム選曲だよ', inline: true },
            { name: '**/chunithm**', value: 'CHUNITHMランダム選曲だよ', inline: true }
          )
          .setColor(0xf8b4cb);

    const embed4 = new EmbedBuilder()
      .setColor(0xee99ff)
      .setTitle("えむbot｜help")
      .setDescription('コマンド一覧 (3)')
      .addFields(
      { name: '**/prime**', value: '素数判定をします'},
      { name: '**サポートサーバー**', value: 'https://discord.gg/rXkHckzvtC ' }
    )
    .setColor(0xf8b4cb);

        const pages = [embed1, embed2, embed3,embed4];
        await buttonPages(interaction, pages);
    },
};
