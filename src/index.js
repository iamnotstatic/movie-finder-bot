const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
let bot = new TelegramBot(process.env.BOT_APIKEY, { polling: true });
const request = require('request');
const app = express();

const port = process.env.PORT || 3000;


bot.onText(/\/movie (.+)/, (msg, match) => {
    let movie = match[1];
    let chatId = msg.chat.id;
    request(`http://www.omdbapi.com/?apiKey=${process.env.OMDAPIKEY}&t=${movie}`, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            bot.sendMessage(chatId, '_Looking for _' + movie + '...', { parse_mode: 'Markdown' })
                .then((msg) => {
                    let res = JSON.parse(body);
                    bot.sendPhoto(chatId, res.Poster, { caption: 'Result: \nTitle: ' + res.Title + '\nYear: ' + res.Year + '\nRated: ' + res.Rated + '\nReleased: ' + res.Released + '\nRuntime: ' + res.Runtime + '\nGenre: ' + res.Genre + '\nDirector: ' + res.Director })
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
            `Movie Finder\n A bot where you can search for a movie and get it details.`, { parse_mode: 'Markdown' });
    }
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})