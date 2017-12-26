# ElPuerBot
A peasant bot for Discord

### List of useful commands it provides

|Command|Description|
|-------|-----------|
|!pubg [mode] [user]|Shows PUBG stats.
|!lol [region] [summoner]|Shows League of Legends player ranked stats.
|!ow [region] [battle-tag]|Shows Overwatch player normal and ranked stats.
|!rl [steam-id]|Shows Rocket League player ranked stats.
|!wow [region] [realm] [character]|Shows World of Warcraft character informations, professions, item level and last 3 raids progression.
|!jvc [type] [platform]|Shows last news from jeuxvideo.com
|!play [youtube-url]|Plays audio from a YouTube video in a vocal channel
|!stop|Stop the YouTube audio in the vocal channel
|!help|Display all commands

## Installation
Clone the git repository
```
git clone https://github.com/Dowdow/ElPuerBot.git
```
Install the dependencies
```
npm install
```
Configure the Bot by creating a .env file from the .env.dist file and put some secrets in it
```
EL_PUER_TOKEN=xxxxx      // Your Discord Application Key 
BATTLENET_API_KEY=xxxxx  // Your Battle Net API Key
...
```
Run da bot
```
node app.js
```
Or
```
pm2 start app.js
```
### Logs
El Puer is generating logs using Winston. It will generate a `elpuer.log` file in the main folder.
### Emojis
El Puer is using custom emojis. Since they will not be on your server, you have to upload them with the same name.
If the emojis are not found you will have some `null` in the command response.
