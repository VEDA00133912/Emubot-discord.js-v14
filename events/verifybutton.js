const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const roleId = interaction.customId;
        const role = interaction.guild.roles.cache.get(roleId);

        if (!role) {
            return interaction.reply({ content: 'ロールが見つかりません。', ephemeral: true });
        }

        if (interaction.guild.members.me.roles.highest.comparePositionTo(role) <= 0) {
            return interaction.reply({ content: 'botロールより上のロールは付与できません。', ephemeral: true });
        }

        try {
            await interaction.member.roles.add(role);
            return interaction.reply({ content: `ロール ${role.name} が付与されました。<a:1196945710009036821:1247370449604841492>`, ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'ロールの付与に失敗しました。', ephemeral: true });
        }
    },
};
