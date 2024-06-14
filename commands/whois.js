const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('whois')
        .setDescription('Performs a WHOIS lookup')
        .addStringOption(option =>
            option.setName('domain')
                .setDescription('The domain to lookup')
                .setRequired(true)),
    async execute(interaction) {
        const domain = interaction.options.getString('domain');

        try {
            const configData = fs.readFileSync('config.json');
            const config = JSON.parse(configData);
            const ip2_API = config.ip_API;
            const response = await axios.get(`https://api.ip2whois.com/v2?key=${ip2_API}&domain=${domain}`);
            const data = response.data;

            const embed = new EmbedBuilder()
                .setTitle(`WHOIS Lookup for ${domain}`)
                .addFields(
                    { name: '作成日', value: data.create_date || 'None' },
                    { name: '更新日', value: data.update_date || 'None' },
                    { name: '有効期限', value: data.expire_date || 'None' },
                    { name: '登録者名', value: data.registrant.name || 'None' },
                    { name: '登録者地域', value: data.registrant.city || 'None' },
                    { name: 'email', value: data.registrant.email || 'None' },
                )
                .setColor(0xf8b4cb)
                .setFooter({ text: "Emutest | whois"})
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.log('whois error');
            await interaction.reply({ content:'whois検索に失敗しました', ephemeral:true });
        }
    },
};
