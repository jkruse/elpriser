import { createCanvas } from 'canvas';
import { format } from 'date-fns/format';
import { da } from 'date-fns/locale/da';
import { env } from 'node:process';
import { setTimeout } from 'node:timers/promises';
import { Telegraf } from 'telegraf';

import drawChart from './chart.mjs';
import getData from './energidataservice.mjs';

async function sendUpdate() {
    const date = new Date(Date.now() + 1000 * 60 * 60 * 24);
    const tomorrow = date.toISOString().substring(0, 10);
    const data = await getData(tomorrow, env.AREA);
    if (!data) {
        return false;
    }
    const canvas = createCanvas(800, 500);
    drawChart(canvas, tomorrow, env.AREA, data);
    const stream = canvas.createPNGStream();

    const bot = new Telegraf(env.BOT_ID);
    await bot.telegram.sendPhoto(env.CHAT_ID, { source: stream }, { caption: format(date, 'd. LLLL yyyy', { locale: da }) });
    console.log('Daily update complete!');

    return true;
}

while (!await sendUpdate()) {
    console.log('No data, sleeping for 3 minutes...');
    await setTimeout(180_000);
}
