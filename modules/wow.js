const blizzard = require('blizzard.js').initialize({
    apikey: process.env.BATTLENET_API_KEY
});

var regions = ['us', 'eu', 'sea', 'kr', 'tw', 'cn'];
var region = '';

module.exports = {
    getCharacterInformations: (realm, character) => {
        return new Promise((resolve, reject) => {
            blizzard.wow.character(['profile', 'guild', 'professions', 'progression', 'items'],
                {origin: region, realm: realm.slugify(), name: character})
                .then(response => {
                    let data = response.data;
                    let message = `${data.name} - ${data.realm} - ${data.level} - ${races[data.race]} - ${classes[data.class]} - ${factions[data.faction]}`;
                    if(typeof data.guild !== 'undefined') {
                        message += `\nGuild : ${data.guild.name} - ${data.guild.realm} - ${data.guild.members} members`;
                    }
                    message += `\nPrimary : `;
                    for (let p in data.professions.primary) {
                        if (data.professions.primary.hasOwnProperty(p)) {
                            message += `${data.professions.primary[p].name} (${data.professions.primary[p].rank}/${data.professions.primary[p].max})`;
                            if (p != (data.professions.primary.length - 1)) {
                                message += ` - `
                            }
                        }
                    }
                    message += `\nSecondary : `;
                    for (let p in data.professions.secondary) {
                        if (data.professions.secondary.hasOwnProperty(p)) {
                            message += `${data.professions.secondary[p].name} (${data.professions.secondary[p].rank}/${data.professions.secondary[p].max})`;
                            if (p != (data.professions.secondary.length - 1)) {
                                message += ` - `
                            }
                        }
                    }
                    message += `\nItem level max : ${data.items.averageItemLevel} - Item level equipped : ${data.items.averageItemLevelEquipped}`;
                    let raids = data.progression.raids.slice(-3);
                    for (let r in raids) {
                        if (raids.hasOwnProperty(r)) {
                            message += `\n${raids[r].name} - ${calculProgress(raids[r].bosses)}`;
                        }
                    }
                    resolve({
                        'message': message,
                        'thumbnail': `https://render-${region}.worldofwarcraft.com/character/${data.thumbnail}`
                    });
                }).catch(response => {
                if (response.response.status == 404) {
                    reject('Royaume ou personnage introuvable ...');
                } else {
                    reject('Le service est indisponible pour le moment ...');
                }
            });
        });
    },
    setRegion: (r) => {
        return new Promise((resolve, reject) => {
            if (regions.find((element) => {
                    return element === r;
                })) {
                region = r;
                resolve();
            } else {
                reject(`Cette région n'existe pas ...\nRégions disponible : ${regions.join(', ')}`);
            }
        });
    }
};

var factions = {
    '0': 'Alliance',
    '1': 'Horde',
};

var classes = {
    '1': "Warrior",
    '2': "Paladin",
    '3': "Hunter",
    '4': "Rogue",
    '5': "Priest",
    '6': "Death Knight",
    '7': "Shaman",
    '8': "Mage",
    '9': "Warlock",
    '10': "Monk",
    '11': "Druid",
    '12': "Demon Hunter",
};

var races = {
    '1': 'Human',
    '2': 'Orc',
    '3': 'Dwarf',
    '4': 'Night Elf',
    '5': 'Undead',
    '6': 'Tauren',
    '7': 'Gnome',
    '8': 'Troll',
    '9': 'Goblin',
    '10': 'Blood Elf',
    '11': 'Draenei',
    '22': 'Worgen',
    '24': 'Pandaren',
    '25': 'Pandaren',
    '26': 'Pandaren',
};

function calculProgress(bosses) {
    let lfr = 0;
    let nm = 0;
    let hm = 0;
    let mm = 0;
    let l = bosses.length;
    for (let b in bosses) {
        if (bosses.hasOwnProperty(b)) {
            if (bosses[b].lfrKills > 0) {
                lfr++;
            }
            if (bosses[b].normalKills > 0) {
                nm++;
            }
            if (bosses[b].heroicKills > 0) {
                hm++;
            }
            if (bosses[b].mythicKills > 0) {
                mm++;
            }
        }
    }
    return `lfr ${lfr}/${l} - nm ${nm}/${l} - hm ${hm}/${l} - mm ${mm}/${l}`;
}

String.prototype.slugify = function () {
    return this.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
};
