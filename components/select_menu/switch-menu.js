const player = require('../../util/player')

module.exports.run = async (client, interaction) => {

    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        interaction.reply({ content: "Das dürfen nur Admins!", ephemeral: true })
        return
    }

    let dir = interaction.values[0]

    player.setDirectory(dir)

    interaction.reply(`Ich spiele nun **${dir}**`)

}