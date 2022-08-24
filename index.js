const { Intents, Client } = require('discord.js')
const ms = require('ms')
const fs = require('fs')

const config = require('./config')

let intents = new Intents()

intents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.DIRECT_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_WEBHOOKS)

const client = new Client({
    intents: intents
})

process.client = client

loadEvents()

async function loadEvents() {

    console.log('Loading events')

    await fs.readdir('./events/', (err, files) => {

        if (err) {
            console.error('Unable to load events. ' + err.message)
            process.exit()
        }

        files.forEach(file => {

            if (!file.endsWith('.js')) return

            let name = file.split('.')[0]

            let event = require(`./events/${file}`)

            client.on(name, event.bind(null, client))

            console.log(`Loaded event ${name} successfully`)

        })

    })

}

client.login(config.token)