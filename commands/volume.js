const { SlashCommandBuilder } = require('@discordjs/builders');

const player = require('../util/player')

module.exports.run = async(client, interaction) => {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        interaction.reply({ content: "Das dürfen nur Admins!", ephemeral: true })
        return
    }

    let volume = parseInt(interaction.options.get('volume', true).value)

    if (isNaN(volume)) {
        interaction.reply('Ungültige Lautstärke')
        return
    }

    parsedVolume = volume / 100

    player.setVolume(parsedVolume)

    interaction.reply(`Lautstärke wurde auf **${volume}%** gesetzt!`)

}

module.exports.builder = new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Lautstärke ändern')
    .addStringOption(option =>
        option.setName('volume')
        .setDescription('Lautstärke (0-100)')
        .setRequired(true)
    )