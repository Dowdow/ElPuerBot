const https = require('https');

let baseUrl = 'https://ow-api.herokuapp.com';
let regions = ['eu', 'us', 'kr', 'cn', 'global'];

module.exports = {
    getProfileByBattleTag: (region, battletag, emojis) => {
        return new Promise((resolve, reject) => {
            https.get(`${baseUrl}/profile/pc/${encodeURI(region)}/${encodeURI(battletag.replace('#', '-'))}`, res => {
                let data = '';
                res.on('data', d => {
                    data += d;
                });
                res.on('end', () => {
                    let info = JSON.parse(data);
                    if (typeof data.statusCode === typeof undefined) {
                        let embed = [
                            {
                                'name': info.username,
                                'value': `Level : ${info.level}`
                            }
                        ];

                        if (Object.keys(info.games.quickplay).length !== 0 && info.games.quickplay.constructor === Object) {
                            embed.push({
                                'name': 'Quick',
                                'value': `${info.games.quickplay.won} wins - ${info.playtime.quickplay}`
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
                            item.value += `Wins : ${info.games.competitive.won === null ? 0 : info.games.competitive.won} - `;
                            item.value += `Losses : ${info.games.competitive.lost === null ? 0 : info.games.competitive.lost} - `;
                            item.value += `Draws : ${info.games.competitive.draw === null ? 0 : info.games.competitive.draw} - `;
                            item.value += `Rate : ${(((info.games.competitive.won === null ? 0 : info.games.competitive.won) / info.games.competitive.played) * 100).toFixed(2)}%`;
                            embed.push(item);
                        }
                        resolve(embed);
                    } else {
                        reject('Ce Battle Tag n\'existe pas ...');
                    }
                });
            }).on('error', () => {
                reject('Le service est indisponible pour le moment ...')
            });
        });
    },
    setRegion: (r) => {
        return new Promise((resolve, reject) => {
            if (regions.find(element => {
                    return element === r;
                })) {
                resolve(r);
            } else {
                reject(`Cette région n'existe pas ...\nRégions disponibles : ${regions.join(', ')}`);
            }
        });
    }
};

function rankToEmoji(rank) {
    return `ow${rank.match(/\d+(?=\.png)/)}`;
}
