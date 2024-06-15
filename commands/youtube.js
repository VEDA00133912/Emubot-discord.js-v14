// https://scrapbox.io/discordjs-japan/ytdl-coreytdl-core を使用して YouTube の音源を配信するサンプル をいじっただけ

const { SlashCommandBuilder, EmbedBuilder,PermissionsBitField } = require('discord.js');
const { entersState, AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, StreamType } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('youtube-play')
        .setDescription('指定されたYouTube動画を再生します')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('再生するYouTube動画のURL')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();

        const url = interaction.options.getString('url');

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Connect)) {
            return interaction.reply({ content: 'ボイスチャンネルの接続権限が有りません', ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Speak)) {
            return interaction.reply({ content: 'ボイスチャンネルの発言権限が有りません', ephemeral: true });
        }

        if (!ytdl.validateURL(url)) {
            return interaction.editReply(`${url}は処理できません。`);
        }

        const channel = interaction.member.voice.channel;
        if (!channel) {
            return interaction.editReply('先にボイスチャンネルに参加してください！');
        }

        let connection;
        try {
            connection = joinVoiceChannel({
                adapterCreator: channel.guild.voiceAdapterCreator,
                channelId: channel.id,
                guildId: channel.guild.id,
                selfDeaf: true,
                selfMute: false,
            });

            const player = createAudioPlayer();
            connection.subscribe(player);

            const stream = ytdl(ytdl.getURLVideoID(url), {
                filter: format => format.audioCodec === 'opus' && format.container === 'webm',
                quality: 'highest',
                highWaterMark: 32 * 1024 * 1024,
            });

            const resource = createAudioResource(stream, {
                inputType: StreamType.WebmOpus,
            });

            player.play(resource);

            await entersState(player, AudioPlayerStatus.Playing, 10 * 1000);

            const embed = new EmbedBuilder()
                .setColor(0xf8b4cb)
                .setTitle('再生中の動画')
                .setDescription(`[この動画](${url})を再生しています <a:1178108287913316473:1251369287256637530>`)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

            await entersState(player, AudioPlayerStatus.Idle, 24 * 60 * 60 * 1000);
        } catch (error) {
            console.error('エラーが発生しました:', error);
            await interaction.editReply('エラーが発生しました。もう一度試してください。');
            if (connection) connection.destroy();
            return;
        }

        connection.destroy();
    },
};
