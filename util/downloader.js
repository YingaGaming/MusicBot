const ytdl = require('yt-dlp-exec')
const fs = require('fs')

const ytinfo = require('./youtube-info')

const config = require('../config')

module.exports.download = async() => {

    ytdl(`https://youtube.com/channel/${config.ytChannel}/playlists`, {
            noOverwrites: true,
            output: `./music/%(playlist)s/%(title)s.%(ext)s`,
            format: 'ba',
            extractAudio: true,
            audioFormat: 'mp3',
            writeInfoJson: true,
            writePlaylistMetafiles: true
        })
        .catch(err => {return})

}

module.exports.purge = async() => {

    let dirs = fs.readdirSync('./music', { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

    dirs.forEach(dir => {
        let data

        try {
            data = require(`../music/${dir}/${dir}.info.json`)
        } catch (error) {
            return
        }

        let playlistId = data.id

        ytinfo.playlist(playlistId, items => {
            if (!items || items.length == 0) return

            let files = fs.readdirSync(`./music/${dir}`).filter(file => file.endsWith('.mp3'))

            files.forEach(file => {

                let name = file.split('.mp3')[0]

                let data

                try {
                    data = require(`../music/${dir}/${name}.info.json`)
                } catch (error) {
                    return
                }

                if(data['wilfred-keep'])return

                if (!items.filter(item => {
                        return item.title == data.title
                    })[0]) {
                    console.log(`Deleting ${name} from ${dir}`)
                    fs.unlinkSync(`./music/${dir}/${name}.mp3`)
                    fs.unlinkSync(`./music/${dir}/${name}.info.json`)
                }

            })

        })

    })

}

module.exports.sync = async () => {
    this.purge()
    this.download()
}