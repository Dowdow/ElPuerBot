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
    console.log(`Logged in as ${client.user.username}#${client.user.discriminator}`);
});

client.on('message', msg => {
    processMsg(msg);
});

client.on('disconnect', () => {
    console.log(`Disconnected`);
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
        'description': '**!el-puer** - Appelle ce brave El Puer',
        method: (msg, args) => {
            msg.channel.sendMessage('Je suis El Puer, fidèle et brave animal ! :dog:');
        }
    },
    '!lol': {
        'description': '**!lol [region] [summoner]** - Affiche le classement League of Legends du joueur [summoner]',
        method: (msg, args) => {
            if (args.length < 2) {
                msg.reply('Usage : !lol [region] [summoner]');
                return;
            }
            lol.setRegion(args[0]).then(() => {
                lol.getSummonerId(args[1]).then(id => {
                    lol.getSummonerLeague(id, msg.guild.emojis).then(message => {
                        msg.channel.sendMessage(message).catch(error => {
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
        'description': '**!ow [region] [battle-tag]** - Affiche le classement Overwatch du joueur [battle-tag]',
        method: (msg, args) => {
            if (args.length < 2) {
                msg.reply('Usage : !ow [region] [battle-tag]');
                return;
            }
            ow.setRegion(args[0]).then(() => {
                ow.getProfileByBattleTag(args[1], msg.guild.emojis).then(message => {
                    msg.channel.sendMessage(message).catch(error => {
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
        'description': '**!rl [steam-id]** - Affiche le classement Rocket League du joueur [steam_id]',
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
        'description': '**!wow [region] [realm] [character]** - Affiche des infos sur le personnage [character] de World of Warcraft',
        method: (msg, args) => {
            if (args.length < 3) {
                msg.reply('Usage : !wow [region] [realm] [character]');
                return;
            }
            wow.setRegion(args[0]).then(() => {
                wow.getCharacterInformations(args[1], args[2], msg.guild.emojis).then(obj => {
                    msg.channel.sendMessage(obj.message).catch(error => {
                        logger.log('error', `Erreur WoW Message - ${obj.message}`, error);
                    });
                    msg.channel.sendFile(obj.thumbnail).catch(error => {
                        logger.log('error', `Erreur WoW Fichier - ${obj.thumbnail}`, error);
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
        'description': '**!jvc [type] [platform]** - Affiche les dernières infos, news et vidéos depuis JVC par platforme',
        method: (msg, args) => {
            if (args.length < 2) {
                msg.reply('Usage : !jvc [type] [platform]');
                return;
            }
            jvc.getNewsByTypePlatform(args[0], args[1]).then(message => {
                msg.channel.sendMessage(message).catch(error => {
                    logger.log('error', `Erreur JVC Message - ${message}`, error);
                });
            }).catch(reason => {
                msg.reply(reason);
            })
        }
    },
    '!play': {
        'description': '**!play [youtube-url]** - Joue une musique YouTube dans le salon actuel',
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
        'description': '**!stop** - Stoppe la lecture d\'une musique YouTube dans le salon actuel',
        method: (msg, args) => {
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
        'description': '**!help** - Affiche l\'aide pour ce brave ElPuer',
        method: (msg, args) => {
            let response = 'Liste des commandes pour ce brave El Puer :dog: : \n\n';
            for (let command in commands) {
                response += commands[command].description + '\n\n';
            }
            msg.channel.sendMessage(response);
        }
    }
};

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
    if (command == null) {
        return;
    }
    let args = command['input'].split(' ').splice(1);
    if (commands.hasOwnProperty(command[0])) {
        commands[command[0]].method(msg, args);
        return;
    }
    msg.reply('Commande inconnue ... !help pour avoir la liste des commandes de ce brave El Puer :dog:');
}

// ERROR MANAGEMENT
process.on("unhandledRejection", err => {
    logger.log('error', 'Uncaught Promise Error:', err.stack);
});

process.on('uncaughtException', err => {
    logger.log('error', 'Uncaught Exception Error', err.stack);
});

process.on('SIGINT', () => {
    client.destroy();
    process.exit();
});

client.login(process.env.EL_PUER_TOKEN);