require('dotenv').config();
const Discord = require('discord.js');
const lol = require('./modules/lol');
const ow = require('./modules/ow');
const wow = require('./modules/wow');
const rl = require('./modules/rl');

// CONFIGUTATION DES MODULES
const client = new Discord.Client();

const DEFAULT_ERROR_MESSAGE = 'Je ne me sens pas très bien ... :nauseated_face: Je subis un bug prévenez mon maître !';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}#${client.user.discriminator}`);
});

client.on('message', msg => {
    processMsg(msg);
});

var commands = {
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
                lol.getSummonerId(args[1]).then((id) => {
                    lol.getSummonerLeague(id).then((message)=> {
                        msg.channel.sendMessage(message).catch(() => {
                            message.reply(DEFAULT_ERROR_MESSAGE);
                        });
                    }).catch((reason)=> {
                        msg.reply(reason);
                    });
                }).catch((reason) => {
                    msg.reply(reason);
                });
            }).catch((reason) => {
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
                ow.getProfileByBattleTag(args[1]).then((obj) => {
                    msg.channel.sendMessage(obj.message).catch(() => {
                        message.reply(DEFAULT_ERROR_MESSAGE);
                    });
                    if (obj.thumbnail !== '') {
                        msg.channel.sendFile(obj.thumbnail).catch(() => {
                            message.reply(DEFAULT_ERROR_MESSAGE);
                        });
                    }
                }).catch((reason) => {
                    msg.reply(reason);
                });
            }).catch((reason) => {
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
            rl.getPlayerRanks(args[0]).then((message) => {
                msg.channel.sendMessage(message).catch(() => {
                    message.reply(DEFAULT_ERROR_MESSAGE);
                });
            }).catch((reason) => {
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
                wow.getCharacterInformations(args[1], args[2]).then((obj) => {
                    msg.channel.sendMessage(obj.message).catch(() => {
                        message.reply(DEFAULT_ERROR_MESSAGE);
                    });
                    msg.channel.sendFile(obj.thumbnail).catch(() => {
                        message.reply(DEFAULT_ERROR_MESSAGE);
                    });
                }).catch((reason) => {
                    msg.reply(reason);
                });
            }).catch((reason) => {
                msg.reply(reason);
            });
        }
    },
    '!help': {
        'description': '**!help** - Affiche l\'aide pour ce brave ElPuer',
        method: (msg, args) => {
            var response = 'Liste des commandes pour ce brave El Puer :dog: : \n';
            for (var command in commands) {
                response += commands[command].description + '\n';
            }
            msg.channel.sendMessage(response);
        }
    }
};

function processMsg(msg) {
    // Si l'utilisateur a le rôle mongolien
    if (msg.member._roles.find((element) => {
            return element === '182943519697141761';
        })) {
        msg.reply('Ta gueule sous race :middle_finger:');
        return;
    }
    // Traitement du message
    if (msg.author.id != client.user.id) {
        var command = msg.content.match(/^![\w+\-]+/);
        if (command == null) {
            return;
        }
        var args = command['input'].split(' ').splice(1);
        if (commands.hasOwnProperty(command[0])) {
            commands[command[0]].method(msg, args);
            return;
        }
        msg.reply('Commande inconnue ... !help pour avoir la liste des commandes de ce brave El Puer :dog:');
    }
}

client.login(process.env.EL_PUER_TOKEN);
