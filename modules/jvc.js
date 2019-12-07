const Parser = require('rss-parser');

const parser = new Parser();

const types = ['general', 'news', 'video'];

const platforms = ['all', 'pc', 'ps4', 'xb1'];

const feeds = {
  general: {
    all: 'http://www.jeuxvideo.com/rss/rss.xml',
    pc: 'http://www.jeuxvideo.com/rss/rss-pc.xml',
    ps4: 'http://www.jeuxvideo.com/rss/rss-ps4.xml',
    xb1: 'http://www.jeuxvideo.com/rss/rss-xo.xml',
  },
  news: {
    all: 'http://www.jeuxvideo.com/rss/rss-news.xml',
    pc: 'http://www.jeuxvideo.com/rss/rss-news-pc.xml',
    ps4: 'http://www.jeuxvideo.com/rss/rss-news-ps4.xml',
    xb1: 'http://www.jeuxvideo.com/rss/rss-news-xo.xml',
  },
  video: {
    all: 'http://www.jeuxvideo.com/rss/rss-videos.xml',
    pc: 'http://www.jeuxvideo.com/rss/rss-videos-pc.xml',
    ps4: 'http://www.jeuxvideo.com/rss/rss-videos-ps4.xml',
    xb1: 'http://www.jeuxvideo.com/rss/rss-videos-xo.xml',
  },
};

module.exports = {
  getNewsByTypePlatform: (type, platform) => new Promise(async (resolve, reject) => {
    if (types.find(element => element === type)) {
      if (platforms.find(element => element === platform)) {
        if (typeof feeds[type][platform] !== typeof undefined) {
          try {
            const feed = await parser.parseURL(feeds[type][platform]);
            const embed = [
              {
                name: feed.title,
                value: `<${feed.link}>`,
              },
            ];
            feed.items.splice(5).forEach((element) => {
              embed.push({
                name: element.title,
                value: `<${element.link}>`,
              });
            });
            resolve(embed);
          } catch (err) {
            reject(new Error('Une erreur est survenue lors de la récupération des données JVC'));
          }
        }
      } else {
        reject(new Error(`Cette plateforme n'existe pas ...\nPlateformes disponibles : ${platforms.join(', ')}`));
      }
    } else {
      reject(new Error(`Ce type n'existe pas ...\nTypes disponibles : ${types.join(', ')}`));
    }
  }),
};
