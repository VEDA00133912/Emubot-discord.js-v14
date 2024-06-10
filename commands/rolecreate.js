const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rolecreate')
    .setDescription('新しいロールを作成します。')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('作成するロールの名前')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('color')
        .setDescription('作成するロールの色（カラーコードで指定）')
        .setRequired(false)
    ),
  async execute(interaction) {
    try {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        return interaction.reply({ content: 'あなたにこのコマンドを実行する権限がありません。', ephemeral: true });
      }
      const name = interaction.options.getString('name');
      const color = interaction.options.getString('color');

      let roleColor;
      if (color) {
        roleColor = color.toUpperCase();
      } else {
        roleColor = '#99AAB5';
      }
      const createdRole = await interaction.guild.roles.create({
        name: name,
        color: roleColor,
      });

      const embed = new EmbedBuilder()
        .setColor(0xf8b4cb)
        .setTitle('作成完了!')
        .setDescription(`作成したロール: <@&${createdRole.id}>`);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply('エラーが発生しました。役割の作成に失敗しました。');
    }
  },
};
