const https = require('https');

let regions = ['eu', 'us', 'kr', 'cn', 'global'];
let region = '';

module.exports = {
    getProfileByBattleTag: (battletag, emojis) => {
        return new Promise((resolve, reject) => {
            https.get(`https://api.lootbox.eu/pc/${encodeURI(region)}/${encodeURI(battletag.replace('#', '-'))}/profile`, res => {
                let data = '';
                res.on('data', d => {
                    data += d;
                });
                res.on('end', () => {
                    data = JSON.parse(data);
                    if (typeof data.statusCode === 'undefined') {
                        let info = data.data;
                        let message = `${info.username} - Level : ${info.level}`;
                        if (Object.keys(info.games.quick).length !== 0 && info.games.quick.constructor === Object) {
                            message += `\nQuick : ${info.games.quick.wins} wins - ${info.playtime.quick}`;
                        }
                        if (Object.keys(info.games.competitive).length !== 0 && info.games.competitive.constructor === Object) {
                            message += `\nCompetitive : `;
                            if (info.competitive.rank == null) {
                                message += `Unranked`;
                            } else {
                                message += `${info.competitive.rank} pts - ${emojis.find('name', rankToEmoji(info.competitive.rank_img))}`;
                            }
                            message += ` - ${info.playtime.competitive} - `;
                            message += `Wins : ${info.games.competitive.wins} - Losses + Draws : ${info.games.competitive.lost} - `;
                            message += `Rate : ${((info.games.competitive.wins / info.games.competitive.played) * 100).toFixed(2)}%`;
                        }
                        resolve(message);
                    } else {
                        reject('Ce Battle Tag n\'existe pas ...');
                    }
                });
            });
        });
    },
    setRegion: (r) => {
        return new Promise((resolve, reject) => {
            if (regions.find(element => {
                    return element === r;
                })) {
                region = r;
                resolve();
            } else {
                reject(`Cette région n'existe pas ...\nRégions disponible : ${regions.join(', ')}`);
            }
        });
    }
};

function rankToEmoji(rank) {
    return `ow${rank.match(/\d+(?=\.png)/)}`;
}
