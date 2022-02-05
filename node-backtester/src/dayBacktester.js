'use strict'

const fs = require('fs').promises
const path = require('path')

const DATA_PATH = path.join(__dirname, '../../data/ohlc')

async function loadData () {
  const data = {}

  console.log('Loading data...')

  const symbolFilenames = await fs.readdir(DATA_PATH)

  for (const filename of symbolFilenames) {
    const fileContents = await fs.readFile(path.join(DATA_PATH, filename), 'utf-8')

    const lines = fileContents.split('\n')
    lines.pop()

    for (const line of lines) {
      const values = line.split(',')

      const day = {
        ticker: values[0],
        date: values[1],
        open: values[2],
        high: values[3],
        low: values[4],
        close: values[5],
        volume: values[6],
        after: values[7],
        pre: values[8]
      }

      if (day.date in data) {
        data[day.date].push(day)
      } else {
        data[day.date] = [day]
      }
    }
  }

  return data
}

async function dayBacktester () {
  try {
    const data = await loadData()
    const dates = Object.keys(data).reverse()
    const startingCapital = 100000
    let cash = startingCapital
    let pl = 0
    let plPercentage = 0
    const dayPls = []

    for (let dateIndex = 0; dateIndex < dates.length; dateIndex++) {
      const currentDate = dates[dateIndex]
      const previousDate = dateIndex > 0 ? dates[dateIndex - 1] : null

      if (previousDate) {
        const previousGains = []
        let tickerToTrade = null

        for (let i = 0; i < data[currentDate].length; i++) {
          if (data[currentDate][i] && data[previousDate][i]) {
            const startingPrice = data[previousDate][i].close
            const endingPrice = data[currentDate][i].pre
            const previousGain = endingPrice - startingPrice
            const percentageGain = (previousGain / startingPrice) * 100
            const ticker = data[currentDate][i].ticker

            previousGains.push({
              previousGain,
              percentageGain,
              ticker
            })

            if (ticker === 'TQQQ' && percentageGain >= 0.1) {
              tickerToTrade = 'TQQQ'
            } else if (ticker === 'SQQQ' && percentageGain >= 0.3) {
              tickerToTrade = 'SQQQ'
            }

            /*
            if (ticker === 'TQQQ' || ticker === 'SQQQ') {
              console.log(percentageGain)
            }
            */
          }
        }

        for (const record of data[currentDate]) {
          if (record.ticker === tickerToTrade) {
            // console.log('Trading:', tickerToTrade)
            const startingCashBeforeTrade = cash

            // Open long
            const sharesToBuy = Math.floor(cash / record.open)
            const openingMarketValue = record.open * sharesToBuy
            cash -= openingMarketValue

            // Close long
            const closingMarketValue = record.close * sharesToBuy
            cash += closingMarketValue

            const tradePl = cash - startingCashBeforeTrade
            const tradePlPercentage = (tradePl / startingCashBeforeTrade) * 100

            dayPls.push(tradePlPercentage)

            console.log('Trading:', tickerToTrade, '\t', tradePlPercentage, '\t', currentDate)

            tickerToTrade = null
          }
        }
      }
    }

    /*
    for (let dateIndex = 0; dateIndex < dates.length; dateIndex++) {
      const currentDate = dates[dateIndex]
      const previousDate = dateIndex > 0 ? dates[dateIndex - 1] : null

      if (previousDate) {
        const previousGains = []

        for (let i = 0; i < data[currentDate].length; i++) {
          if (data[currentDate][i] && data[previousDate][i]) {
            previousGains.push({
              previousGain: data[currentDate][i].pre - data[previousDate][i].close,
              ticker: data[currentDate][i].ticker
            })
          }
        }

        let tickerToTrade = null

        for (const previousGain of previousGains) {
          if (previousGain.previousGain === 0) {
            tickerToTrade = previousGain.ticker
            break
          }
          tickerToTrade = null
        }

        // const sortedPreviousGains = previousGains.sort((a, b) => a.previousGain - b.previousGain)

        // console.log(currentDate, sortedPreviousGains)

        // const tickerToTrade = sortedPreviousGains[sortedPreviousGains.length - 1].ticker
        // const tickerToTrade = sortedPreviousGains[0].ticker

        for (const record of data[currentDate]) {
          if (record.ticker === tickerToTrade) {
            // console.log('Trading:', tickerToTrade)
            const startingCashBeforeTrade = cash

            // Open long
            const sharesToBuy = Math.floor(cash / record.open)
            const openingMarketValue = record.open * sharesToBuy
            cash -= openingMarketValue

            // Close long
            const closingMarketValue = record.close * sharesToBuy
            cash += closingMarketValue

            const tradePl = cash - startingCashBeforeTrade
            const tradePlPercentage = (tradePl / startingCashBeforeTrade) * 100

            dayPls.push(tradePlPercentage)

            console.log('Trading:', tickerToTrade, '\t', tradePlPercentage)
          }
        }
      }
    }
    */

    /*
    for (let dateIndex = 0; dateIndex < dates.length; dateIndex++) {
      const currentDate = dates[dateIndex]
      const previousDate = dateIndex > 0 ? dates[dateIndex - 1] : null

      if (previousDate) {
        const previousGains = data[previousDate].map(record => ({
          previousGain: record.close - record.open,
          ...record
        }))
        const sortedPreviousGains = previousGains.sort((a, b) => a.previousGain - b.previousGain)

        const tickerToTrade = sortedPreviousGains[Math.round((sortedPreviousGains.length - 1) / 2)].ticker

        for (const record of data[currentDate]) {
          if (record.ticker === tickerToTrade) {
            console.log('Trading:', tickerToTrade)
            // Open long
            const sharesToBuy = Math.floor(cash / record.open)
            const openingMarketValue = record.open * sharesToBuy
            cash -= openingMarketValue

            // Close long
            const closingMarketValue = record.close * sharesToBuy
            cash += closingMarketValue
          }
        }
      }
    }
    */

    /*
    const maxPreviousGain = Math.max(...previousGains)
    const minPreviousGain = Math.min(...previousGains)
    const maxPreviousGainTicker = data[previousDate][previousGains.indexOf(maxPreviousGain)].ticker
    const minPreviousGainTicker = data[previousDate][previousGains.indexOf(minPreviousGain)].ticker
    */

    /*
    for (const date of dates) {
      const records = data[date]

      for (const record of records) {
        if (record.ticker === 'AAPL') {
          // Open long
          const sharesToBuy = Math.floor(cash / record.open)
          const openingMarketValue = record.open * sharesToBuy
          cash -= openingMarketValue

          // Close long
          const closingMarketValue = record.close * sharesToBuy
          cash += closingMarketValue
        }
      }
    }
    */

    // Calculate PL
    pl = cash - startingCapital
    plPercentage = (pl / startingCapital) * 100

    let averageDayPl = 0
    for (const dayPl of dayPls) {
      averageDayPl += dayPl
    }
    averageDayPl = averageDayPl / dayPls.length

    console.table({
      startingCapital,
      cash,
      pl,
      plPercentage,
      averageDayPl
    })
  } catch (error) {
    console.error('dayBacktester error', error)
  }
}

dayBacktester()
