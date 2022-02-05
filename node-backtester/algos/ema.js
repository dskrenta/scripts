const { EMA } = require('technicalindicators')

const backtester = require('../src/backtester')

async function ema () {
  try {
    const FROM = '2021-01-01'
    const TO = '2021-03-10'
    const EMA_PERIOD = 10000
    const TAKE_PROFIT_PERCENTAGE = 1.001
    const STOP_LOSS_PERCENTAGE = 0.99
    const SYMBOL = 'AAPL'

    const ema = new EMA({ period: EMA_PERIOD, values: [] })
    const emaResults = []
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
      symbols: [SYMBOL],
      // from: '2021-03-01',
      from: FROM,
      to: TO,
      // candlePeriods: [60],
      onNewTrade
    })

    function onNewTrade (record) {
      // console.log(record.marketHours)

      if (record.symbol === SYMBOL && record.marketHours === 'open') {
        // Update EMA
        const nextEmaValue = ema.nextValue(record.price)
        if (nextEmaValue) {
          emaResults.push(nextEmaValue)
        }

        // Identify SMA price crossovers
        if (record.price < nextEmaValue && above) {
          // console.log('price crossed below moving average')
          above = false
        } else if (record.price > nextEmaValue && !above) {
          // console.log('price crossed above moving average')
          above = true

          if (getPositions().length === 0) {
            const metrics = accountValues()
            const sharesToBuy = Math.round(metrics.buyingPower / record.price) - 10

            console.log(`Buy order for ${sharesToBuy} shares`, record.price, record.symbol, record.easternTime, record.jsDate, metrics.plPercentage)

            createOrder({
              symbol: SYMBOL,
              side: 'buy',
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
    console.error('ema backtest error', error)
  }
}

ema()
