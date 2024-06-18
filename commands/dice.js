const { SlashCommandBuilder,EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dice')
        .setDescription('Rolls a dice and returns a number between 1 and 6.'),
    async execute(interaction) {
        try {
            const diceRoll = Math.floor(Math.random() * 6) + 1;
            const embed = new EmbedBuilder()
                .setColor(0xf8b4cb)
                .setTitle('サイコロ 🎲')
                .setThumbnail('https://media.tenor.com/sUiwSBs8S6QAAAAj/dice-game.gif')
                .setDescription(`サイコロの目は \`${diceRoll}\` です！`);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);

            // エラーメッセージを送信
            try {
                await interaction.reply({ content: 'コマンドの実行中にエラーが発生しました。もう一度お試しください。', ephemeral: true });
            } catch (replyError) {
                console.error('Failed to send error message to the user:', replyError);
            }
        }
    },
};
