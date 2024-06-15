const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = message.content.match(urlRegex);

    if (urls) {
      for (const url of urls) {
        if (url.includes('discord.com/channels/')) {
          const urlParts = url.split('/');
          const guildId = urlParts[urlParts.indexOf('channels') + 1];
          const channelId = urlParts[urlParts.indexOf('channels') + 2];
          const messageId = urlParts[urlParts.indexOf('channels') + 3];

          try {
            const fetchedMessage = await client.guilds.cache.get(guildId)?.channels.cache.get(channelId)?.messages.fetch(messageId);

            if (fetchedMessage) {
              const messageContent = fetchedMessage.content;
              const hasEmbed = Boolean(fetchedMessage.embeds.length);
              const hasAttachment = Boolean(fetchedMessage.attachments.size);

              if (!messageContent && hasEmbed) {
                console.log(`Error: Fetched message only contains an embed.`);
                return;
              }

              const embed = new EmbedBuilder()
                .setColor(0xf8b4cb)
            .setTimestamp(fetchedMessage.createdTimestamp)
                .setAuthor({ name: fetchedMessage.author.tag, iconURL: fetchedMessage.author.displayAvatarURL() });

              if (hasAttachment) {
                const attachment = fetchedMessage.attachments.first();
                if (attachment.contentType.startsWith('image/')) {
                  embed.setImage(attachment.proxyURL);
                } else if (attachment.contentType.startsWith('video/')) {
                  embed.addFields({ name: 'Video', value: `[動画ファイル](${attachment.proxyURL})` });
                } else {
                  embed.addFields({ name: 'File', value: `[${attachment.name}](${attachment.proxyURL})` });
                }
              }
                  if (messageContent) {
                    embed.setDescription(messageContent);
                  }

              message.channel.send({ embeds: [embed] });
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
  }
};
