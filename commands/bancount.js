const { SlashCommandBuilder,EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bancount')
        .setDescription('BANされているユーザーのカウント'),

    async execute(interaction) {
        try {
            const bannedUsers = await interaction.guild.bans.fetch();
            const bannedUsersCount = bannedUsers.size;

            const embed = new EmbedBuilder()
                .setColor(0xf8b4cb)
                .setTitle('Banned Users')
                .setDescription(`このサーバーのBANユーザー数: ${bannedUsersCount}`);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'エラーが発生しました。', ephemeral: true });
        }
    },
};
