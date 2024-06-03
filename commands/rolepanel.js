const { SlashCommandBuilder, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolepanel')
        .setDescription('ロール付与パネル')
        .addRoleOption(option => option.setName('role1').setDescription('ロール1').setRequired(true))
        .addRoleOption(option => option.setName('role2').setDescription('ロール2').setRequired(false))
        .addRoleOption(option => option.setName('role3').setDescription('ロール3').setRequired(false))
        .addRoleOption(option => option.setName('role4').setDescription('ロール4').setRequired(false))
        .addRoleOption(option => option.setName('role5').setDescription('ロール5').setRequired(false))
        .addStringOption(option => option.setName('embed_name').setDescription('ロールパネルの名前').setRequired(false)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({ content: 'あなたにこのコマンドを実行する権限がありません。', ephemeral: true });
        }

        const roles = [];
        const buttons = new ActionRowBuilder();
        const embed = new EmbedBuilder().setColor(0xf8b4cb);

        let rolesDescription = "";

        const emojis = ['🇦', '🇧', '🇨', '🇩', '🇪']; // Define emojis to use as labels

        for (let i = 0; i < 5; i++) {
            const role = interaction.options.getRole(`role${i + 1}`);
            if (role) {
                roles.push(role);
                buttons.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`button${i + 1}`)
                        .setLabel(emojis[i]) // Use emojis as labels
                        .setStyle(ButtonStyle.Secondary)
                );
                rolesDescription += `${emojis[i]} : ${role.toString()}\n`; // Use emojis as labels
            }
        }

        const fieldsName = interaction.options.getString('embed_name') || 'Roles';
        embed.addFields({ name: fieldsName, value: rolesDescription });

        await interaction.reply({ embeds: [embed], components: [buttons] });

        const collector = interaction.channel.createMessageComponentCollector();

        collector.on('collect', async (i) => {
            const member = i.member;

            for (let j = 0; j < roles.length; j++) {
                const role = roles[j];

                if (i.guild.members.me.roles.highest.position < role.position && i.customId === `button${j + 1}`) {
                    i.reply({ content: "botのロールがそのロールよりも下にあるため、付与ができませんでした", ephemeral: true });
                    return;
                }

                if (i.customId === `button${j + 1}`) {
                    await member.roles.add(role);
                    i.reply({ content: `ロールを付与しました ${role.toString()}`, ephemeral: true });
                    return;
                }
            }
        });
    }
};
