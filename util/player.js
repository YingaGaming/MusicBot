const fs = require('fs')

const {
    createAudioPlayer,
    joinVoiceChannel,
    VoiceConnectionStatus,
    createAudioResource,
    entersState,
    StreamType,
    AudioPlayerStatus
} = require('@discordjs/voice')

const config = require('../config')

var queue = []
var channel
var directory = config.defaultDir

const player = createAudioPlayer()
var resource
var volume = 0.25

player.on('stateChange', (oldState, newState) => {
    if (oldState.status != AudioPlayerStatus && newState.status == AudioPlayerStatus.Idle) {
        process.nextTick(() => {
            play()
        })
    }
})

player.on('error', err => {
    console.error(err)
    process.nextTick(() => {
        play()
    })
})

function setChannel(newChannel) {
    channel = newChannel
}

function setDirectory(dir) {
    directory = dir
    queue = []
}

async function play() {

    if (!queue[0]) {
        let files = fs.readdirSync('./music/' + directory)

        for (let file of files) {
            if (file.endsWith('.mp3')) {
                queue.push({
                    path: `./music/${directory}/${file}`,
                    title: file.split('.mp3')[0]
                })
            }
        }

        queue = shuffle(queue)

    }

    song = queue[0]
    queue.shift()

    console.log(`Playing ${song.title}`)

    process.client.user.setPresence({
        status: 'online',
        activities: [{
            name: song.title,
            type: 'PLAYING'
        }]
    })

    resource = createAudioResource(song.path, {
        inputType: StreamType.Arbitrary,
        inlineVolume: true
    })

    resource.volume.setVolume(volume)

    player.play(resource)

}

async function connect(customChannel) {

    if (customChannel) setChannel(customChannel)

    let connection = await joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator
    })

    connection.on('error', err => {
        console.error(err)
        connection.destroy()
        process.nextTick(() => {
            connect()
        })
    })

    connection.on('stateChange', (oldState, newState) => {
        if (newState.status == VoiceConnectionStatus.Destroyed || newState.status == VoiceConnectionStatus.Disconnected) {
            process.nextTick(() => {
                connect()
            })
        }
    })

    try {
        await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
        connection.subscribe(player)
    } catch (error) {
        connection.destroy();
        throw error;
    }

}

function pause() {
    player.pause()
}

function resume() {
    player.unpause()
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function getChannel() {
    return channel
}

function setVolume(newVolume) {
    volume = newVolume
    resource.volume.setVolume(newVolume)
}

module.exports = {
    setChannel,
    connect,
    play,
    setDirectory,
    pause,
    resume,
    getChannel,
    setVolume
}