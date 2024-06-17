const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('指定したロールを付与します')
        .addRoleOption(option => option.setName('role').setDescription('付与するロール').setRequired(true)),
    async execute(interaction) {
        const role = interaction.options.getRole('role');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({ content: 'あなたは実行できません。', ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({ content: 'ロールの管理権限がありません。', ephemeral: true });
        }

        if (interaction.guild.members.me.roles.highest.comparePositionTo(role) <= 0) {
            return interaction.reply({ content: 'botロールより上のロールは付与できません。', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('ロールを付与する')
            .setDescription(`このボタンを押してロール ${role.name} を取得します。`)
            .setColor(role.color);

        const button = new ButtonBuilder()
            .setCustomId(role.id)
            .setLabel('ロールを付与')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);

        await interaction.reply({ embeds: [embed], components: [row]});
    },
};
