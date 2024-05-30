const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announcecreate')
        .setDescription('お知らせをするえむbot開発室を作ります'),
    async execute(interaction) {
        const guild = interaction.guild;
        const channelName = 'えむbot開発室';

        // Check if the channel already exists
        const existingChannel = guild.channels.cache.find(channel => channel.name === channelName && channel.type === 0);

        if (existingChannel) {
            await interaction.reply('The channel "えむbot開発室" already exists.');
        } else {
            try {
                // Create the channel
            const createdchannel = await guild.channels.create({
                "name": "えむbot開発室",
                "type": 0
            });
                await interaction.reply('えむbot開発室を作りました');
            } catch (error) {
                console.error('Error creating channel:', error);
                await interaction.reply('エラーです。権限などを確認してください');
            }
        }
    },
};
