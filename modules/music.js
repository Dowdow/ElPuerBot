const yt = require('ytdl-core');

module.exports = {
  play: (voiceChannel, music) => new Promise((resolve, reject) => {
    if (!voiceChannel) {
      reject(new Error('Vous devez être dans un salon vocal pour utiliser cette fonctionnalité'));
    }
    voiceChannel.join()
      .then((connnection) => {
        const stream = yt(music, { audioonly: true });
        const dispatcher = connnection.playStream(stream);
        dispatcher.on('end', () => {
          voiceChannel.leave();
        });
        resolve('La musique est lancée');
      });
  }),
  stop: voiceChannel => new Promise((resolve, reject) => {
    if (!voiceChannel) {
      reject(new Error('Vous devez être dans un salon vocal pour utiliser cette fonctionnalité'));
    }
    voiceChannel.leave();
    resolve('La musique est stoppée');
  }),
};
