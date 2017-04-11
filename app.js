require('dotenv').config();
const winston = require('winston');
const Discord = require('discord.js');
const lol = require('./modules/lol');
const ow = require('./modules/ow');
const wow = require('./modules/wow');
const rl = require('./modules/rl');
const jvc = require('./modules/jvc');
const music = require('./modules/music');

// DISCORD EVENTS
const client = new Discord.Client();

client.on('ready', () => {
    logger.log('info', `Logged in as ${client.user.username}#${client.user.discriminator}`);
});

client.on('message', msg => {
    processMsg(msg);
});

client.on('disconnect', () => {
    logger.log('info', `Disconnected`);
});

// LOG CONFIGURATION
let logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({filename: 'elpuer.log'})
    ]
});

// COMMANDS
let commands = {
    '!el-puer': {
        'usage': '!el-puer',
        'description': 'Appelle ce brave El Puer',
        method: (msg) => {
            msg.channel.sendMessage('Je suis El Puer, fidèle et brave animal ! :dog:');
        }
    },
    '!lol': {
        'usage': '!lol [region] [summoner]',
        'description': 'Affiche le classement League of Legends du joueur [summoner]',
        method: (msg, args) => {
            if (args.length < 2) {
                msg.reply('Usage : !lol [region] [summoner]');
                return;
            }
            lol.setRegion(args[0]).then((region) => {
                lol.getSummonerId(region, args[1]).then(id => {
                    lol.getSummonerLeague(region, id, msg.guild.emojis).then(message => {
                        sendEmbedMessage(msg, '', 29913, message).catch(error => {
                            logger.log('error', `Erreur LoL - ${message}`, error);
                        });
                    }).catch(reason => {
                        msg.reply(reason);
                    });
                }).catch(reason => {
                    msg.reply(reason);
                });
            }).catch(reason => {
                msg.reply(reason);
            });
        }
    },
    '!ow': {
        'usage': '!ow [region] [battle-tag]',
        'description': 'Affiche le classement Overwatch du joueur [battle-tag]',
        method: (msg, args) => {
            if (args.length < 2) {
                msg.reply('Usage : !ow [region] [battle-tag]');
                return;
            }
            ow.setRegion(args[0]).then((region) => {
                ow.getProfileByBattleTag(region, args[1], msg.guild.emojis).then(message => {
                    sendEmbedMessage(msg, '', 16768000, message).catch(error => {
                        logger.log('error', `Erreur OW Message - ${message}`, error);
                    });
                }).catch(reason => {
                    msg.reply(reason);
                });
            }).catch(reason => {
                msg.reply(reason);
            });
        }
    },
    '!rl': {
        'usage': '!rl [steam-id]',
        'description': 'Affiche le classement Rocket League du joueur [steam_id]',
        method: (msg, args) => {
            if (args.length < 1) {
                msg.reply('Usage : !rl [steam-id]');
                return;
            }
            rl.getPlayerRanks(args[0]).then(message => {
                msg.channel.sendMessage(message).catch(error => {
                    logger.log('error', `Erreur RL Message - ${message}`, error);
                });
            }).catch(reason => {
                msg.reply(reason);
            });
        }
    },
    '!wow': {
        'usage': '!wow [region] [realm] [character]',
        'description': 'Affiche des infos sur le personnage [character] de World of Warcraft',
        method: (msg, args) => {
            if (args.length < 3) {
                msg.reply('Usage : !wow [region] [realm] [character]');
                return;
            }
            wow.setRegion(args[0]).then((region) => {
                wow.getCharacterInformations(region, args[1], args[2], msg.guild.emojis).then(obj => {
                    sendEmbedMessage(msg, '', 16728374, obj.embed, obj.thumbnail).catch(error => {
                        logger.log('error', `Erreur WoW Message - ${obj.embed}`, error);
                    });
                }).catch(reason => {
                    msg.reply(reason);
                });
            }).catch(reason => {
                msg.reply(reason);
            });
        }
    },
    '!jvc': {
        'usage': '!jvc [type] [platform]',
        'description': 'Affiche les dernières infos, news et vidéos depuis JVC par platforme',
        method: (msg, args) => {
            if (args.length < 2) {
                msg.reply('Usage : !jvc [type] [platform]');
                return;
            }
            jvc.getNewsByTypePlatform(args[0], args[1]).then(message => {
                sendEmbedMessage(msg, '', 16745755, message).catch(error => {
                    logger.log('error', `Erreur WoW Message - ${message}`, error);
                });
            }).catch(reason => {
                msg.reply(reason);
            })
        }
    },
    '!play': {
        'usage': '!play [youtube-url]',
        'description': 'Joue une musique YouTube dans le salon actuel',
        method: (msg, args) => {
            if (args.length < 1) {
                msg.reply('Usage : !play [youtube-url]');
                return;
            }
            music.play(msg.member.voiceChannel, args[0]).then(message => {
                msg.channel.sendMessage(message).catch(error => {
                    logger.log('error', `Erreur Play Message - ${message}`, error);
                });
            }).catch(reason => {
                msg.reply(reason);
            });
        }
    },
    '!stop': {
        'usage': '!stop',
        'description': 'Stoppe la lecture d\'une musique YouTube dans le salon actuel',
        method: (msg) => {
            music.stop(msg.member.voiceChannel).then(message => {
                msg.channel.sendMessage(message).catch(error => {
                    logger.log('error', `Erreur Stop Message - ${message}`, error);
                });
            }).catch(reason => {
                msg.reply(reason);
            });
        }
    },
    '!help': {
        'usage': '!help',
        'description': 'Affiche l\'aide pour ce brave ElPuer',
        method: (msg) => {
            let embed = [];
            for (let command in commands) {
                embed.push({
                    'name': commands[command].usage,
                    'value': commands[command].description
                });
            }
            sendEmbedMessage(msg, 'Liste des commandes pour ce brave El Puer :dog: :', 16777215, embed).catch(error => {
                logger.log('error', `Erreur help message`, error);
            });
        }
    }
};

function sendEmbedMessage(msg, message, color, fields, footer = null) {
    let rich = {
        embed: {
            color: color,
            author: {
                name: msg.author.username,
                icon_url: msg.author.avatarURL
            },
            fields: fields
        }
    };
    if (footer !== null) {
        rich.footer = {
            icon_url: footer
        }
    }
    return msg.channel.sendMessage(message, rich);
}

function processMsg(msg) {
    // On ne traite pas les messages de bot
    if (msg.author.bot) return;
    // Si l'utilisateur a le rôle mongolien
    if (msg.member._roles.find(element => {
            return element === '182943519697141761';
        })) {
        msg.reply('Ta gueule sous race :middle_finger:');
        return;
    }
    // Traitement du message
    let command = msg.content.match(/^![\w+\-]+/);
    if (command === null) {
        return;
    }
    let args = command['input'].split(' ').splice(1);
    if (commands.hasOwnProperty(command[0])) {
        commands[command[0]].method(msg, args);
    }
}

// ERROR MANAGEMENT
process.on("unhandledRejection", err => {
    logger.log('error', 'Uncaught Promise Error:', err.stack);
});

process.on('uncaughtException', err => {
    logger.log('error', 'Uncaught Exception Error', err.stack);
});

process.on('SIGINT', () => {
    logger.log('info', `Manually disconnected`);
    client.destroy();
    process.exit();
});

client.login(process.env.EL_PUER_TOKEN);