const Telegraf = require('telegraf')
const express = require('express')
const app = express()

const camara = require('./commands/camara');
const location = require('./commands/location');
const ayuda = require('./commands/ayuda');

require('dotenv').config();

// require('./db');

const { User } = require('./db')

const bot = new Telegraf(process.env.BOT_TOKEN)
app.use(bot.webhookCallback('/secret-path'))
bot.telegram.setWebhook(`${process.env.MAIN_URL}/secret-path`)

app.post('/secret-path', (req, res) => {
    res.send('Hello World!')
})

bot.use(async (ctx, next) => {
    const user = await User.findOne({
        where: { telegram_id: ctx.message.from.id }
    });
    if (!user) {
        await User.create({
            telegram_id: ctx.message.from.id,
            first_name: ctx.message.from.first_name || "",
            last_name: ctx.message.from.last_name || "",
            username: ctx.message.from.username || "",
            is_bot: ctx.message.from.is_bot || false,
            language_code: ctx.message.from.language_code || 'es'
        });
    }
    next();
});

bot.use((ctx, next) => {
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

bot.command('ayuda', ctx => {
    bot.telegram.sendMessage(ctx.userId, ayuda);
});

bot.command('start', ctx => {
    bot.telegram.sendMessage(ctx.userId, ayuda);
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Servidor arrancado!')
})
