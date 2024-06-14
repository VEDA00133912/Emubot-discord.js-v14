const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ip')
        .setDescription('Performs an IP lookup')
        .addStringOption(option =>
            option.setName('ip')
                .setDescription('The IP address to lookup')
                .setRequired(true)),
    async execute(interaction) {
        const ip = interaction.options.getString('ip');

        try {
            const configData = fs.readFileSync('config.json');
            const config = JSON.parse(configData);
            const ip2_API = config.ip_API;
            
            const response = await axios.get(`https://api.ip2location.io/?key=${ip2_API}&ip=${ip}`);
            const data = response.data;

            const embed = new EmbedBuilder()
                .setTitle(`IP Lookup for ${ip}`)
                .addFields(
                    { name: '国', value: data.country_name || 'None', inline: true },
                    { name: '地域', value: data.region_name || 'None', inline: true },
                    { name: '都市', value: data.city_name || 'None', inline: true },
                    { name: '緯度', value: data.latitude ? data.latitude.toString() : 'None', inline: true },
                    { name: '経度', value: data.longitude ? data.longitude.toString() : 'None', inline: true },
                    { name: 'タイムゾーン', value: data.time_zone || 'None', inline: true },
                    { name: 'ASN', value: data.asn || 'None', inline: true },
                    { name: 'ISP', value: data.isp || 'None', inline: true }
                )
                .setColor(0xf8b4cb)
                .setFooter({ text:"Emutest | ip lookup" })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.log('ip error');
            await interaction.reply({ contetnt:'IP検索エラーです', ephemeral:true });
        }
    },
};
