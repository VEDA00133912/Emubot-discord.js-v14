const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
const { entersState, AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, StreamType, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

let player;
let connection;
let currentStream;
let pausedResource;
let isPaused = false;

const isConnectionDestroyed = (connection) => {
    return !connection || connection.state.status === VoiceConnectionStatus.Destroyed;
};

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
            return interaction.editReply({ content: 'ボイスチャンネルの接続権限がありません', ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Speak)) {
            return interaction.editReply({ content: 'ボイスチャンネルの発言権限がありません', ephemeral: true });
        }

        if (!ytdl.validateURL(url)) {
            return interaction.editReply(`${url}は処理できません。`);
        }

        const channel = interaction.member.voice.channel;
        if (!channel) {
            return interaction.editReply('先にボイスチャンネルに参加してください！');
        }

        const playStream = async (url) => {
            if (currentStream) currentStream.destroy();
            currentStream = ytdl(ytdl.getURLVideoID(url), {
                filter: format => format.audioCodec === 'opus' && format.container === 'webm',
                quality: 'highest',
                highWaterMark: 32 * 1024 * 1024,
            });

            const resource = createAudioResource(currentStream, {
                inputType: StreamType.WebmOpus,
            });

            player.play(resource);
            pausedResource = null;
            isPaused = false;
            await entersState(player, AudioPlayerStatus.Playing, 10 * 1000);
        };

        if (connection) {
            try {
                player.stop();
            } catch (error) {
                console.error('エラーが発生しました:', error);
                await interaction.followUp({ content: '再生を停止中にエラーが発生しました。', ephemeral: true });
            }
        } else {
            try {
                connection = joinVoiceChannel({
                    adapterCreator: channel.guild.voiceAdapterCreator,
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    selfDeaf: true,
                    selfMute: false,
                });

                player = createAudioPlayer();
                connection.subscribe(player);

                connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
                    try {
                        await Promise.race([
                            entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                            entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
                        ]);
                    } catch (error) {
                        console.error('切断時のエラー:', error);
                        connection.destroy();
                    }
                });

                player.on(AudioPlayerStatus.Idle, async () => {
                    if (!isPaused && interaction.loop) {
                        await playStream(url);
                    } else {
                        connection.destroy();
                        connection = null;
                    }
                });
            } catch (error) {
                console.error('接続の確立中にエラーが発生しました:', error);
                await interaction.followUp({ content: '接続の確立中にエラーが発生しました。', ephemeral: true });
            }
        }

        try {
            await playStream(url);

            const embed = new EmbedBuilder()
                .setColor(0xf8b4cb)
                .setTitle('再生中の動画')
                .setDescription(`[この動画](${url})を再生しています <a:1178108287913316473:1251369287256637530>`)
                .setTimestamp();

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('play')
                        .setLabel('再生')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('pause')
                        .setLabel('一時停止')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId('loop')
                        .setLabel('ループ')
                        .setStyle(ButtonStyle.Secondary)
                );

            await interaction.editReply({ embeds: [embed], components: [row] });

            const filter = i => i.customId === 'play' || i.customId === 'pause' || i.customId === 'loop';
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 10800000  });

            collector.on('collect', async i => {
                try {
                    await i.deferUpdate(); 

                    if (i.customId === 'play') {
                        if (isPaused && pausedResource) {
                            player.unpause(pausedResource); 
                            isPaused = false;
                        } else {
                            await playStream(url);
                        }
                        await i.followUp({ content: '再生を開始しました。', ephemeral: true });
                    } else if (i.customId === 'pause') {
                        if (player.state.status === AudioPlayerStatus.Playing) {
                            pausedResource = player.pause(); 
                            isPaused = true;
                        }
                        await i.followUp({ content: '再生を一時停止しました。', ephemeral: true });
                    } else if (i.customId === 'loop') {
                        interaction.loop = !interaction.loop;
                        await i.followUp({ content: `ループは${interaction.loop ? '有効' : '無効'}になりました。`, ephemeral: true });
                    }
                } catch (error) {
                    console.error('ボタンインタラクションの処理中にエラーが発生しました:', error);
                    if (error.code === 10062) { 
                        await i.followUp({ content: 'インタラクションが無効です。もう一度試してください。', ephemeral: true });
                    } else {
                        await i.followUp({ content: 'エラーが発生しました。もう一度試してください。', ephemeral: true });
                    }
                }
            });

            collector.on('end', collected => {
                console.log(`Collected ${collected.size} interactions.`);
            });

            interaction.client.on(Events.VoiceStateUpdate, (oldState, newState) => {
                if (oldState.channelId && !newState.channelId && oldState.member.id === interaction.member.id) {
                    if (connection && !isConnectionDestroyed(connection)) {
                        connection.destroy();
                        connection = null;
                    }
                }
            });

        } catch (error) {
            console.error('エラーが発生しました:', error);
            await interaction.editReply('エラーが発生しました。もう一度試してください。');
            if (connection && !isConnectionDestroyed(connection)) {
                try {
                    connection.destroy();
                } catch (error) {
                    if (error.message !== "Cannot destroy VoiceConnection - it has already been destroyed") {
                        console.error('VoiceConnectionの破棄中にエラーが発生しました:', error);
                    }
                }
            }
            connection = null;
        }
    }
};
