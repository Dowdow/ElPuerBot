const rls = require('rls-api');
const rlsclient = new rls.Client({
    token: process.env.RLS_TOKEN
});

module.exports = {
    getPlayerRanks: steamid => {
        return new Promise((resolve, reject) => {
            rlsclient.getPlayer(encodeURIComponent(steamid), rlsclient.platforms.STEAM, (status, data) => {
                if (status === 200) {
                    console.log(data);
                } else {
                    reject('Le service Rocket League Stats est inaccessible pour l\'instant ...');
                }
            });
        });
    }
};
