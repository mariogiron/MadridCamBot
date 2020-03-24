const Telegraf = require('telegraf')
const express = require('express')
const app = express()

const camara = require('./commands/camara');
const location = require('./commands/location');

require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN)
app.use(bot.webhookCallback('/secret-path'))
bot.telegram.setWebhook(`${process.env.MAIN_URL}/secret-path`)

app.post('/secret-path', (req, res) => {
    res.send('Hello World!')
})

bot.use((ctx, next) => {
    console.log(ctx.message);
    ctx.userId = ctx.message.from.id;
    next();
})

bot.use(async (ctx, next) => {
    if (ctx.message.location) {
        // const infocam = await location(ctx.message.location.latitude, ctx.message.location.longitude)
        const infoCam = await camara.closest(ctx.message.location.latitude, ctx.message.location.longitude);
        await bot.telegram.sendMessage(ctx.userId, "Esta es la cámara más cercana a tu ubicación");
        await bot.telegram.sendMessage(ctx.userId, infoCam.camName);
        bot.telegram.sendPhoto(ctx.userId, infoCam.url)
            .then(() => { })
            .catch(err => {
                bot.telegram.sendMessage(ctx.userId, 'Ha ocurrido un error, vuelve a intentarlo');
            });
    } else {
        next();
    }
});

bot.command('camara', ctx => {
    camara.randomCam().then(async infocam => {
        await bot.telegram.sendMessage(ctx.userId, infocam.camName);
        bot.telegram.sendPhoto(ctx.userId, infocam.url)
            .then(() => { })
            .catch(err => {
                bot.telegram.sendMessage(ctx.userId, 'Ha ocurrido un error, vuelve a intentarlo');
            });
    });
});

bot.on('location', ctx => {
    ctx.reply('Me has mandado una localización');
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Servidor arrancado!')
})
