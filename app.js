const Discord = require('discord.js');
const rls = require('rls-api');
const lol = require('./lol');
require('dotenv').config();

// CONFIGUTATION DES MODULES
const client = new Discord.Client();
const rlsclient = new rls.Client({
    token: process.env.RLS_TOKEN
});
lol.setKey(process.env.RIOT_KEY);

client.on('ready', () => {
    console.log('Logged in as ' + client.user.username + '#' + client.user.discriminator);
});

client.on('message', msg => {
    processMsg(msg);
});

var commands = {
    '!el-puer': {
        'description': '!el-puer - Appelle ce brave El Puer',
        method: (msg, args) => {
            msg.channel.sendMessage('Je suis El Puer, fidèle et brave animal ! :dog:');
        }
    },
    '!rl-rank': {
        'description': '!rl-rank [steam-id] - Affiche le classement Rocket League du joueur [steam_id]',
        method: (msg, args) => {
            rlsclient.getPlayer(args[0], rls.platforms.STEAM, (status, data) => {
                if (status == 200) {
                    console.log(data);
                } else {
                    msg.channel.sendMessage('Le service Rocket League Stats est inaccessible pour l\'instant ... :dog:');
                }
            });
        }
    },
    '!lol': {
        'description': '!lol [region] [summoner] - Affiche le classement League of Legends du joueur [summoner]',
        method: (msg, args) => {
            if (args.length < 2) {
                msg.reply('Usage : !lol [region] [summoner]');
                return;
            }
            lol.setRegion(args[0]).then(() => {
                lol.getSummonerId(args[1]).then((id) => {
                    lol.getSummonerLeague(id).then((message)=> {
                        msg.channel.sendMessage(message);
                    }).catch((reason)=> {
                        msg.reply(reason);
                    });
                }).catch((reason) => {
                    msg.reply(reason);
                });
            }).catch(() => {
                msg.reply('Cette région n\'existe pas ... \nRégions disponible : br, eune, euw, jp, kr, lan, las, na, oce, tr, ru, pbe');
            });
        }
    },
    '!help': {
        'description': '!help - Affiche l\'aide pour ce brave ElPuer',
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
        msg.reply('Commande inconnue ... !help pour avoir la liste des commandes de ce brave El Puer :dog:')
    }
}

client.login(process.env.EL_PUER_TOKEN);