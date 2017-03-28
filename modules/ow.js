const https = require('https');

let baseUrl = 'https://api.lootbox.eu';
let regions = ['eu', 'us', 'kr', 'cn', 'global'];
let region = '';

module.exports = {
    getProfileByBattleTag: (battletag, emojis) => {
        return new Promise((resolve, reject) => {
            https.get(`${baseUrl}/pc/${encodeURI(region)}/${encodeURI(battletag.replace('#', '-'))}/profile`, res => {
                let data = '';
                res.on('data', d => {
                    data += d;
                });
                res.on('end', () => {
                    data = JSON.parse(data);
                    if (typeof data.statusCode === 'undefined') {
                        let info = data.data;
                        let embed = [
                            {
                                'name': info.username,
                                'value': `Level : ${info.level}`
                            }
                        ];

                        if (Object.keys(info.games.quick).length !== 0 && info.games.quick.constructor === Object) {
                            embed.push({
                                'name': 'Quick',
                                'value': `${info.games.quick.wins} wins - ${info.playtime.quick}`
                            });
                        }
                        if (Object.keys(info.games.competitive).length !== 0 && info.games.competitive.constructor === Object) {
                            let item = {};
                            item.name = `Competitive`;
                            if (info.competitive.rank === null) {
                                item.value = `Unranked`;
                            } else {
                                item.value = `${info.competitive.rank} pts - ${emojis.find('name', rankToEmoji(info.competitive.rank_img))}`;
                            }
                            item.value += ` - ${info.playtime.competitive} - `;
                            item.value += `Wins : ${info.games.competitive.wins} - Losses + Draws : ${info.games.competitive.lost} - `;
                            item.value += `Rate : ${((info.games.competitive.wins / info.games.competitive.played) * 100).toFixed(2)}%`;
                            embed.push(item);
                        }
                        resolve(embed);
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
                reject(`Cette région n'existe pas ...\nRégions disponibles : ${regions.join(', ')}`);
            }
        });
    }
};

function rankToEmoji(rank) {
    return `ow${rank.match(/\d+(?=\.png)/)}`;
}
