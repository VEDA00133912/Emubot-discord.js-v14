// https://x.gd/view/developerでAPIキーを取得してください

const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('short')
        .setDescription('URLを短縮します')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('短縮したいURLを入力してください')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        
        const urlToShorten = interaction.options.getString('url');
        const apiKey = config.xgdApiKey;
        try {
            const response = await axios.get(`https://xgd.io/V1/shorten?url=${encodeURIComponent(urlToShorten)}&key=${apiKey}`);
            if (response.status === 200 && response.data.status === 200) {
                const shortenedUrl = response.data.shorturl;
                await interaction.editReply(`短縮URL: <${shortenedUrl}>`);
            } else {
                await interaction.editReply('URLの短縮に失敗しました。');
            }
        } catch (error) {
            console.error(error);
            await interaction.editReply('URLの短縮に失敗しました。');
        }
    },
};
