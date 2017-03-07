const rss = require('rss-parser');

module.exports = {
    getNewsByTypePlatform: (type, platform) => {
        return new Promise((resolve, reject) => {
            if (types.find(element => {
                    return element === type;
                })) {
                if (platforms.find(element => {
                        return element === platform;
                    })) {
                    if (typeof feeds[type][platform] !== typeof undefined) {
                        rss.parseURL(feeds[type][platform], (err, parsed) => {
                            if (!err) {
                                let data = parsed.feed;
                                let message = `${data.title} - ${data.link}\n`;
                                for (let e in data.entries.splice(10)) {
                                    if (data.entries.hasOwnProperty(e)) {
                                        let entry = data.entries[e];
                                        message += `\n- __${entry.title}__\n\t<${entry.link}>`;
                                    }
                                }
                                resolve(message);
                            } else {
                                reject(`Une erreur est survenue lors de la récupération des données JVC`);
                            }
                        });
                    }
                }
                else {
                    reject(`Cette plateforme n'existe pas ...\nPlateformes disponibles : ${platforms.join(', ')}`);
                }
            } else {
                reject(`Ce type n'existe pas ...\nTypes disponibles : ${types.join(', ')}`);
            }
        });
    }
};

let types = ['general', 'news', 'video'];

let platforms = ['all', 'pc', 'ps4', 'xb1'];

let feeds = {
    'general': {
        'all': 'http://www.jeuxvideo.com/rss/rss.xml',
        'pc': 'http://www.jeuxvideo.com/rss/rss-pc.xml',
        'ps4': 'http://www.jeuxvideo.com/rss/rss-ps4.xml',
        'xb1': 'http://www.jeuxvideo.com/rss/rss-xo.xml'
    },
    'news': {
        'all': 'http://www.jeuxvideo.com/rss/rss-news.xml',
        'pc': 'http://www.jeuxvideo.com/rss/rss-news-pc.xml',
        'ps4': 'http://www.jeuxvideo.com/rss/rss-news-ps4.xml',
        'xb1': 'http://www.jeuxvideo.com/rss/rss-news-xo.xml'
    },
    'video': {
        'all': 'http://www.jeuxvideo.com/rss/rss-videos.xml',
        'pc': 'http://www.jeuxvideo.com/rss/rss-videos-pc.xml',
        'ps4': 'http://www.jeuxvideo.com/rss/rss-videos-ps4.xml',
        'xb1': 'http://www.jeuxvideo.com/rss/rss-videos-xo.xml'
    }
};