module.exports = {
    name: 'guildCreate',
    execute(guild, client) {
      const targetChannelId = "1236430386427334848"; // 通知を送信するチャンネルのID
      try {
        const targetChannel = client.channels.cache.get(targetChannelId);
        if (targetChannel) {
          targetChannel.send(` ${guild.name}に参加したよ！`);
        }
      } catch (error) {
        console.error("参加通知エラーです:", error);
      }
    }
  };
  