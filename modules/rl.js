const https = require('https');

const token = process.env.RLS_TOKEN;

const baseUrl = 'api.rocketleaguestats.com';
const searchPath = '/v1/search/players';
const playerPath = '/v1/player';

function createOptions(path) {
  return {
    hostname: baseUrl,
    path,
    method: 'GET',
    headers: {
      Authorization: token,
    },
  };
}

function getQueue(queue) {
  switch (queue) {
    case '10':
      return '1v1';
    case '11':
      return '2v2';
    case '12':
      return '3v3 solo';
    case '13':
      return '3v3 standard';
    default:
      return 'Unknown queue';
  }
}

function getTier(tier) {
  switch (tier) {
    case 0:
      return 'Unranked';
    case 1:
      return 'Bronze I';
    case 2:
      return 'Bronze II';
    case 3:
      return 'Bronze III';
    case 4:
      return 'Silver I';
    case 5:
      return 'Silver II';
    case 6:
      return 'Silver III';
    case 7:
      return 'Gold I';
    case 8:
      return 'Gold II';
    case 9:
      return 'Gold III';
    case 10:
      return 'Platinum I';
    case 11:
      return 'Platinum II';
    case 12:
      return 'Platinum III';
    case 13:
      return 'Diamond I';
    case 14:
      return 'Diamond II';
    case 15:
      return 'Diamond III';
    case 16:
      return 'Champion I';
    case 17:
      return 'Champion II';
    case 18:
      return 'Champion III';
    case 19:
      return 'Grand Champion';
    default:
      return 'Unknown';
  }
}

module.exports = {
  searchPlayer: name => new Promise((resolve, reject) => {
    const options = createOptions(`${searchPath}?display_name=${encodeURIComponent(name)}`);
    https.request(options, (res) => {
      let data = '';
      res.on('data', (d) => {
        data += d;
      });
      res.on('end', () => {
        data = JSON.parse(data);
        const embed = [
          {
            name: 'Search results',
            value: `${data.results} results found`,
          },
        ];
        data.data.forEach((player) => {
          embed.push({
            name: player.displayName,
            value: `ID : ${player.uniqueId} - Platform : ${player.platform.name}`,
          });
        });
        resolve(embed);
      });
    }).on('error', () => {
      reject(new Error('Le service est indisponible pour le moment ...'));
    }).end();
  }),
  getPlayerRanks: (steamid, emojis) => new Promise((resolve, reject) => {
    const options = createOptions(`${playerPath}?unique_id=${encodeURIComponent(steamid)}&platform_id=1`);
    https.request(options, (res) => {
      let data = '';
      res.on('data', (d) => {
        data += d;
      });
      res.on('end', () => {
        data = JSON.parse(data);
        const embed = [
          {
            name: data.displayName,
            value: `ID : ${data.uniqueId} - Platform : ${data.platform.name}`,
          },
          {
            name: 'Stats',
            value: `:military_medal: Wins : ${data.stats.wins}\n:soccer: Goals : ${data.stats.goals}\n:first_place: Mvps : ${data.stats.mvps}\n:goal: Saves : ${data.stats.saves}\n:gun: Shots : ${data.stats.shots}\n:handshake: Assists : ${data.stats.assists}`,
          },
        ];
        let season = 0;
        Object.keys(data.rankedSeasons).forEach((rank) => {
          if (rank > season) {
            season = rank;
          }
        });
        embed.push({
          name: 'Ranked',
          value: `Last season played was Season ${season}`,
        });
        Object.keys(data.rankedSeasons[season]).forEach((queue) => {
          const queueRank = data.rankedSeasons[season][queue];
          embed.push({
            name: getQueue(queue),
            value: `Tier : ${emojis.find('name', `rl${queueRank.tier}`)} ${getTier(queueRank.tier)} - Division : ${queueRank.division + 1} - Played : ${queueRank.matchesPlayed} - MMR : ${queueRank.rankPoints}`,
          });
        });
        resolve({
          embed,
          thumbnail: data.avatar,
        });
      });
    }).on('error', () => {
      reject(new Error('Le service est indisponible pour le moment ...'));
    }).end();
  }),
};
