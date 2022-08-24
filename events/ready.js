const player = require('../util/player')
const downloader = require('../util/downloader')
const ms = require('ms')
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs')

const config = require('../config')

const rest = new REST({ version: '9' }).setToken(config.token);

module.exports = async (client) => {
    
    loadCommands(client)

    downloader.sync()
    setInterval(() => {
        downloader.sync()
    }, ms(config.syncInterval))

    channel = client.channels.resolve(config.channel)
    await player.connect(channel)
    player.play()

}

async function loadCommands(client) {

    console.log('Loading commands')

    client.commands = {}

    // Get all file names in commands dir
    await fs.readdir('./commands/', (err, files) => {

        if (err) {
            console.error('Unable to load commands. ' + err.message)
            process.exit()
        }

        let builders = [] // List of command builders for registering with Discord

        files.forEach(file => {

            // Ignore non-js files
            if (!file.endsWith('.js')) return

            // Parse command name from file name
            let name = file.split('.')[0]

            // Load command
            let command = require(`../commands/${file}`)

            // Add command to commands object
            client.commands[name] = command

            // Add to list for registering globally
            builders.push(command.builder)

            console.log(`Loaded command ${name} successfully`)

        })

        // Register commands as global slash commands
        rest.put(Routes.applicationCommands(client.user.id), { body: builders }).catch(err => { console.error(err) })
        console.log('Commands registered')

    })
}