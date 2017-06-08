module.exports = {
    ask: () => {
        return responses[Math.floor((Math.random() * responses.length - 1))];
    }
};

let responses = [
    'C\'est ton destin',
    'Le sort en est jeté',
    'Une chance sur deux',
    'Sur un malentendu oui',
    'D\'après moi oui',
    'C\'est certain',
    'La vie de oim oui !',
    'Oui absolument',
    'Tu peux compter dessus fraté',
    'Sans aucun doute narvalo',
    'Très probable',
    'Wallah c\'est du sûr',
    'Oui',
    'C\'est bien parti freulo',
    'C\'est non',
    'Peu probable',
    'Faut pas rêver',
    'N\'y compte pas morray',
    'Impossible zer',
    'Non',
    'Franchement bof',
    'Tellement ap !'
];