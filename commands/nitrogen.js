const { SlashCommandBuilder,EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nitrogen')
        .setDescription('nitroギフトリンクの生成')
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('生成する数')
                .setRequired(true)),

    async execute(interaction) {
        try {
            await interaction.deferReply(); 

            const quantity = interaction.options.getInteger('count');
            const nitroLinks = generateNitroLinks(quantity);

            const embed = new EmbedBuilder()
                .setColor('#f47fff')
                .setTitle('Nitro Gift Links')
                .setDescription(`Nitroギフトリンク\n${nitroLinks.join('\n')}`);
            
            await interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error('Nitro ギフトリンクの生成中にエラーが発生しました：', error);
            await interaction.followUp({ content: 'Nitro ギフトリンクの生成中にエラーが発生しました。', ephemeral: true });
        }
    },
};

function generateNitroLinks(quantity) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const nitroLinks = [];
    
    for (let j = 0; j < quantity; j++) {
        let code = '';
        for (let i = 0; i < 16; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        nitroLinks.push(`https://discord.com/gifts/${code}`);
    }

    return nitroLinks;
}
