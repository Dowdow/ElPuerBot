const http = require('http');
const Discord = require('discord.js');
require('dotenv').config();

const client = new Discord.Client();

client.on('ready', () => {
    console.log('Logged in as ' + client.user.username + '#' + client.user.discriminator);
});

client.on('message', msg => {
    processMsg(msg);
});

var options = {
    host: 'www.google.com',
    port: 80,
    path: '/index.html'
};

http.get(options, function (res) {
    console.log("Got response: " + res.statusCode);
}).on('error', function (e) {
    console.log("Got error: " + e.message);
});

function processMsg(msg) {
    // Si l'utilisateur a le rôle mongolien
    if (msg.member._roles.find(function (element) {
            return element === '182943519697141761';
        })) {
        msg.reply('Ta gueule sous race :middle_finger:', {'tts': true});
        return;
    }
    // Traitement du message
    switch (msg.content) {
        case 'ski':
            ski();
            break;
    }
}

function ski() {
    var options = {
        host: 'www.skiinfo.fr',
        port: 80,
        path: '/france/bulletin-neige.html?&ud=1&o=resort'
    };
    http.get(options, function (res) {
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        console.log(data.toString());
    }).on('error', function (e) {
        console.log("Got error: " + e.message);
    });

}

client.login(process.env.EL_PUER_TOKEN);
ski();
