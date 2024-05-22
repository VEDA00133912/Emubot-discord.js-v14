module.exports = {
    name: 'ready',
    execute(client) {
      console.log('nick,status,ActivitySettings ready');
      client.guilds.cache.forEach(guild => {
        guild.members.fetch(client.user.id)
          .then(member => {
            member.setNickname('えむちゃん')
              .then(() => console.log(`${guild.name}のニックネームが変更されました`))
              .catch(error => console.error(`${guild.name}のニックネームの変更中にエラーが発生しました:`, error));
          })
          .catch(error => console.error(`${guild.name}のメンバー情報の取得中にエラーが発生しました:`, error));
      });
      client.user.setStatus('online');
      setInterval(() => {
        const activities = ["えむbotだよ！", "翻訳を実装"];
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        client.user.setActivity(randomActivity);
      }, 10000);
    }
  };
  