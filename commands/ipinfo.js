const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ip-info')
        .setDescription('指定したIPアドレスの情報を取得します')
        .addStringOption(option => 
            option.setName('ip')
                .setDescription('IPアドレス')
                .setRequired(true)),
    async execute(interaction) {
        const ip = interaction.options.getString('ip');

        try {
              const configData = fs.readFileSync('config.json');
              const config = JSON.parse(configData);
              const ip_api = config.ip_api;
            
            const response = await axios.get(`https://ipinfo.io/${ip}?token=${ip_api}`);
            const data = response.data;

            const embed = new EmbedBuilder()
                .setTitle('IPの情報')
                .setColor(0xf8b4cb)
                .addFields(
                    { name: 'IPアドレス', value: data.ip },
                    { name: '都市', value: data.city, inline:true },
                    { name: '地域', value: data.region, inline:true },
                    { name: '国', value: data.country, inline:true },
                    { name: '緯度/経度', value: data.loc, inline:true },
                    { name: 'タイムゾーン', value: data.timezone, inline:true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('none ip');
            await interaction.reply('IP情報の取得に失敗しました。');
        }
    },
};
