const { SMA } = require('technicalindicators')

const backtester = require('../src/backtester')

async function tiTest () {
  try {
    const FROM = '2021-03-01'
    const TO = '2021-03-10'
    const SMA_PERIOD = 100000
    const TAKE_PROFIT_PERCENTAGE = 1.01
    const STOP_LOSS_PERCENTAGE = 0.98

    const sma = new SMA({ period: SMA_PERIOD, values: [] })
    const smaResults = []
    let above = false
    let tradeIndex = 0
    let marketOpen = false

    // Init backtester
    const {
      runBacktest,
      accountValues,
      createOrder,
      closePosition,
      closePositions,
      getPositions
    } = backtester({
      symbols: ['QQQ'],
      from: FROM,
      to: TO,
      onNewTrade
    })

    function onNewTrade (record) {
      // console.log(record.marketHours)

      if (record.symbol === 'QQQ' && record.marketHours === 'open') {
        // Update SMA
        const nextSmaValue = sma.nextValue(record.price)
        if (nextSmaValue) {
          smaResults.push(nextSmaValue)
        }

        // Identify SMA price crossovers
        if (record.price < nextSmaValue && above) {
          // console.log('price crossed below moving average')
          above = false
        } else if (record.price > nextSmaValue && !above) {
          // console.log('price crossed above moving average')
          above = true

          if (getPositions().length === 0) {
            const metrics = accountValues()
            const sharesToBuy = Math.round(metrics.buyingPower / record.price) - 10

            console.log(`Placed bullish order for ${sharesToBuy} shares`, record.price, record.symbol, metrics.plPercentage)

            createOrder({
              // symbol: 'SPY',
              symbol: 'QQQ',
              side: 'buy',
              // qty: 100,
              qty: sharesToBuy,
              type: 'market'
            })
          }
        }

        // Take profit & stop loss with market orders
        for (const position of getPositions()) {
          const initialPositionMarketValue = position.qty * position.price

          if (position.marketValue >= (initialPositionMarketValue * TAKE_PROFIT_PERCENTAGE)) {
            console.log('Take profit')
            closePosition(position.symbol)
          } else if (position.marketValue <= (initialPositionMarketValue * STOP_LOSS_PERCENTAGE)) {
            console.log('Stopped out')
            closePosition(position.symbol)
          }
        }
      }

      // Increment trade index
      tradeIndex++
    }

    // Run backtest
    await runBacktest()

    closePositions()

    // Log account values
    console.log(accountValues())
  } catch (error) {
    console.error('tiTest backtest error', error)
  }
}

tiTest()
