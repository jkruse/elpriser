import { createCanvas } from "canvas";
import { Telegraf } from "telegraf";
import { setTimeout } from "timers/promises";
import { format } from "date-fns";
import { da } from "date-fns/locale/index.js";

import getData from "./energidataservice.mjs"
import drawChart from "./chart.mjs";

async function sendUpdate() {
    const date = new Date(Date.now() + 1000*60*60*24);
    const tomorrow = date.toISOString().substring(0, 10);
    const data = await getData(tomorrow, process.env.AREA);
    const canvas = createCanvas(800, 500);
    drawChart(canvas, tomorrow, process.env.AREA, data);
    const stream = canvas.createPNGStream();

    const bot = new Telegraf(process.env.BOT_ID);
    bot.telegram.sendPhoto(process.env.CHAT_ID, { source: stream }, { caption: format(date, 'd. LLLL yyyy', { locale: da }) });
    console.log('Daily update complete!');

    return true;
}

while (!await sendUpdate()) {
    console.log('No data, sleeping for 60 seconds...');
    await setTimeout(60000);
}
