const backtester = require('./backtester')

async function test () {
  try {
    const {
      runBacktest,
      accountValues,
      createOrder,
      cancelOrder,
      cancelAllOrders,
      getOrder,
      getOrders,
      closePositions,
      closePosition,
      getPosition,
      getPositions,
      renderChart
    } = backtester({
      symbols: ['AAPL', 'SPY'],
      from: '2021-03-01',
      to: '2021-03-01',
      onNewTrade,
      onNewQuote
    })

    let tradeIndex = 0

    function onNewTrade (record) {
      if (tradeIndex === 10000) {
         createOrder({
          symbol: 'SPY',
          qty: 100,
          side: 'sell'
        })
      }

      /*
      if (record.ohlc['60'].complete) {
        console.log(record)
      }
      */

      tradeIndex++
    }

    function onNewQuote (record) {
      // console.log('quote', record)
    }

    createOrder({
      symbol: 'AAPL',
      qty: 100,
      side: 'buy'
    })

    createOrder({
      symbol: 'SPY',
      qty: 100,
      side: 'buy'
    })

    await runBacktest()

    console.log(accountValues())
  } catch (error) {
    console.error('Test backtester error', error)
  }
}

test()
