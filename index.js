const Telegraf = require('telegraf')
const express = require('express')
const app = express()

const camara = require('./commands/camara');

require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN)
app.use(bot.webhookCallback('/secret-path'))
bot.telegram.setWebhook(`${process.env.MAIN_URL}/secret-path`)

app.post('/secret-path', (req, res) => {
    res.send('Hello World!')
})

bot.use((ctx, next) => {
    ctx.userId = ctx.message.from.id;
    next();
})

bot.command('test', (ctx) => {
    ctx.reply('Esto es una prueba');
});

bot.command('camara', ctx => {
    camara().then(async infocam => {
        await bot.telegram.sendMessage(ctx.userId, infocam.camName);
        bot.telegram.sendPhoto(ctx.userId, infocam.url)
            .then(() => { })
            .catch(err => {
                bot.telegram.sendMessage(ctx.userId, 'Ha ocurrido un error, vuelve a intentarlo');
            });
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Servidor arrancado!')
})
