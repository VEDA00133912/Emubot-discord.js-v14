const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const buttonPages = require("../pagination.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('ヘルプを表示します。'),

    async execute(interaction) {
        const embed1 = new EmbedBuilder()
            .setColor(0xf8b4cb)
            .setTitle('えむbot｜help')
            .addFields(
                { name: 'えむbotについて', value: '暇な音ゲーマーの作ってる謎多機能botです' },
                { name: 'このメッセージ', value: 'このhelpは放置してると一定期間後に自動で消えます' },
                { name: 'helpの操作方法', value: 'ボタンを押すことでコマンド一覧等が見れます' },
                { name: 'お知らせチャンネルについて', value: 'えむbot開発室というチャンネルでお知らせを行います。\n作成されていない場合は**/announce create**で作成してください' },
                { name: 'サポート等', value: '[twitter](https://twitter.com/ryo_001339)  [Discord](https://discord.gg/j2gM7d2Drp)  [Github](https://github.com/VEDA00133912/Emubot-discord.js-v14/tree/main)' }
            );

        const embed2 = new EmbedBuilder()
            .setTitle("えむbot｜help")
            .setDescription("コマンド一覧（1）")
            .addFields(
                { name: '**/help**', value: 'help(これ)を表示', inline: true },
                { name: '**/announce create**', value: 'お知らせチャンネルの作成', inline: true },
                { name: '**/taiko**', value: '太鼓の達人ランダム選曲', inline: true },
                { name: '**/prsk**', value: 'プロセカランダム選曲', inline: true },
                { name: '**/chunithm**', value: 'CHUNITHMランダム選曲', inline: true },
                { name: '**/icon**', value: 'アイコンを表示', inline: true }
            )
            .setColor(0xf8b4cb);

        const embed3 = new EmbedBuilder()
            .setColor(0xee99ff)
            .setTitle("えむbot｜help")
            .setDescription('コマンド一覧 (2)')
            .addFields(
                { name: '**/translate**', value: '日本語を翻訳します\n(英、中、韓、露)', inline: true },
                { name: '**/random**', value: 'ランダム英数字生成', inline: true },
                { name: '**/ping**', value: 'ping値の表示', inline: true },
                { name: '**/bancount**', value: 'BANメンバー数の表示', inline: true },
                { name: '**/convert**', value: '文字列の変換', inline: true },
                { name: '**/deletemessage**', value: 'メッセージの削除', inline: true }
            )
            .setColor(0xf8b4cb);

        const embed4 = new EmbedBuilder()
            .setColor(0xee99ff)
            .setTitle("えむbot｜help")
            .setDescription('コマンド一覧 (3)')
            .addFields(
                { name: '**/nitrogen**', value: 'フェイクNitroギフトリンクの生成', inline: true },
                { name: '**/tokengen**', value: 'フェイクtokenの生成', inline: true },
                { name: '**/5000choyen**', value: '5000兆円欲しい!!風画像の生成', inline: true },
                { name: '**/verifypanel**', value: '認証パネルの設置', inline: true },
                { name: '**/omikuji**', value: '1日一回おみくじ', inline: true },
                { name: '**/pi**', value: '指定した桁数の円周率の表示', inline: true }
            )
            .setColor(0xf8b4cb);

        const embed5 = new EmbedBuilder()
            .setColor(0xee99ff)
            .setTitle("えむbot｜help")
            .setDescription('コマンド一覧 (4)')
            .addFields(
                { name: '**/prime**', value: '素数判定', inline: true },
                { name: '**/qr**', value: 'QRコード生成', inline: true },
                { name: '**/remove**', value: '画像の背景透過', inline: true },
                { name: '**/roles**', value: 'ロール一覧', inline: true },
                { name: '**/serverinfo**', value: 'サーバー情報の表示', inline: true },
                { name: '**/shorturl**', value: 'URLの短縮', inline: true }
            )
            .setColor(0xf8b4cb);

        const embed6 = new EmbedBuilder()
            .setColor(0xee99ff)
            .setTitle("えむbot｜help")
            .setDescription('コマンド一覧 (5)')
            .addFields(
                { name: '**/userinfo**', value: 'ユーザー情報の表示', inline: true },
                { name: '**/kon**', value: 'コンギョを送信', inline: true },
                { name: '**/changenumber**', value: '進数変換', inline: true },
                { name: '**/kon**', value: 'コンギョを送信', inline: true }
            )
            .setColor(0xf8b4cb);

        const pages = [embed1, embed2, embed3, embed4, embed5, embed6];
        await buttonPages(interaction, pages);
    },
};
