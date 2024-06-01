const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const fs = require('fs');

const cooldowns = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pi')
        .setDescription('円周率を表示します')
        .addIntegerOption(option =>
            option.setName('decimals')
                .setDescription('表示したい円周率の桁数を入れてね(1000以下)')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const decimals = interaction.options.getInteger('decimals');

          // クールダウン
            if (cooldowns.has(interaction.user.id)) {
                const expirationTime = cooldowns.get(interaction.user.id);
                if (Date.now() < expirationTime) {
                    const timeLeft = (expirationTime - Date.now()) / 1000;
                    await interaction.reply({ content: `コマンドが利用できるまであと ${timeLeft.toFixed(1)} 秒待ってね`, ephemeral: true });
                    return;
                }
            }

            const cooldownTime = 60000; 
            cooldowns.set(interaction.user.id, Date.now() + cooldownTime);

            if (decimals > 1000) {
                await interaction.reply({ content: '1000以下にしてね', ephemeral: true });
                return;
            }

            const piValue = fs.readFileSync('pi.txt', 'utf8');

            const calculatedPiValue = calculatePi(piValue, decimals);

            const embed = new EmbedBuilder()
                .setColor(0xf8b4cb)
                .setTitle(`${decimals} 桁の円周率です！`)
                .setDescription(calculatedPiValue);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'エラーが発生しました。', ephemeral: true });
        }
    },
};

function calculatePi(piValue, decimals) {
    const piDigits = piValue.split('').filter(char => char !== '.');
    const truncatedPi = piDigits.slice(0, decimals).join('');

    return `${truncatedPi.slice(0, 1)}.${truncatedPi.slice(1)}`;
}
