const { SMA, BollingerBands } = require('technicalindicators')

const backtester = require('../src/backtester')

async function qqqDirection () {
  try {
    const FROM = '2021-02-12'
    const TO = '2021-03-08'
    const SMA_PERIOD = 10000

    // const sma = new SMA({ period: SMA_PERIOD, values: [] })
    // const smaResults = []

    const bb = new BollingerBands({ period: SMA_PERIOD, stdDev: 1, values: [] })
    // const bbResults = []

    let trading = false
    let goingLong = false
    let goingShort = false

    let currentPosition = null

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
        const nextBbValue = bb.nextValue(record.price)
        const currentPositions = getPositions()

        if (nextBbValue && trading) {
          if (record.price <= nextBbValue.lower && (getCurrentSymbol() === 'SQQQ' || currentPositions.length === 0)) {
            goingLong = true
          }

          if (record.price >= nextBbValue.upper && (getCurrentSymbol() === 'TQQQ' || currentPositions.length === 0)) {
            goingShort = true
          }
        }
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
