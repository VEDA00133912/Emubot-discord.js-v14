module.exports = {
  name: 'messageCreate',
  execute(message, client) {
    const targetChannelId = '1236430386427334848'; 
    if (message.channel.id === targetChannelId) {
      const targetMessage = message.content;
      const sendPromises = [];
      client.guilds.cache.forEach(guild => {
        const targetChannel = guild.channels.cache.find(channel => channel.type === 0 && channel.name === 'えむbot開発室');
        if (targetChannel) {
          try {
            sendPromises.push(targetChannel.send(targetMessage));
          } catch (error) {
            console.error("メッセージの転送中にエラーが発生しました:", error);
          }
        }
      });

      Promise.all(sendPromises)
        .then(() => console.log("メッセージを同時に転送しました"))
        .catch(error => console.error("メッセージの転送中にエラーが発生しました:", error));
    }
  }
};
