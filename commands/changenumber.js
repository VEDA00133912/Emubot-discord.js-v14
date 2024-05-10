const { SlashCommandBuilder,EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('changenumber')
        .setDescription('進数変換')
        .addStringOption(option =>
            option.setName('number')
                .setDescription('変換する数字を入力してください')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('action')
                .setDescription('変換したい進数を選択する')
                .setRequired(true)
                .addChoices(
                    { name: '2進数', value: '2' },
                    { name: '10進数', value: '10' },
                    { name: '12進数', value: '12' },
                    { name: '16進数', value: '16' },
                    { name: '32進数', value: '32' }
                )
        ),
    async execute(interaction) {
        const number = interaction.options.getString('number');
        const action = interaction.options.getString('action');

        let convertedNumber;

        switch (action) {
            case '2':
                convertedNumber = parseInt(number, 10).toString(2);
                break;
            case '10':
                convertedNumber = parseInt(number, 10).toString(10);
                break;
            case '12':
                convertedNumber = parseInt(number, 10).toString(12);
                break;
            case '16':
                convertedNumber = parseInt(number, 10).toString(16);
                break;
            case '32':
                convertedNumber = parseInt(number, 10).toString(32);
                break;
            default:
                return interaction.reply('2進数、10進数、12進数、16進数、32進数から選択してください。');
        }
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('進数変換結果')
            .addFields({name:'変換結果', value:convertedNumber});

        await interaction.reply({ embeds: [embed] });
    },
};
