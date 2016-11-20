const blizzard = require('blizzard.js').initialize({
    apikey: process.env.BATTLENET_API_KEY
});

module.exports = {
    getCharacterInformations: (region, realm, character) => {
        return new Promise((resolve, reject) => {
          blizzard.wow.character(['profile', 'feed', 'guild', 'professions', 'progression', 'stats'],
            { origin: region, realm: realm, name: character })
              .then(response => {
                console.log(response.data.progression.raids);
              }).catch(response => {
                console.log(response);
              });
        });
    }
};
