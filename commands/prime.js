const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prime')
        .setDescription('素数判定')
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription('素数かどうかを判定したい数')
                .setRequired(true)),
    async execute(interaction) {
        const number = interaction.options.getInteger('number');
        let isPrime = true;

        if (number <= 1) {
            isPrime = false;
        } else {
            for (let i = 2; i <= Math.sqrt(number); i++) {
                if (number % i === 0) {
                    isPrime = false;
                    break;
                }
            }
        }

        const Embed = new EmbedBuilder()
            .setColor(0xf8b4cb)
            .setTitle('素数判定結果')
          .addFields(
            { name: '入力された数', value: number.toString()},
            { name: '結果', value: isPrime ? '素数です' : '素数ではないです'},
            );

        await interaction.reply({ embeds: [Embed] });
    },
};
