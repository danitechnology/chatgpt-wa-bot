const chalk = require('chalk');
const config = require('../config/settings.js');

module.exports = async ({
  client,
  msg,
  store
}) => {
  try {
    const body = msg.mtype === 'conversation' ? msg.message.conversation : msg.mtype === 'extendedTextMessage' ? msg.message.extendedTextMessage.text : '';
    const budy = typeof msg.text === 'string' ? msg.text : '';
    const isCommand = body.startsWith(config.prefix) ? body.replace(config.prefix, '').trim().split(/ +/).shift().toLowerCase() : '';
    const command = isCommand.replace(config.prefix, '');
    const args = body.trim().split(/ +/).slice(1);
    const query = q = args.join(' ');
    const query1 = q1 = query.split('|')[0];
    const query2 = q2 = query.split('|')[1];
    const quoted = msg[0];

    if (!config.public_mode) {
      if (!msg.key.fromMe) {
        return;
      };
    };

    if (msg.message) {
      client.readMessages([msg.key]);

      console.log(
        chalk.bgMagenta(' [New Message] '),
        chalk.cyanBright('Time: ') + chalk.greenBright(new Date()) + '\n',
        chalk.cyanBright('Message: ') + chalk.greenBright(budy || msg.mtype) + '\n' +
        chalk.cyanBright('From:'), chalk.greenBright(msg.pushName), chalk.yellow('- ' + msg.sender.split('@')[0]) + '\n' +
        chalk.cyanBright('Chat Type:'), chalk.greenBright(!msg.isGroup ? 'Private Chat - ' + chalk.yellow(client.user.id.split(':')[0]) : 'Group Chat - ' + chalk.yellow(msg.chat.split('@')[0]))
      );
    };
    
    (async () => {
      try {
        const apiUrl = `${config.api.base_url}/api/artificial-intelligence/chatgpt-35`;
        
        const params = {
          api_key: config.api.key,
          question: body
        };
        
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(params)
        };
        
        const response = await fetch(apiUrl, options);
        
        if (!response.ok) {
          return msg.reply('Limit anda telah habis, limit akan direset setiap hari pukul 12 malam waktu indonesia barat (WIB), atau upgrade akun ke premium disini: https://daniapi.biz.id/#plans');
        } else {
          msg.reply('Wait a moment...');
          
          const data = await response.json();
          console.log(data);
        
          const answer = data.data.answer;
          msg.reply(answer);
        };
      } catch (error) {
        console.error(error.message);
      };
    })();
    
    if (!body.startsWith(config.prefix) || body === config.prefix) {
      return;
    };

    switch (command) {
      case 'test': {
        msg.reply('Ok, Success!');
        break;
      };
      
      default: {
        msg.reply(`Command: *${config.prefix}${command}*, tidak tersedia!`);
      };
    };
  } catch (error) {
    msg.reply('Terjadi kesalahan pada server.');
    console.error(error);
  };
};