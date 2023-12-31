const wwa = require('whatsapp-web-api');
const fs = require('fs');
const chalk = require('chalk');
const config = require('./config/settings.js');
const client = require('./includes/client.js');

const {
  makeWASocket
} = wwa;

const startServer = (config, client) => {
  return makeWASocket(config, client);
};

startServer(config, client);