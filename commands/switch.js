const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu } = require('discord.js')
const fs = require('fs')

module.exports.run = async(client, interaction) => {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        interaction.reply({ content: "Das dürfen nur Admins!", ephemeral: true })
        return
    }
    interaction.reply({
        ephemeral: true,
        content: 'Wähle eine Playlist',
        components: [
            new MessageActionRow().addComponents(
                new MessageSelectMenu()
                .setCustomId('switch-menu')
                .addOptions(loadOptions())
            )
        ]
    })
}

function loadOptions() {

    let options = []

    let rawDirs = fs.readdirSync('./music', { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

    rawDirs.forEach(dir => {
        let files = fs.readdirSync(`./music/${dir}`).filter(file => file.endsWith('.mp3'))

        if(files.length == 0)return

        options.push({
            label: dir,
            description: `${files.length} Songs`,
            value: dir
        })

    })

    return options

}

module.exports.builder = new SlashCommandBuilder()
    .setName('switch')
    .setDescription('Ändere die Playlist')