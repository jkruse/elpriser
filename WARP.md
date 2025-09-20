# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Telegram bot that provides Danish electricity price charts for two regions (west and east of Storebælt). The bot fetches day-ahead electricity prices from the Danish Energy Data Service API and generates visual charts using Chart.js on a Node.js canvas backend.

**Key Components:**
- Telegram bot using Telegraf library
- Data fetching from energidataservice.dk API
- Chart generation using Chart.js with canvas backend
- Scheduled execution via cron in Docker container
- Two regional instances: DK1 (west) and DK2 (east) of Storebælt

## Architecture

**Core modules:**
- `src/main.mjs` - Entry point with bot logic and scheduling
- `src/energidataservice.mjs` - API client for Danish Energy Data Service
- `src/chart.mjs` - Chart rendering with Chart.js and canvas

**Data flow:**
1. Main script runs daily at 12:45 via cron
2. Fetches tomorrow's electricity prices for specified area (DK1/DK2)
3. Generates PNG chart with color-coded pricing (green <1 DKK, yellow 1-2 DKK, red >2 DKK)
4. Sends chart to Telegram channel with Danish date formatting

**Environment variables required:**
- `BOT_ID` - Telegram bot token
- `CHAT_ID` - Target Telegram channel/chat ID  
- `AREA` - Price area ("DK1" or "DK2")

## Development Commands

**Local development:**
```bash
# Install dependencies
npm install

# Test chart generation locally (serves HTML test page)
npm test
# Opens http://server on port 8080 with interactive chart

# Run bot locally (requires environment variables)
node src/main.mjs
```

**Docker deployment:**
```bash
# Build image
docker build -t elpriser .

# Run with environment variables
docker run -e BOT_ID=your_bot_token -e CHAT_ID=your_chat_id -e AREA=DK1 elpriser
```

**Node.js version:** 
The project uses Node.js v22.19.0 (specified in `.node-version`)

## Key Implementation Details

**Price processing:**
- Raw prices from API are in øre/MWh, converted to DKK/kWh with 25% VAT
- Formula: `(DayAheadPriceDKK / 1000.0 * 1.25)`

**Chart styling:**
- Color coding: Green (<1 DKK), Yellow (1-2 DKK), Red (>2 DKK)  
- White background plugin for PNG export
- Liberation Sans font family
- Danish locale for date formatting

**Error handling:**
- Retries every 3 minutes if no price data available (common before 12:42 CET)
- Graceful API error handling with console logging

**Docker considerations:**
- Alpine Linux base with required system packages for canvas
- Installs build dependencies temporarily during npm install
- Runs as cron daemon with job at 12:45 daily
- Timezone handling via tzdata package

## Local Testing

Use the included `index.html` file to test chart generation locally without Telegram integration. It provides an interactive date picker to visualize historical and current price data for the DK2 region.

<citations>
<document>
    <document_type>WARP_DOCUMENTATION</document_type>
    <document_id>getting-started/quickstart-guide/coding-in-warp</document_id>
</document>
</citations>
