const https = require('https');

let regions = ['br', 'eune', 'euw', 'jp', 'kr', 'lan', 'las', 'na', 'oce', 'tr', 'ru', 'pbe'];
let key = process.env.RIOT_KEY;

module.exports = {
    getSummonerId: (region, name) => {
        return new Promise((resolve, reject) => {
            https.get(`https://${region}.api.pvp.net/api/lol/${region}/v1.4/summoner/by-name/${encodeURI(name)}?api_key=${key}`, res => {
                let data = '';
                if (res.statusCode === 200) {
                    res.on('data', d => {
                        data += d;
                    });
                    res.on('end', () => {
                        resolve(JSON.parse(data)[name.toLowerCase()]['id']);
                    });
                } else {
                    if (res.statusCode === 404) {
                        reject('Ce joueur n\'existe pas ...');
                    } else {
                        reject('Le service est indisponible pour le moment ...');
                    }
                }
            }).on('error', () => {
                reject('Le service est indisponible pour le moment ...');
            });
        });
    },
    getSummonerLeague: (region, id, emojis) => {
        return new Promise((resolve, reject) => {
            https.get(`https://${region}.api.pvp.net/api/lol/${region}/v2.5/league/by-summoner/${id}/entry?api_key=${key}`, res => {
                let data = '';
                if (res.statusCode === 200) {
                    res.on('data', d => {
                        data += d;
                    });
                    res.on('end', () => {
                        let leagues = JSON.parse(data)[id];
                        let embed = [];
                        for (let l in leagues) {
                            if (leagues.hasOwnProperty(l)) {
                                let league = leagues[l];
                                let item = {};
                                item.name = `${modes[league.queue]} - ${league.name}`;
                                item.value = `${emojis.find('name', tiers[league.tier])} - ${league.tier.cFL()} `;
                                item.value += `${divisions[league.entries[0].division]} - ${league.entries[0].leaguePoints}pts\n`;
                                item.value += `Wins : ${league.entries[0].wins} - Losses : ${league.entries[0].losses} - `;
                                item.value += `Rate : ${((league.entries[0].wins / (league.entries[0].wins + league.entries[0].losses)) * 100).toFixed(2)}%`;
                                item.value += league.entries[0].isFreshBlood ? ' :baby: ' : '';
                                item.value += league.entries[0].isVeteran ? ' :older_man: ' : '';
                                item.value += league.entries[0].isHotStreak ? ' :fire: ' : '';
                                item.value += league.entries[0].isInactive ? ':zzz: ' : '';
                                if (typeof league.entries[0].miniSeries !== 'undefined') {
                                    item.value += `\nBO : ${league.entries[0].miniSeries.progress
                                        .replaceAll('L', ' :heavy_multiplication_x:')
                                        .replaceAll('W', ' :heavy_check_mark:')
                                        .replaceAll('N', ' :heavy_minus_sign:')}`;
                                }
                                item.value += '\n';
                                embed.push(item);
                            }
                        }
                        resolve(embed);
                    });
                } else {
                    if (res.statusCode === 404) {
                        reject('Ce joueur n\'existe pas ou n\'est pas encore classé ...');
                    } else {
                        reject('Le service est indisponible pour le moment ...');
                    }
                }
            }).on('error', () => {
                reject('Le service est indisponible pour le moment ...');
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

let modes = {
    'CUSTOM': 'Custom',
    'NORMAL_3x3': 'Normal 3v3',
    'NORMAL_5x5_BLIND': 'Normal 5v5 Blind Pick',
    'NORMAL_5x5_DRAFT': 'Normal 5v5 Draft Pick',
    'RANKED_SOLO_5x5': 'Ranked Solo 5v5',
    'RANKED_PREMADE_5x5': 'Ranked Premade 5v5',
    'RANKED_PREMADE_3x3': 'Ranked Premade 3v3',
    'RANKED_FLEX_TT': 'Ranked Flex Twisted Treeline',
    'RANKED_TEAM_3x3': 'Ranked Team 3v3',
    'RANKED_TEAM_5x5': 'Ranked Team 5v5',
    'ODIN_5x5_BLIND': 'Dominion 5v5 Blind Pick',
    'ODIN_5x5_DRAFT': 'Dominion 5v5 Draft Pick',
    'BOT_5x5': 'Historical Summoner\'s Rift Coop vs AI',
    'BOT_ODIN_5x5': 'Dominion Coop vs AI',
    'BOT_5x5_INTRO': 'Summoner\'s Rift Coop vs AI Intro Bot',
    'BOT_5x5_BEGINNER': 'Summoner\'s Rift Coop vs AI Beginner Bot',
    'BOT_5x5_INTERMEDIATE': 'Historical Summoner\'s Rift Coop vs AI Intermediate Bot',
    'BOT_TT_3x3': 'Twisted Treeline Coop vs AI',
    'GROUP_FINDER_5x5': 'Team Builder',
    'ARAM_5x5': 'ARAM',
    'ONEFORALL_5x5': 'One for All',
    'FIRSTBLOOD_1x1': 'Snowdown Showdown 1v1',
    'FIRSTBLOOD_2x2': 'Snowdown Showdown 2v2',
    'SR_6x6': 'Summoner\'s Rift 6x6 Hexakill',
    'URF_5x5': 'Ultra Rapid Fire',
    'ONEFORALL_MIRRORMODE_5x5': 'One for All (Mirror mode)',
    'BOT_URF_5x5': 'Ultra Rapid Fire games played against AI',
    'NIGHTMARE_BOT_5x5_RANK1': 'Doom Bots Rank 1',
    'NIGHTMARE_BOT_5x5_RANK2': 'Doom Bots Rank 2',
    'NIGHTMARE_BOT_5x5_RANK5': 'Doom Bots Rank 5',
    'ASCENSION_5x5': 'Ascension',
    'HEXAKILL': 'Twisted Treeline 6x6 Hexakill',
    'BILGEWATER_ARAM_5x5': 'Butcher\'s Bridge',
    'KING_PORO_5x5': 'King Poro',
    'COUNTER_PICK': 'Nemesis',
    'BILGEWATER_5x5': 'Black Market Brawlers',
    'SIEGE': 'Nexus Siege',
    'DEFINITELY_NOT_DOMINION_5x5': 'Definitely Not Dominion',
    'ARURF_5X5': 'All Random URF',
    'TEAM_BUILDER_DRAFT_UNRANKED_5x5': 'Normal 5v5 Draft Pick',
    'TEAM_BUILDER_DRAFT_RANKED_5x5': 'Ranked 5v5 Draft Pick',
    'TEAM_BUILDER_RANKED_SOLO': 'Ranked Solo games from current season that use Team Builder matchmaking',
    'RANKED_FLEX_SR': 'Ranked Flex Summoner\'s Rift'
};

let tiers = {
    'BRONZE': 'lol1',
    'SILVER': 'lol2',
    'GOLD': 'lol3',
    'PLATINIUM': 'lol4',
    'DIAMOND': 'lol5',
    'MASTER': 'lol6',
    'CHALLENGER': 'lol7',
};

let divisions = {
    'I': '1',
    'II': '2',
    'III': '3',
    'IV': '4',
    'V': '5'
};

String.prototype.cFL = function () {
    return this.charAt(0).toUpperCase() + this.toLowerCase().slice(1);
};

String.prototype.replaceAll = function (search, replacement) {
    return this.replace(new RegExp(search, 'g'), replacement);
};
