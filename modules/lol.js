const https = require('https');

const key = process.env.RIOT_KEY;

const regions = [
  { name: 'br', endpoint: 'br1.api.riotgames.com' },
  { name: 'eune', endpoint: 'eun1.api.riotgames.com' },
  { name: 'euw', endpoint: 'euw1.api.riotgames.com' },
  { name: 'jp', endpoint: 'jp1.api.riotgames.com' },
  { name: 'kr', endpoint: 'kr.api.riotgames.com' },
  { name: 'lan', endpoint: 'la1.api.riotgames.com' },
  { name: 'las', endpoint: 'la2.api.riotgames.com' },
  { name: 'na', endpoint: 'na1.api.riotgames.com' },
  { name: 'oce', endpoint: 'oc1.api.riotgames.com' },
  { name: 'tr', endpoint: 'tr1.api.riotgames.com' },
  { name: 'ru', endpoint: 'ru.api.riotgames.com' },
  { name: 'pbe', endpoint: 'pbe1.api.riotgames.com' },
];

const modes = {
  CUSTOM: 'Custom',
  NORMAL_3x3: 'Normal 3v3',
  NORMAL_5x5_BLIND: 'Normal 5v5 Blind Pick',
  NORMAL_5x5_DRAFT: 'Normal 5v5 Draft Pick',
  RANKED_SOLO_5x5: 'Ranked Solo 5v5',
  RANKED_PREMADE_5x5: 'Ranked Premade 5v5',
  RANKED_PREMADE_3x3: 'Ranked Premade 3v3',
  RANKED_FLEX_TT: 'Ranked Flex Twisted Treeline',
  RANKED_TEAM_3x3: 'Ranked Team 3v3',
  RANKED_TEAM_5x5: 'Ranked Team 5v5',
  ODIN_5x5_BLIND: 'Dominion 5v5 Blind Pick',
  ODIN_5x5_DRAFT: 'Dominion 5v5 Draft Pick',
  BOT_5x5: 'Historical Summoner\'s Rift Coop vs AI',
  BOT_ODIN_5x5: 'Dominion Coop vs AI',
  BOT_5x5_INTRO: 'Summoner\'s Rift Coop vs AI Intro Bot',
  BOT_5x5_BEGINNER: 'Summoner\'s Rift Coop vs AI Beginner Bot',
  BOT_5x5_INTERMEDIATE: 'Historical Summoner\'s Rift Coop vs AI Intermediate Bot',
  BOT_TT_3x3: 'Twisted Treeline Coop vs AI',
  GROUP_FINDER_5x5: 'Team Builder',
  ARAM_5x5: 'ARAM',
  ONEFORALL_5x5: 'One for All',
  FIRSTBLOOD_1x1: 'Snowdown Showdown 1v1',
  FIRSTBLOOD_2x2: 'Snowdown Showdown 2v2',
  SR_6x6: 'Summoner\'s Rift 6x6 Hexakill',
  URF_5x5: 'Ultra Rapid Fire',
  ONEFORALL_MIRRORMODE_5x5: 'One for All (Mirror mode)',
  BOT_URF_5x5: 'Ultra Rapid Fire games played against AI',
  NIGHTMARE_BOT_5x5_RANK1: 'Doom Bots Rank 1',
  NIGHTMARE_BOT_5x5_RANK2: 'Doom Bots Rank 2',
  NIGHTMARE_BOT_5x5_RANK5: 'Doom Bots Rank 5',
  ASCENSION_5x5: 'Ascension',
  HEXAKILL: 'Twisted Treeline 6x6 Hexakill',
  BILGEWATER_ARAM_5x5: 'Butcher\'s Bridge',
  KING_PORO_5x5: 'King Poro',
  COUNTER_PICK: 'Nemesis',
  BILGEWATER_5x5: 'Black Market Brawlers',
  SIEGE: 'Nexus Siege',
  DEFINITELY_NOT_DOMINION_5x5: 'Definitely Not Dominion',
  ARURF_5X5: 'All Random URF',
  TEAM_BUILDER_DRAFT_UNRANKED_5x5: 'Normal 5v5 Draft Pick',
  TEAM_BUILDER_DRAFT_RANKED_5x5: 'Ranked 5v5 Draft Pick',
  TEAM_BUILDER_RANKED_SOLO: 'Ranked Solo games from current season that use Team Builder matchmaking',
  RANKED_FLEX_SR: 'Ranked Flex Summoner\'s Rift',
};

const tiers = {
  BRONZE: 'lol1',
  SILVER: 'lol2',
  GOLD: 'lol3',
  PLATINUM: 'lol4',
  DIAMOND: 'lol5',
  MASTER: 'lol6',
  CHALLENGER: 'lol7',
};

module.exports = {
  getSummonerId: (region, name) => new Promise((resolve, reject) => {
    https.get(`https://${region.endpoint}/lol/summoner/v3/summoners/by-name/${encodeURI(name)}?api_key=${key}`, (res) => {
      let data = '';
      if (res.statusCode === 200) {
        res.on('data', (d) => {
          data += d;
        });
        res.on('end', () => {
          resolve(JSON.parse(data).id);
        });
      } else if (res.statusCode === 404) {
        reject(new Error('Ce joueur n\'existe pas ...'));
      } else {
        reject(new Error('Le service est indisponible pour le moment ...'));
      }
    }).on('error', () => {
      reject(new Error('Le service est indisponible pour le moment ...'));
    });
  }),
  getSummonerLeague: (region, id, emojis) => new Promise((resolve, reject) => {
    https.get(`https://${region.endpoint}/lol/league/v3/leagues/by-summoner/${id}?api_key=${key}`, (res) => {
      let data = '';
      if (res.statusCode === 200) {
        res.on('data', (d) => {
          data += d;
        });
        res.on('end', () => {
          const leagues = JSON.parse(data);
          const embed = [];
          leagues.forEach((league) => {
            const entry = league.entries[0];
            const item = {};
            item.name = `${modes[league.queue]} - ${league.name}`;
            item.value = `${emojis.find('name', tiers[league.tier])} - ${league.tier.charAt(0).toUpperCase() + this.toLowerCase().slice(1)} `;
            item.value += `${entry.rank} - ${entry.leaguePoints}pts\n`;
            item.value += `Wins : ${entry.wins} - Losses : ${entry.losses} - `;
            item.value += `Rate : ${((entry.wins / (entry.wins + entry.losses)) * 100).toFixed(2)}%`;
            item.value += entry.freshBlood ? ' :baby: ' : '';
            item.value += entry.veteran ? ' :older_man: ' : '';
            item.value += entry.hotStreak ? ' :fire: ' : '';
            item.value += entry.inactive ? ':zzz: ' : '';
            if (typeof entry.miniSeries !== typeof undefined) {
              item.value += `\nBO : ${entry.miniSeries.progress
                .replace(new RegExp('L', 'g'), ' :heavy_multiplication_x:')
                .replace(new RegExp('W', 'g'), ' :heavy_check_mark:')
                .replace(new RegExp('N', 'g'), ' :heavy_minus_sign:')}`;
            }
            item.value += '\n';
            embed.push(item);
          });
          resolve(embed);
        });
      } else if (res.statusCode === 404) {
        reject(new Error('Ce joueur n\'existe pas ou n\'est pas encore classé ...'));
      } else {
        reject(new Error('Le service est indisponible pour le moment ...'));
      }
    }).on('error', () => {
      reject(new Error('Le service est indisponible pour le moment ...'));
    });
  }),
  setRegion: region => new Promise((resolve, reject) => {
    regions.forEach((r) => {
      if (r.name === region) {
        resolve(r);
      }
    });
    reject(new Error(`Cette région n'existe pas ...\nRégions disponibles : ${regions.map(elem => elem.name).join(', ')}`));
  }),
};
