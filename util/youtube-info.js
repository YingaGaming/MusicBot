const ypi = require('youtube-playlist-info');

const config = require('../config')

module.exports.playlist = (id, cb) => {

    ypi(config.ytKey, id).then(items => {
        cb(items)
    }).catch(err => {
        cb()
    });

}