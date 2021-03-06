const https = require('https');

const baseUrl = 'https://ow-api.com/v1';
const regions = ['eu', 'us', 'kr', 'cn', 'global'];

module.exports = {
  getProfileByBattleTag: (region, battletag, emojis) => new Promise((resolve, reject) => {
    https.get(`${baseUrl}/stats/pc/${encodeURI(region)}/${encodeURI(battletag.replace('#', '-'))}/profile`, (res) => {
      let data = '';
      res.on('data', (d) => {
        data += d;
      });
      res.on('end', () => {
        const info = JSON.parse(data);
        if (typeof data.statusCode === typeof undefined) {
          const embed = [
            {
              name: info.name,
              value: `Level : ${info.level}`,
            },
          ];
          if (Object.keys(info.quickPlayStats).length !== 0 && info.quickPlayStats.constructor === Object) {
            embed.push({
              name: 'Quick',
              value: `${info.quickPlayStats.games.won} wins - ${info.quickPlayStats.games.played}`,
            });
          }
          if (Object.keys(info.competitiveStats).length !== 0 && info.competitiveStats === Object) {
            const item = {};
            item.name = 'Competitive';
            if (info.competitiveStats.rank === null) {
              item.value = 'Unranked';
            } else {
              item.value = `${info.competitive.rank} pts - ${emojis.find('name', `ow${info.competitive.rank_img.match(/\d+(?=\.png)/)}`)}`;
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
          reject(new Error('Ce Battle Tag n\'existe pas ...'));
        }
      });
    }).on('error', () => {
      reject(new Error('Le service est indisponible pour le moment ...'));
    }).end();
  }),
  setRegion: r => new Promise((resolve, reject) => {
    if (regions.find(element => element === r)) {
      resolve(r);
    } else {
      reject(new Error(`Cette région n'existe pas ...\nRégions disponibles : ${regions.join(', ')}`));
    }
  }),
};
