'use strict'

const fs = require('fs')
const fetch = require('node-fetch')
const path = require('path')

// Load env variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const enumerateDates = require('./utils/enumerateDates')
const pathExists = require('./utils/pathExists')
const fsAsync = fs.promises

const DATA_PATH = path.join(__dirname, '..', 'data')
const LIMIT = 50000

async function downloader ({
  type = 'bars', // 'ticks' or 'bars'
  tickers = ['QQQ', 'SPY'],
  from = '2020-10-14',
  to = '2020-10-14',
  timespan = 'minute',
  overwriteFiles = false
}) {
  // Enumerate dates between input dates
  const dates = enumerateDates(from, to)

  const frameId = type === 'ticks' ? type : timespan

  for (const ticker of tickers) {
    for (const date of dates) {
      try {
        const filename = path.join(DATA_PATH, ticker, `${frameId}-${date}.json`)

        // Only fetch & write file if path does not exist or overwriteFiles is true
        if (!(await pathExists(filename)) || overwriteFiles) {
          await download({ ticker, date, type, timespan, overwriteFiles, from, filename })
        } else {
          console.log('File already exists, skipping')
        }
      } catch (error) {
        console.error(`Error downloading ${ticker}/${date}`, error)
      }
    }
  }
}

async function download ({
  ticker,
  date,
  type,
  timespan,
  overwriteFiles,
  from,
  filename
}) {
  let url

  if (type === 'ticks') {
    url = `https://api.polygon.io/v2/ticks/stocks/nbbo/${ticker}/${from}?reverse=false&limit=${LIMIT}&apiKey=${process.env.POLYGON_API_KEY}`
  } else {
    url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/${timespan}/${date}/${date}?unadjusted=false&sort=asc&limit=${LIMIT}&apiKey=${process.env.POLYGON_API_KEY}`
  }

  const res = await fetch(url)
  const data = await res.text()

  if (data.status !== 'ERROR') {
    const dirPath = path.join(DATA_PATH, ticker)

    // Only write directory if does not exist
    if (!(await pathExists(dirPath))) {
      console.log(`Writing directory ${dirPath}`)

      await fsAsync.mkdir(dirPath)
    }

    console.log(`Writing file ${filename}`)

    await fsAsync.writeFile(filename, data, 'utf-8')
  }
}

// Run downloader
downloader({
  from: '2016-01-01',
  to: '2021-02-13'
})
