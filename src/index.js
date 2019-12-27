const TelegramBot = require('node-telegram-bot-api');
const token = "856665736:AAGssvnrur4kcmCYt-VgzBgTVQgp4Oa1mDU";
let bot = new TelegramBot(token, { polling: true });
const request = require('request');

bot.onText(/\/movie (.+)/, (msg, match) => {
    let movie = match[1];
    let chatId = msg.chat.id;
    request(`http://www.omdbapi.com/?apiKey=4664d79d&t=${movie}`, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            bot.sendMessage(chatId, '_Looking for _' + movie + '...', { parse_mode: 'Markdown' });
            bot.sendMessage(chatId, 'Result:\n ' + body);
        }
    })
})