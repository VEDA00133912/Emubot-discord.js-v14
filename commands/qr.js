const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('qr')
        .setDescription('QRコードを生成するよ')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('QRにしたいURLを入力してね')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const url = interaction.options.getString('url');

            const embed = new EmbedBuilder()
                .setTitle('QRコードにしました！')
                .setImage(`https://qrickit.com/api/qr.php?d=${encodeURIComponent(url)}`);

            await interaction.reply({ embeds: [embed] , ephemeral: true});
        } catch (error) {
            console.error(error);
            await interaction.reply('QRコードの生成中にエラーが発生しました。もう一度お試しください。');
        }
    },
};
