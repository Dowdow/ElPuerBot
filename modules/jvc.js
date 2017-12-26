const rss = require('rss-parser');

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
  getNewsByTypePlatform: (type, platform) => new Promise((resolve, reject) => {
    if (types.find(element => element === type)) {
      if (platforms.find(element => element === platform)) {
        if (typeof feeds[type][platform] !== typeof undefined) {
          rss.parseURL(feeds[type][platform], (err, parsed) => {
            if (!err) {
              const data = parsed.feed;
              const embed = [
                {
                  name: data.title,
                  value: `<${data.link}>`,
                },
              ];
              data.entries.splice(5).forEach((element) => {
                embed.push({
                  name: element.title,
                  value: `<${element.link}>`,
                });
              });
              resolve(embed);
            } else {
              reject(new Error('Une erreur est survenue lors de la récupération des données JVC'));
            }
          });
        }
      } else {
        reject(new Error(`Cette plateforme n'existe pas ...\nPlateformes disponibles : ${platforms.join(', ')}`));
      }
    } else {
      reject(new Error(`Ce type n'existe pas ...\nTypes disponibles : ${types.join(', ')}`));
    }
  }),
};
