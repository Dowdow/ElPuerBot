const https = require('https');
const token = process.env.PUBG_KEY;

const baseUrl = 'pubgtracker.com';
const profilePath = '/api/profile/pc/';

module.exports = {
    getByNickname: (type, name) => {
        return new Promise((resolve, reject) => {
            if (type !== 'all' && type !== 'solo' && type !== 'duo' && type !== 'squad') {
                reject('Ce type n\'est disponible.\nTypes disponibles : all, solo, duo, squad');
            }

            const options = {
                hostname: baseUrl,
                path: profilePath + name,
                method: 'GET',
                headers: {
                    'TRN-Api-Key': token
                }
            };
            https.request(options, res => {
                let data = '';
                res.on('data', d => {
                    data += d;
                });
                res.on('end', () => {
                    data = JSON.parse(data);
                    if (typeof data.error !== typeof undefined) {
                        return reject('Votre personnage n\'existe pas ou est indisponible à la recherche pour l\'instant ...');
                    }
                    let embed = [
                        {
                            'name': `${data.PlayerName} - ${data.selectedRegion.toUpperCase()}`,
                            'value': data.seasonDisplay
                        }
                    ];
                    for (let s in data.Stats) {
                        if (data.Stats.hasOwnProperty(s)) {
                            let stat = data.Stats[s];
                            if (type !== 'all' && type !== stat.Match) {
                                continue;
                            }
                            if (data.selectedRegion === stat.Region && stat.Season === data.defaultSeason) {
                                let categories = {};
                                for (let c in stat.Stats) {
                                    if (stat.Stats.hasOwnProperty(c)) {
                                        let categ = stat.Stats[c];
                                        if (!categories.hasOwnProperty(categ.category)) {
                                            categories[categ.category] = {
                                                'name': categ.category,
                                                'value': ''
                                            }
                                        }
                                        categories[categ.category].value += `${categ.label} : ${categ.value}`;
                                        if (typeof categ.rank !== typeof undefined && categ.rank !== null) {
                                            categories[categ.category].value += ` - :military_medal: ${categ.rank}`;
                                        }
                                        if (typeof categ.percentile !== typeof undefined && categ.percentile !== null) {
                                            categories[categ.category].value += ` - :trophy: ${categ.percentile}%`;
                                        }
                                        categories[categ.category].value += '\n';
                                    }
                                }
                                embed.push({
                                    'name': `===== ${stat.Match.toUpperCase()} =====`,
                                    'value': `Detailed stats for ${stat.Match} games`
                                });
                                for (let ca in categories) {
                                    if (categories.hasOwnProperty(ca)) {
                                        embed.push(categories[ca]);
                                    }
                                }
                            }
                        }
                    }
                    resolve(embed);
                })
            }).on('error', () => {
                reject('Le service est indisponible pour le moment ...');
            }).end();
        });
    }
};