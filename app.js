require('dotenv').config();
const winston = require('winston');
const Discord = require('discord.js');
const lol = require('./modules/lol');
const ow = require('./modules/ow');
const wow = require('./modules/wow');
const rl = require('./modules/rl');
const pubg = require('./modules/pubg');
const jvc = require('./modules/jvc');
const music = require('./modules/music');
const ask = require('./modules/ask');

// LOG CONFIGURATION
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'elpuer.log' }),
  ],
});

// DISCORD EVENTS
const client = new Discord.Client();

client.on('ready', () => {
  logger.log('info', `Logged in as ${client.user.username}#${client.user.discriminator}`);
});

client.on('disconnect', () => {
  logger.log('info', 'Disconnected');
  client.login(process.env.EL_PUER_TOKEN).then(() => {
    logger.log('info', 'Reconnection ...');
  }).catch(() => {
    logger.log('error', 'Error while reconnecting');
  });
});

function sendEmbedMessage(msg, message, color, fields, footer = null) {
  const rich = {
    embed: {
      color,
      author: {
        name: msg.author.username,
        icon_url: msg.author.avatarURL,
      },
      fields,
    },
  };
  if (footer !== null) {
    rich.footer = {
      icon_url: footer,
    };
  }
  return msg.channel.send(message, rich);
}

// COMMANDS
const commands = {
  '!el-puer': {
    usage: '!el-puer',
    description: 'Appelle ce brave El Puer',
    method: (msg) => {
      msg.channel.send('Je suis El Puer, fidèle et brave animal ! :dog:');
    },
  },
  '!lol': {
    usage: '!lol [region] [summoner]',
    description: 'Affiche le classement League of Legends du joueur [summoner]',
    method: async (msg, args) => {
      if (args.length < 2) {
        msg.reply('Usage : !lol [region] [summoner]');
        return;
      }
      try {
        const region = await lol.setRegion(args[0]);
        const id = await lol.getSummonerId(region, args.slice(1).join(' '));
        const message = await lol.getSummonerLeague(region, id, msg.guild.emojis);
        sendEmbedMessage(msg, '', 29913, message).catch((error) => {
          logger.log('error', `Erreur LoL - ${message}`, error);
        });
      } catch (err) {
        msg.reply(err.message);
      }
    },
  },
  '!ow': {
    usage: '!ow [region] [battle-tag]',
    description: 'Affiche le classement Overwatch du joueur [battle-tag]',
    method: async (msg, args) => {
      if (args.length < 2) {
        msg.reply('Usage : !ow [region] [battle-tag]');
        return;
      }
      try {
        const region = await ow.setRegion(args[0]);
        const message = await ow.getProfileByBattleTag(region, args.slice(1).join(' '), msg.guild.emojis);
        sendEmbedMessage(msg, '', 16768000, message).catch((error) => {
          logger.log('error', `Erreur OW Message - ${message}`, error);
        });
      } catch (err) {
        msg.reply(err.message);
      }
    },
  },
  '!rl': {
    usage: '!rl [search|stats] [name|steam_id]',
    description: 'Affiche le classement Rocket League du joueur [name|steam_id]',
    method: async (msg, args) => {
      if (args.length < 2) {
        msg.reply('Usage : !rl [search|stats] [name|steam_id]');
        return;
      }
      const id = args.slice(1).join(' ');
      try {
        switch (args[0]) {
          case 'search': {
            const message = await rl.searchPlayer(id);
            sendEmbedMessage(msg, '', 3066944, message).catch((error) => {
              logger.log('error', `Erreur RL Message Search - ${message}`, error);
            });
            break;
          }
          case 'stats': {
            const obj = await rl.getPlayerRanks(id, msg.guild.emojis);
            sendEmbedMessage(msg, '', 3066944, obj.embed, obj.thumbnail).catch((error) => {
              logger.log('error', 'Erreur RL Message Stats', error);
            });
            break;
          }
          default:
            msg.reply('Le type doit être "search" ou "stats"');
            break;
        }
      } catch (err) {
        msg.reply(err.message);
      }
    },
  },
  '!wow': {
    usage: '!wow [region] [realm] [character]',
    description: 'Affiche des infos sur le personnage [character] de World of Warcraft',
    method: async (msg, args) => {
      if (args.length < 3) {
        msg.reply('Usage : !wow [region] [realm] [character]');
        return;
      }
      try {
        const region = await wow.setRegion(args[0]);
        const obj = await wow.getCharacterInformations(region, args[1], args[2], msg.guild.emojis);
        sendEmbedMessage(msg, '', 16728374, obj.embed, obj.thumbnail).catch((error) => {
          logger.log('error', `Erreur WoW Message - ${obj.embed}`, error);
        });
      } catch (err) {
        msg.reply(err.message);
      }
    },
  },
  '!pubg': {
    usage: '!pubg [type] [name]',
    description: 'Affiche le classement Playerunknown\'s Battlegrounds du joueur [name]',
    method: async (msg, args) => {
      if (args.length < 2) {
        msg.reply('Usage : !pubg [type] [name]');
        return;
      }
      try {
        const message = await pubg.getByNickname(args[0], args.slice(1).join(' '));
        sendEmbedMessage(msg, '', 1118481, message).catch((error) => {
          logger.log('error', `Erreur PUBG Message - ${message}`, error);
        });
      } catch (err) {
        msg.reply(err.message);
      }
    },
  },
  '!jvc': {
    usage: '!jvc [type] [platform]',
    description: 'Affiche les dernières infos, news et vidéos depuis JVC par platforme',
    method: async (msg, args) => {
      if (args.length < 2) {
        msg.reply('Usage : !jvc [type] [platform]');
        return;
      }
      try {
        const message = await jvc.getNewsByTypePlatform(args[0], args[1]);
        sendEmbedMessage(msg, '', 16745755, message).catch((error) => {
          logger.log('error', `Erreur WoW Message - ${message}`, error);
        });
      } catch (err) {
        msg.reply(err.message);
      }
    },
  },
  '!play': {
    usage: '!play [youtube-url]',
    description: 'Joue une musique YouTube dans le salon actuel',
    method: async (msg, args) => {
      if (args.length < 1) {
        msg.reply('Usage : !play [youtube-url]');
        return;
      }
      try {
        const message = await music.play(msg.member.voiceChannel, args[0]);
        msg.channel.send(message).catch((error) => {
          logger.log('error', `Erreur Play Message - ${message}`, error);
        });
      } catch (err) {
        msg.reply(err.message);
      }
    },
  },
  '!stop': {
    usage: '!stop',
    description: 'Stoppe la lecture d\'une musique YouTube dans le salon actuel',
    method: async (msg) => {
      try {
        const message = await music.stop(msg.member.voiceChannel);
        msg.channel.send(message).catch((error) => {
          logger.log('error', `Erreur Stop Message - ${message}`, error);
        });
      } catch (err) {
        msg.reply(err.message);
      }
    },
  },
  '!help': {
    usage: '!help',
    description: 'Affiche l\'aide pour ce brave ElPuer',
    method: (msg) => {
      const embed = [];
      Object.keys(commands).forEach((command) => {
        embed.push({
          name: commands[command].usage,
          value: commands[command].description,
        });
      });
      sendEmbedMessage(msg, 'Liste des commandes pour ce brave El Puer :dog: :', 16777215, embed).catch((error) => {
        logger.log('error', 'Erreur help message', error);
      });
    },
  },
};

function processMsg(msg) {
  // On ne traite pas les messages de bot
  if (msg.author.bot) return;
  // On gère les questions
  if (msg.content.startsWith('<@248533866778722305>') && msg.content.substring(msg.content.length - 1) === '?') {
    msg.reply(ask.ask()).catch((error) => {
      logger.log('error', 'Erreur ask message', error);
    });
    return;
  }
  // Traitement du message
  const command = msg.content.match(/^![\w+-]+/);
  if (command === null) {
    return;
  }
  const args = command.input.split(' ').splice(1);
  if (Object.prototype.hasOwnProperty.call(commands, command[0])) {
    commands[command[0]].method(msg, args);
  }
}

client.on('message', (msg) => {
  processMsg(msg);
});

// ERROR MANAGEMENT
process.on('unhandledRejection', (err) => {
  logger.log('error', 'Uncaught Promise Error:', err.stack);
});

process.on('uncaughtException', (err) => {
  logger.log('error', 'Uncaught Exception Error', err.stack);
});

process.on('SIGINT', () => {
  logger.log('info', 'Manually disconnected');
  client.destroy();
  process.exit();
});

client.login(process.env.EL_PUER_TOKEN);
