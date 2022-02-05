// const { EMA, BollingerBands } = require('technicalindicators')

const backtester = require('../src/backtester')

async function qqqDirection () {
  try {
    const FROM = '2021-02-12'
    const TO = '2021-03-12'
    const EMA_PERIOD = 25000

    // const ema = new EMA({ period: EMA_PERIOD, values: [] })
    // const smaResults = []

    // const bb = new BollingerBands({ period: SMA_PERIOD, stdDev: 1, values: [] })
    // const bbResults = []

    let trading = false
    let goingLong = false
    let goingShort = false
    let above = false

    // Init backtester
    const {
      runBacktest,
      accountValues,
      createOrder,
      closePosition,
      closePositions,
      getPositions
    } = backtester({
      symbols: ['QQQ', 'TQQQ', 'SQQQ'],
      from: FROM,
      to: TO,
      // candlePeriods: [60],
      onNewTrade
    })

    function closeCurrentPositions (record) {
      for (const position of getPositions()) {
        closePosition(position.symbol)
        console.log('Closed position in', position.symbol, '\t', record.easternTime, '\t', position.qty, '\t', accountValues().plPercentage)
      }
    }

    function goLong (record) {
      closeCurrentPositions(record)

      const metrics = accountValues()
      const sharesToBuy = Math.round(metrics.buyingPower / record.price) - 10

      createOrder({
        symbol: 'TQQQ',
        side: 'buy',
        qty: sharesToBuy,
        type: 'market'
      })

      console.log('Opened position in TQQQ', '\t', record.easternTime, '\t', sharesToBuy, '\t', metrics.plPercentage)
    }

    function goShort (record) {
      closeCurrentPositions(record)

      const metrics = accountValues()
      const sharesToBuy = Math.round(metrics.buyingPower / record.price) - 10

      createOrder({
        symbol: 'SQQQ',
        side: 'buy',
        qty: sharesToBuy,
        type: 'market'
      })

      console.log('Opened position in SQQQ', '\t', record.easternTime, '\t', sharesToBuy, '\t', metrics.plPercentage)
    }

    function getCurrentSymbol () {
      const currentPositions = getPositions()
      if (currentPositions.length >= 1) {
        return currentPositions[0].symbol
      }

      return null
    }

    const N = 2
    let tradeIndex = 0
    let lastNTradeAverage = 0
    let lastNMin = 0
    let lastNMax = 0
    const lastNTrades = []

    function onNewTrade (record) {
      if (record.easternTime.slice(0, 5) === '09:30' && !trading) {
        console.log('Market open', record.jsDate)
        trading = true
      }

      if (record.easternTime.slice(0, 5) === '16:25' && trading) {
        closeCurrentPositions(record)

        console.log('Market closed', record.jsDate)
        trading = false
      }

      if (record.symbol === 'TQQQ' && goingLong) {
        goingLong = false
        goLong(record)
      }

      if (record.symbol === 'SQQQ' && goingShort) {
        goingShort = false
        goShort(record)
      }

      if (record.symbol === 'QQQ') {
        if (record.volume > 100) {
          lastNTrades.push(record.price)

          if (tradeIndex >= N) {
            lastNTrades.shift()
          }

          lastNTradeAverage = lastNTrades.reduce((a, b) => (a + b)) / lastNTrades.length

          // console.log('record price', record.price, 'last 100 trade average', last100TradeAverage, 'last 100 min', Math.min(...last100Trades), 'last 100 max', Math.max(...last100Trades))

          lastNMin = Math.min(...lastNTrades)
          lastNMax = Math.max(...lastNTrades)
          lessThanLastN = lastNTrades.every(price => price < record.price)
          greaterThanLastN = lastNTrades.every(price => price > record.price)

          // console.log(lessThanLastN, greaterThanLastN)

          if (lessThanLastN) {
            console.log('Less than last N')
          }

          if (greaterThanLastN) {
            console.log('Greater than last N')
          }

          /*
          if (trading) {
            if (lastNMin > record.price && (getCurrentSymbol() === 'SQQQ' || getPositions().length === 0)) {
              goingLong = true
            } else if (lastNMax < record.price && (getCurrentSymbol() === 'TQQQ' || getPositions().length === 0)) {
              goingShort = true
            }
          }
          */

          /*
          if (trading) {
            if (last100TradeAverage > record.price && (getCurrentSymbol() === 'TQQQ' || getPositions().length === 0)) {
              goingShort = true
            } else if (last100TradeAverage < record.price && (getCurrentSymbol() === 'SQQQ' || getPositions().length === 0)) {
              goingLong = true
            }
          }
          */

          tradeIndex++
        }


        /*
        if (trading) {
          if (lastNMin > record.price && (getCurrentSymbol() === 'SQQQ' || getPositions().length === 0)) {
            goingLong = true
          } else if (lastNMax < record.price && (getCurrentSymbol() === 'TQQQ' || getPositions().length === 0)) {
            goingShort = true
          }
        }
        */
      }
    }

    // Run backtest
    await runBacktest()

    // Log account values
    console.table(accountValues())
  } catch (error) {
    console.error('ema backtest error', error)
  }
}

qqqDirection()
