const https = require('https');

const token = process.env.PUBG_KEY;

const baseUrl = 'pubgtracker.com';
const profilePath = '/api/profile/pc/';

module.exports = {
  getByNickname: (type, name) => new Promise((resolve, reject) => {
    if (type !== 'all' && type !== 'solo' && type !== 'duo' && type !== 'squad') {
      reject(new Error('Ce type n\'est disponible.\nTypes disponibles : all, solo, duo, squad'));
    }

    const options = {
      hostname: baseUrl,
      path: profilePath + name,
      method: 'GET',
      headers: {
        'TRN-Api-Key': token,
      },
    };
    https.request(options, (res) => {
      let data = '';
      res.on('data', (d) => {
        data += d;
      });
      res.on('end', () => {
        data = JSON.parse(data);
        if (typeof data.error !== typeof undefined) {
          return reject(new Error('Votre personnage n\'existe pas ou est indisponible à la recherche pour l\'instant ...'));
        }
        const embed = [
          {
            name: `${data.PlayerName} - ${data.selectedRegion.toUpperCase()}`,
            value: data.seasonDisplay,
          },
        ];
        data.Stats.forEach((stat) => {
          if (type === 'all' || type === stat.Match) {
            if (data.selectedRegion === stat.Region && stat.Season === data.defaultSeason) {
              const categories = {};
              stat.Stats.forEach((categ) => {
                if (!Object.prototype.hasOwnProperty.call(categories, categ.category)) {
                  categories[categ.category] = {
                    name: categ.category,
                    value: '',
                  };
                }
                categories[categ.category].value += `${categ.label} : ${categ.value}`;
                if (typeof categ.rank !== typeof undefined && categ.rank !== null) {
                  categories[categ.category].value += ` - :military_medal: ${categ.rank}`;
                }
                if (typeof categ.percentile !== typeof undefined && categ.percentile !== null) {
                  categories[categ.category].value += ` - :trophy: ${categ.percentile}%`;
                }
                categories[categ.category].value += '\n';
              });
              embed.push({
                name: `===== ${stat.Match.toUpperCase()} =====`,
                value: `Detailed stats for ${stat.Match} games`,
              });
              categories.forEach((category) => {
                embed.push(category);
              });
            }
          }
        });
        return resolve(embed);
      });
    }).on('error', () => {
      reject(new Error('Le service est indisponible pour le moment ...'));
    }).end();
  }),
};
