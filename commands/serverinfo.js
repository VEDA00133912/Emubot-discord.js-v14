const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('サーバー情報の表示'),
    async execute(interaction) {
      const guild = interaction.guild;
      const serverIconUrl = guild.iconURL({ size: 1024 });
      const textChannelsCount = guild.channels.cache.filter(c => c.type === 0).size;
      const voiceChannelsCount = guild.channels.cache.filter(c => c.type === 2).size;
      const categoryChannelsCount = guild.channels.cache.filter(c => c.type === 4).size;
  
      const embed = new EmbedBuilder()
        .setColor(0xf8b4cb)
        .setTimestamp()
        .setThumbnail(serverIconUrl)
        .addFields(
          { name: "サーバーの名前", value: `${guild.name}` },
          { name: "サーバーのID", value: `${guild.id}`, inline: true },
          { name: "鯖主 👑", value: `<@${guild.ownerId}>` },
          { name: "チャンネル数", value: `text 🗣: **${textChannelsCount}**\nvoice 🎤: **${voiceChannelsCount}**\ncategory: **${categoryChannelsCount}**`, inline: true },
          { name: "メンバー数", value: `user 👪:**${guild.memberCount}**\nbot 🤖: **${guild.members.cache.filter(m => m.user.bot).size}**\nロール:**${guild.roles.cache.size}**`, inline: true }
        );
  
      await interaction.reply({ embeds: [embed] });
    }
  };
