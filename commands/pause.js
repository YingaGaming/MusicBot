const { SlashCommandBuilder } = require('@discordjs/builders');

const player = require('../util/player')

module.exports.run = async(client, interaction) => {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        interaction.reply({ content: "Das dürfen nur Admins!", ephemeral: true })
        return
    }

    player.pause()

    interaction.reply('Musik pausiert!')

}

module.exports.builder = new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Musik pausieren')