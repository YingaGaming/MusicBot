const { SlashCommandBuilder } = require('@discordjs/builders');

const player = require('../util/player')

module.exports.run = async(client, interaction) => {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        interaction.reply({ content: "Das dürfen nur Admins!", ephemeral: true })
        return
    }

    player.resume()

    interaction.reply('Musik wird abgespielt!')

}

module.exports.builder = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Musik abspielen')