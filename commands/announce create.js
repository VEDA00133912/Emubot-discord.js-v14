const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announcecreate')
        .setDescription('お知らせをするえむbot開発室を作ります'),
    async execute(interaction) {
        const guild = interaction.guild;
        const channelName = 'えむbot開発室';

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: 'あなたに実行権限が有りません。', ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: 'チャンネルの作成権限がありません。', ephemeral: true });
        }

        const existingChannel = guild.channels.cache.find(channel => channel.name === channelName && channel.type === 0);

        if (existingChannel) {
            await interaction.reply({ content: 'The channel "えむbot開発室" already exists.', ephemeral: true });
        } else {
            try {
                const createdChannel = await guild.channels.create({
                    name: channelName,
                    type: 0
                });
                await interaction.reply('えむbot開発室を作りました');
            } catch (error) {
                console.error('Error creating channel:', error);
                await interaction.reply({ content: 'エラーが発生しました', ephemeral: true });
            }
        }
    },
};
