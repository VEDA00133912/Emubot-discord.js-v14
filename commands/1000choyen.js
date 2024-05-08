// https://qiita.com/narikakun/items/74e24c92709d7364ef9e様のをパクってます(((((
const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('1000choyen')
		.setDescription('1000兆円画像生成'),
	async execute(interaction) {
		const modal = new ModalBuilder()
			.setCustomId('1000choyen')
			.setTitle('1000兆円画像生成');

		const topInput = new TextInputBuilder()
			.setCustomId('topInput')
			.setLabel("上部文字列")
			.setStyle(TextInputStyle.Short);

		const bottomInput = new TextInputBuilder()
			.setCustomId('bottomInput')
			.setLabel("下部文字列")
			.setStyle(TextInputStyle.Short);

		modal.addComponents(new ActionRowBuilder().addComponents(topInput), new ActionRowBuilder().addComponents(bottomInput));

		await interaction.showModal(modal);
		const filter = (mInteraction) => mInteraction.customId === '1000choyen';
		interaction.awaitModalSubmit({ filter, time: 360000 })
			.then(async mInteraction => {
				const top = mInteraction.fields.getTextInputValue('topInput');
				const bottom = mInteraction.fields.getTextInputValue('bottomInput');
				mInteraction.reply({
					embeds: [{
						image: {
							url: `https://gsapi.cbrx.io/image?top=${encodeURIComponent(top)}&bottom=${encodeURIComponent(bottom)}&type=png`
						}
					}]
				})
			})
			.catch(console.error);
	},
};
