const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.BOT_APIKEY, { polling: false });
const request = require('request');
const http = require("http");
const packageInfo = require('../package.json');
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.json({ version: packageInfo.version });
});

setInterval(function () {
    http.get("http://fatais-bot.herokuapp.com");
}, 300000); // every 5 minutes (300000)

bot.onText(/\/movie (.+)/, (msg, match) => {
    let movie = match[1];
    let chatId = msg.chat.id;
    request(`http://www.omdbapi.com/?apiKey=${process.env.OMDAPIKEY}&t=${movie}`, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            bot.sendMessage(chatId, '_Looking for _' + movie + '...', { parse_mode: 'Markdown' })
                .then((msg) => {
                    let res = JSON.parse(body);
                    bot.sendPhoto(chatId, res.Poster, { caption: 'Result: \nTitle: ' + res.Title + '\nYear: ' + res.Year + '\nRated: ' + res.Rated + '\nReleased: ' + res.Released + '\nRuntime: ' + res.Runtime + '\nGenre: ' + res.Genre + '\nDirector: ' + res.Director + '\nPlot: ' + res.Plot })
                        .catch((err) => {
                            if (err) {
                                bot.sendMessage(chatId, 'Bad request, Please check the title and try again');
                            }
                        })
                })

        }
    })
})


// Get about Bot
bot.onText(/\/about (.+)/, (msg, match) => {
    if (match[1]) {
        let chatId = msg.chat.id;
        bot.sendMessage(chatId,
            `Movie Finder\nA bot where you can search for a movie and get it details.`, { parse_mode: 'Markdown' });
    }
})


app.listen(port, function () {
    console.log(`Server is up on port ${port}`);
});