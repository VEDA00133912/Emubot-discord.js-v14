const { SlashCommandBuilder, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verifypanel')
        .setDescription('認証パネル')
        .addRoleOption(option => option.setName('role').setDescription('ロール').setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({ content: 'あなたにこのコマンドを実行する権限がありません。', ephemeral: true });
        }

        const role = interaction.options.getRole('role');

        const buttons = new ActionRowBuilder()
            .addComponents( 
                new ButtonBuilder()
                    .setCustomId('button')
                    .setLabel('認証！') 
                    .setStyle(ButtonStyle.Primary)
            );

        const guildName = interaction.guild.name; 
        const embed = new EmbedBuilder()
            .setColor(0xf8b4cb)
            .addFields(
                { name: `${guildName}：認証パネル`, value: `${role.toString()}` } 
            );

        await interaction.reply({ embeds: [embed], components: [buttons] });

        const collector = interaction.channel.createMessageComponentCollector();

        collector.on('collect', async (i) => {
            const member = i.member;

            try {
                if (!member) {
                    throw new Error("メンバー情報を取得できませんでした。");
                }

                if (i.guild.members.me.roles.highest.position < role.position && i.customId === 'button') {
                    throw new Error("botのロールがそのロールよりも下にあるため、付与ができませんでした");
                }

                if (i.customId === 'button') {
                    await member.roles.add(role);
                    i.reply({ content: `認証しました<a:1196945710009036821:1247370449604841492>`, ephemeral: true }); 
                }
            } catch (error) {
                console.error(error);
                i.reply({ content: error.message, ephemeral: true });
            }
        });
    }
};
