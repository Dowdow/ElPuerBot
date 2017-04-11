const blizzard = require('blizzard.js').initialize({
    apikey: process.env.BATTLENET_API_KEY
});

let regions = ['us', 'eu', 'sea', 'kr', 'tw', 'cn'];

module.exports = {
    getCharacterInformations: (region, realm, character, emojis) => {
        return new Promise((resolve, reject) => {
            blizzard.wow.character(['profile', 'guild', 'professions', 'progression', 'items'],
                {origin: region, realm: realm.slugify(), name: character})
                .then(response => {
                    let data = response.data;
                    let embed = [
                        {
                            'name': `${data.name} - ${data.realm}`,
                            'value': `${data.level} - ${races[data.race]} - ${emojis.find('name', `wow${data.class}`)} ${classes[data.class]} - ${emojis.find('name', `wow${factions[data.faction].icon}`)} ${factions[data.faction].name}`
                        }
                    ];
                    if (typeof data.guild !== 'undefined') {
                        embed.push({
                            'name': 'Guild',
                            'value': `${data.guild.name} - ${data.guild.realm} - ${data.guild.members} members`
                        });
                    }
                    let primary = {
                        'name': 'Primary',
                        'value': ''
                    };
                    for (let p in data.professions.primary) {
                        if (data.professions.primary.hasOwnProperty(p)) {
                            primary.value += `${emojis.find('name', `wow${data.professions.primary[p].id}`)} ${data.professions.primary[p].name} (${data.professions.primary[p].rank}/${data.professions.primary[p].max})`;
                            if (p !== (data.professions.primary.length - 1)) {
                                primary.value += ` - `
                            }
                        }
                    }
                    embed.push(primary);
                    let secondary = {
                        'name': 'Secondary',
                        'value': ''
                    };
                    for (let p in data.professions.secondary) {
                        if (data.professions.secondary.hasOwnProperty(p)) {
                            secondary.value += `${emojis.find('name', `wow${data.professions.secondary[p].id}`)} ${data.professions.secondary[p].name} (${data.professions.secondary[p].rank}/${data.professions.secondary[p].max})`;
                            if (p !== (data.professions.secondary.length - 1)) {
                                secondary.value += ` - `
                            }
                        }
                    }
                    embed.push(secondary);
                    embed.push({
                        'name': 'Item level',
                        'value': `Max : ${data.items.averageItemLevel} - Equipped : ${data.items.averageItemLevelEquipped}\n`
                    });
                    let item = {
                        'name': 'Raids',
                        'value': ''
                    };
                    let raids = data.progression.raids.slice(-3);
                    for (let r in raids) {
                        if (raids.hasOwnProperty(r)) {
                            item.value += `${raids[r].name} - ${calculProgress(raids[r].bosses)}\n`;
                        }
                    }
                    embed.push(item);
                    resolve({
                        'embed': embed,
                        'thumbnail': `https://render-${region}.worldofwarcraft.com/character/${data.thumbnail}`
                    });
                }).catch(response => {
                if (response.status === 404) {
                    reject('Royaume ou personnage introuvable ...');
                } else {
                    reject('Le service est indisponible pour le moment ...');
                }
            });
        });
    },
    setRegion: (r) => {
        return new Promise((resolve, reject) => {
            if (regions.find(element => {
                    return element === r;
                })) {
                resolve(r);
            } else {
                reject(`Cette région n'existe pas ...\nRégions disponibles : ${regions.join(', ')}`);
            }
        });
    }
};

let factions = {
    '0': {
        'name': 'Alliance',
        'icon': 'a'
    },
    '1': {
        'name': 'Horde',
        'icon': 'h'
    },
};

let classes = {
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

let races = {
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
    return `:baby: ${lfr}/${l} - :boy: ${nm}/${l} - :man: ${hm}/${l} - :older_man: ${mm}/${l}`;
}

String.prototype.slugify = function () {
    return this.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
};
