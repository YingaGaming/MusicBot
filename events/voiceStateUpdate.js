const player = require('../util/player')

module.exports = async(client, oldState, newState) => {
    if (newState.member.id == client.user.id && newState.channel) player.setChannel(newState.channel)

    if (player.getChannel() && !oldState.channel && newState.channel && newState.member.user.bot && newState.member.id != client.user.id && newState.channel.id == player.getChannel().id) {
        console.log('Pausing for bot')
        player.pause()
    }

    if (player.getChannel() && oldState.channel && (!newState.channel || newState.channel.id != player.getChannel().id) && newState.member.user.bot && newState.member.id != client.user.id) {
        console.log('Unpausing for bot')
        player.resume()
    }

//     console.log(`
// player.getChannel() | ${player.getChannel() != undefined}
// oldState.channel | ${oldState.channel != undefined}
// newState.channel | ${newState.channel != undefined}
// bot | ${newState.member.user.bot}
// not self | ${newState.member.id != client.user.id}
//     `)

//     if (player.getChannel()) console.log(`same channel | ${newState.channel.id == player.getChannel().id}`)

}