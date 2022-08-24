const { SlashCommandBuilder } = require('@discordjs/builders');

const downloader = require('../util/downloader')

module.exports.run = async(client, interaction) => {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        interaction.reply({ content: "Das dürfen nur Admins!", ephemeral: true })
        return
    }

    downloader.sync()

    interaction.reply('YouTube Playlists werden synchronisiert...')

}

module.exports.builder = new SlashCommandBuilder()
    .setName('sync')
    .setDescription('Synchronisiere YouTube Playlists')