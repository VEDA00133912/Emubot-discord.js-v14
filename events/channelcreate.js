module.exports = {
    name: 'guildCreate',
    async execute(guild) {
      const channelExists = guild.channels.cache.some(channel => channel.name === 'えむbot開発室' && channel.type === 0);
  
      if (!channelExists) {
        try {
            const channel = await guild.channels.create({
                "name": "えむbot開発室",
                "type": 0
            });
            console.log(`チャンネルを作ったよ: ${channel.name} (${channel.id})`);
            await channel.send('botのお知らせ用チャンネルです。消さないでくれると嬉しいです(?)');
        } catch (error) {
            console.error(`チャンネルを作れなかったよ: ${guild.name}:${guild.id}`, error);
        }
    }
}
};