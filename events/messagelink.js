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
                const embed = new EmbedBuilder()
                  .setAuthor({ name: fetchedMessage.author.tag, iconURL: fetchedMessage.author.displayAvatarURL() }) 
                  .setDescription(fetchedMessage.content)
                  .setColor(0xf8b4cb)
                  .setTimestamp(fetchedMessage.createdTimestamp); 
  
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
  