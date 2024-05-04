// https://www.youtube.com/watch?v=sDfjMzEnSZQ 参考(一部変更しただけ)にさせていただきました

const { ButtonStyle, ActionRowBuilder,ButtonBuilder,ComponentType } = require('discord.js'); 

async function buttonPages(interaction,pages,time = 60000)
{
  // エラーメッセージ
  if (!interaction) throw new Error("interactionが提供されていません");
  if (!pages) throw new Error("ページの引数の未記入エラー");
  if (!Array.isArray(pages)) throw new Error("ページが配列でないエラー");

  if (typeof time !== "number") throw new Error("時間は数字でないといけません");
  if (parseInt(time) < 3000)
    throw new Error("30秒以上でないといけません");

  await interaction.deferReply();

  if (pages.length === 1){
    const page = await interaction.editReply({
      embeds: pages,
      components: [],
      fetchReply:true,
    });
    return page;
  }

  // ボタン
  const prev = new ButtonBuilder()
  .setCustomId("prev")
  .setEmoji("◀")
  .setStyle(ButtonStyle.Primary)
  .setDisabled(true);

  const home = new ButtonBuilder()
  .setCustomId("home")
  .setLabel("最初に戻る")
  .setStyle(ButtonStyle.Danger)
  .setDisabled(true);

  const next = new ButtonBuilder()
  .setCustomId("next")
  .setEmoji("▶")
  .setStyle(ButtonStyle.Primary);

  const buttonRow = new ActionRowBuilder().addComponents(prev,home,next);
  let index = 0

  const currentPage = await interaction.editReply({
    embeds:[pages[index]],
    components:[buttonRow],
    fetchReply: true,
    ephemeral: true
  });

  const collector = await currentPage.createMessageComponentCollector({
    componentType:ComponentType.button,
    time,
  });

  collector.on("collect",async (i) => {
    if (i.user.id !==interaction.user.id)
      return i.reply({
        content:"今は使えません",
        ephemeral: true,
      });

    // ボタンでページを切り替え
    await i.deferUpdate();

    if (i.customId === "prev") {
        if (index > 0) index--;
    } else if (i.customId === "home") {
        index = 0;
    } else if (i.customId === "next") {
    if (index < pages.length-1) index++;
    }

    if (index === 0) prev.setDisabled(true);
    else prev.setDisabled(false);

    if (index === 0) home.setDisabled(true);
    else home.setDisabled(false);

    if (index === pages.length-1) next.setDisabled(true);
    else next.setDisabled(false);

    await currentPage.edit({
          embeds: [pages [index]], 
          components: [buttonRow],
    });

    collector.resetTimer();
    });

  // 一定時間経過後メッセージの削除
  setTimeout(async () => {
      await currentPage.delete();
  }, time);

  return currentPage;
  }

module.exports = buttonPages;