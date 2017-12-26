const blizzard = require('blizzard.js').initialize({
  apikey: process.env.BATTLENET_API_KEY,
});

const regions = ['us', 'eu', 'sea', 'kr', 'tw', 'cn'];

const factions = {
  0: {
    name: 'Alliance',
    icon: 'a',
  },
  1: {
    name: 'Horde',
    icon: 'h',
  },
};

const classes = {
  1: 'Warrior',
  2: 'Paladin',
  3: 'Hunter',
  4: 'Rogue',
  5: 'Priest',
  6: 'Death Knight',
  7: 'Shaman',
  8: 'Mage',
  9: 'Warlock',
  10: 'Monk',
  11: 'Druid',
  12: 'Demon Hunter',
};

const races = {
  1: 'Human',
  2: 'Orc',
  3: 'Dwarf',
  4: 'Night Elf',
  5: 'Undead',
  6: 'Tauren',
  7: 'Gnome',
  8: 'Troll',
  9: 'Goblin',
  10: 'Blood Elf',
  11: 'Draenei',
  22: 'Worgen',
  24: 'Pandaren',
  25: 'Pandaren',
  26: 'Pandaren',
};

function calculProgress(bosses) {
  let lfr = 0;
  let nm = 0;
  let hm = 0;
  let mm = 0;
  const l = bosses.length;
  bosses.forEach((boss) => {
    if (boss.lfrKills > 0) {
      lfr += 1;
    }
    if (boss.normalKills > 0) {
      nm += 1;
    }
    if (boss.heroicKills > 0) {
      hm += 1;
    }
    if (boss.mythicKills > 0) {
      mm += 1;
    }
  });
  return `:baby: ${lfr}/${l} - :boy: ${nm}/${l} - :man: ${hm}/${l} - :older_man: ${mm}/${l}`;
}

module.exports = {
  getCharacterInformations: (region, realm, character, emojis) => new Promise((resolve, reject) => {
    blizzard.wow.character(
      ['profile', 'guild', 'professions', 'progression', 'items'],
      { origin: region, realm: realm.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''), name: character },
    )
      .then((response) => {
        const { data } = response;
        const embed = [
          {
            name: `${data.name} - ${data.realm}`,
            value: `${data.level} - ${races[data.race]} - ${emojis.find('name', `wow${data.class}`)} ${classes[data.class]} - ${emojis.find('name', `wow${factions[data.faction].icon}`)} ${factions[data.faction].name}`,
          },
        ];
        if (typeof data.guild !== 'undefined') {
          embed.push({
            name: 'Guild',
            value: `${data.guild.name} - ${data.guild.realm} - ${data.guild.members} members`,
          });
        }
        const primary = {
          name: 'Primary',
          value: '',
        };
        data.professions.primary.forEach((profession) => {
          primary.value += `${profession.name} (${profession.rank}/${profession.max})\n`;
        });
        embed.push(primary);
        const secondary = {
          name: 'Secondary',
          value: '',
        };
        data.professions.secondary.forEach((profession) => {
          secondary.value += `${profession.name} (${profession.rank}/${profession.max})\n`;
        });
        embed.push(secondary);
        embed.push({
          name: 'Item level',
          value: `Max : ${data.items.averageItemLevel} - Equipped : ${data.items.averageItemLevelEquipped}\n`,
        });
        const item = {
          name: 'Raids',
          value: '',
        };
        const raids = data.progression.raids.slice(-3);
        raids.forEach((raid) => {
          item.value += `${raid.name} - ${calculProgress(raid.bosses)}\n`;
        });
        embed.push(item);
        resolve({
          embed,
          thumbnail: `https://render-${region}.worldofwarcraft.com/character/${data.thumbnail}`,
        });
      }).catch((response) => {
        if (response.status === 404) {
          reject(new Error('Royaume ou personnage introuvable ...'));
        } else {
          reject(new Error('Le service est indisponible pour le moment ...'));
        }
      });
  }),
  setRegion: r => new Promise((resolve, reject) => {
    if (regions.find(element => element === r)) {
      resolve(r);
    } else {
      reject(new Error(`Cette région n'existe pas ...\nRégions disponibles : ${regions.join(', ')}`));
    }
  }),
};
