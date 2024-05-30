const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('ユーザーの検索')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('ユーザーIDかメンションを入力してください')
                .setRequired(true)),
    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user');

            if (!user) {
                return interaction.reply('ユーザーが見つかりませんでした。');
            }
        
            const embed = new EmbedBuilder()
                .setColor(0xf8b4cb)
                .setTitle('ユーザー情報')
                .setThumbnail(user.displayAvatarURL({ size: 1024 }))
                .addFields(
                    { name: 'ユーザー名', value: user.tag},
                    { name: 'ユーザーID', value: user.id, inline: true },
                    { name: 'アカウント作成日', value: user.createdAt ? `${user.createdAt.toLocaleString('ja-JP')}` : '未設定', inline: true},
                    { name: 'プロフィール', value: `<@${user.id}>`}
                );

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('エラーが発生しました。コマンドを実行できませんでした。');
        }
    },
};
