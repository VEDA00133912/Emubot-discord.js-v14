module.exports = {
    name: 'messageCreate',
    execute(message, client) {
      const targetChannelId = '1236430386427334848'; 
      if (message.channel.id === targetChannelId) {
        const targetMessage = message.content;
        client.guilds.cache.forEach(guild => {
          const targetChannel = guild.channels.cache.find(channel => channel.type === 0 && channel.name === 'えむbot開発室');
          if (targetChannel) {
            targetChannel.send(targetMessage)
              .then(() => console.log("メッセージ転送したよ"))
              .catch(error => console.error("メッセージの転送中にエラーでたよ:", error));
          }
        });
      }
    }
  };
  