'use strict'

const fs = require('fs').promises
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const ora = require('ora')
const zlib = require('zlib')
const { promisify } = require('util')

const enumerateDates = require('./utils/enumerateDates')
const gunzip = promisify(zlib.gunzip)

/*
  TODO:
    - Finish all long order types with both sides
    x Load one day file at a time
    - Metrics, logs & reporting
    x OHLC bar formulation
    x SPY comparison for time period
    x Update order statuses
    x Buying power check on create order
    - Simulate trade network latency

  Extra TODO:
    - Update close long for qty instead of full position
    - Ability to open more then one long at a time in the same symbol
    - Documentation
    - Sample strategies
    - Shorting
    - Save results to file
    - Tests
    - Visuals
    - Node.js downloader for trade and quote data
    - Combine trades & quotes with same timestamp to be returned in group
*/

function backtester ({
  name = 'Sample backtest',
  description = 'Sample backtester instance',
  symbols = [],
  from = '2021-03-05',
  to = '2021-03-05',
  extendedHoursTrading = false,
  startingCapital = 100000,
  marginMultiplier = 1,
  shortingEnabled = false,
  candlePeriods = [], // Candle periods to calculate in seconds
  onNewQuote = () => {},
  onNewTrade = () => {},
  dataPath = path.join(__dirname, '../../data/trade'),
  debug = false
}) {
  try {
    // Backtester instance id
    const backtesterId = uuidv4()

    // Dates between to and from
    const dates = enumerateDates(from, to)

    // Config account values
    let cash = startingCapital
    let buyingPower = startingCapital
    let longMarketValue = 0
    let shortMarketValue = 0
    let equity = cash
    let pl = 0
    let plPercentage = 0
    let data = []
    let marketOpen = false
    let benchmarkNumShares = 0
    let benchmarkMarketValue = startingCapital
    let benchmarkPl = 0
    let benchmarkPlPercentage = 0
    let winLossRatio = 0
    let winningTrades = 0
    let losingTrades = 0
    let totalTrades = 0
    const accountValueTimeSeries = []
    const benchmarkValueTimeSeries = []

    // Orders config
    const orders = new Map()

    // Positions config
    const positions = {}

    // Add SPY to symboles if not included for benchmark
    if (!symbols.includes('SPY')) {
      symbols = ['SPY', ...symbols]
    }

    function accountValues () {
      return {
        startingCapital,
        cash,
        buyingPower,
        longMarketValue,
        shortMarketValue,
        equity,
        cash,
        pl,
        plPercentage,
        marketOpen,
        winningTrades,
        losingTrades,
        winLossRatio,
        totalTrades,
        benchmarkNumShares,
        benchmarkMarketValue,
        benchmarkPl,
        benchmarkPlPercentage
      }
    }

    function parseData (str) {
      const lines = str.split('\n')
      lines.shift()
      lines.pop()

      const parseNumeric = (value) => value ? parseFloat(value) : null

      return lines.map(line => {
        const values = line.split(',')

        const jsDate = new Date()
        const sliced = values[4].slice(0, 13)
        jsDate.setTime(sliced)

        return {
          symbol: values[0],
          date: values[1],
          easternTime: values[2],
          type: values[3],
          timestamp: parseNumeric(values[4]),
          price: parseNumeric(values[5]),
          volume: parseNumeric(values[6]),
          bidPrice: parseNumeric(values[7]),
          askPrice: parseNumeric(values[8]),
          bidVolume: parseNumeric(values[9]),
          askVolume: parseNumeric(values[10]),
          marketHours: values[11] || null,
          jsDate
        }
      })
    }

    function log (...args) {
      if (debug) {
        console.log(...args)
      }
    }

    function createOrder ({
      symbol,
      qty,
      side = 'buy', // buy, sell
      type = 'market', // market, limit, stop
      limitPrice,
      stopPrice,
      timeInForce = 'day',
      extendedHours = false
    }) {
      // if (!marketOpen) return

      if (symbols.includes(symbol)) {
        const orderId = uuidv4()

        if (side === 'buy') {
          orders.set(
            orderId, {
              id: orderId,
              orderStatus: 'open', // open, closed
              symbol,
              qty,
              side,
              type,
              timeInForce,
              extendedHours,
              limitPrice,
              stopPrice
            }
          )
        } else if (side === 'sell' && positions[symbol]) {
          orders.set(
            orderId, {
              id: orderId,
              orderStatus: 'open', // open, closed
              symbol,
              qty,
              side,
              type,
              timeInForce,
              extendedHours,
              limitPrice,
              stopPrice
            }
          )
        } else {
          throw new Error('Shorting not implemented yet')
        }
      } else {
        throw new Error(`Backtester does not have market data for ${symbol} loaded`)
      }
    }

    function cancelOrder (orderId) {
      orders.setItem(orderId, { ...orders.getItem(orderId), orderStatus: 'canceled' })
    }

    function cancelAllOrders () {
      for (const orderId of orders) {
        cancelOrder(orderId)
      }
    }

    function getOrder (orderId) {
      return orders.get(orderId)
    }

    function getOrders () {
      return orders.entries()
    }

    function updateOrder ({
      orderId,
      ...updateOrderValues
    }) {
      const order = orders.get(orderId)
      orders.set(orderId, { ...order, ...updateOrderValues })
    }

    function openLong ({
      symbol,
      qty,
      price
    }) {
      const positionId = uuidv4()
      const marketValue = price * qty

      if (marketValue > buyingPower) {
        // throw new Error('Not enough buying power')
        console.log('Not enough buying power')
        return
      }

      positions[symbol] = {
        positionId,
        symbol,
        qty,
        side: 'long',
        price,
        marketValue
      }

      cash -= marketValue
      buyingPower -= marketValue
      longMarketValue += marketValue

      calculateMetrics()

      console.log('Opened position in', symbol, '\t', qty, '\t', price, '\t', plPercentage)
    }

    function closeLong ({
      positionId,
      marketValue,
      symbol,
      lastPrice,
      unrealizedPlPercentage,
      qty
    }) {
      cash += marketValue
      longMarketValue -= marketValue
      buyingPower += marketValue
      delete positions[symbol]

      if (unrealizedPlPercentage >= 0) {
        winningTrades++
      } else {
        losingTrades++
      }

      calculateMetrics()

      console.log('Closed position in', symbol, '\t', qty, '\t', lastPrice, '\t', plPercentage)
    }

    function closePosition (symbol) {
      // if (!marketOpen) return

      if (symbol in positions) {
        if (positions[symbol].side === 'long') {
          closeLong(positions[symbol])
        } else {
          throw new Error('Shorting not implemented yet')
        }
      } else {
        // throw new Error('No position exists for provided symbol')
        console.log('No position exists for provided symbol')
      }
    }

    function closePositions () {
      for (const symbol in positions) {
        closePosition(symbol)
      }

      calculateMetrics()
    }

    function getPosition (symbol) {
      return positions[symbol]
    }

    function getPositions () {
      return Object.values(positions)
    }

    function calculateLongMarketValue () {
      let refreshedLongMarketValue = 0

      for (const symbol in positions) {
        if (positions[symbol].side === 'long') {
          refreshedLongMarketValue += positions[symbol].marketValue
        }
      }

      longMarketValue = refreshedLongMarketValue
    }

    function calculateMetrics () {
      // Calculate long market value
      calculateLongMarketValue()

      // Calculate account values
      equity = cash + longMarketValue + shortMarketValue
      pl = equity - startingCapital
      plPercentage = (pl / startingCapital) * 100

      // Calculate benchmark pl values
      benchmarkPl = benchmarkMarketValue - startingCapital
      benchmarkPlPercentage = (benchmarkPl / startingCapital) * 100

      // Calculate win/loss ratio
      if (losingTrades > 0) {
        winLossRatio = winningTrades / losingTrades
      }

      // Calculate total trades
      totalTrades = winningTrades + losingTrades
    }

    async function loadDataForDate (date) {
      let marketDataForDate = []

      for (const symbol of symbols) {
        try {
          const filePath = path.join(dataPath, `${symbol}.${date}.gz`)
          const fileContents = await fs.readFile(filePath)
          const uncompressed = await gunzip(fileContents)
          const parsedData = parseData(uncompressed.toString())
          marketDataForDate = [...marketDataForDate, ...parsedData]
        } catch (error) {
          log(`Error loading ${symbol} for ${date}`)
        }
      }

      // Sort data
      if (marketDataForDate.length > 0) {
        marketDataForDate.sort((a, b) => a.timestamp - b.timestamp)
      }

      return marketDataForDate
    }

    function fillOrders (record) {
      orders.forEach(order => {
        if (order.symbol === record.symbol) {
          if (order.orderStatus === 'open') {
            if (order.side === 'buy') {
              if (order.type === 'market') {
                openLong({
                  symbol: order.symbol,
                  qty: order.qty,
                  price: record.price
                })

                updateOrder({ orderId: order.id, orderStatus: 'filled' })

                // console.log(`Buy market order for ${order.symbol} filled - ${order.qty} shares at ${record.price}`)
              } else if (order.type === 'limit') {
                if (record.price < order.limitPrice) {
                  openLong({
                    symbol: order.symbol,
                    qty: order.qty,
                    price: order.limitPrice
                  })

                  updateOrder({ orderId: order.id, orderStatus: 'filled' })
                }
              } else if (order.type === 'stop') {
                if (record.price <= order.stopPrice) {
                  openLong({
                    symbol: order.symbol,
                    qty: order.qty,
                    price: record.price
                  })

                  updateOrder({ orderId: order.id,  orderStatus: 'filled' })
                }
              }
            } else {
              if (order.type === 'market') {
                closeLong(positions[order.symbol])

                updateOrder({ orderId: order.id, orderStatus: 'filled' })
              } else if (order.type === 'limit') {
                if (record.price > order.limitPrice) {
                  closeLong(positions[order.symbol])

                  updateOrder({ orderId: order.id, orderStatus: 'filled' })
                }
              } else if (order.type === 'stop') {
                if (record.price <= order.stopPrice) {
                  closeLong(positions[order.symbol])

                  updateOrder({ orderId: order.id, orderStatus: 'filled' })
                }
              }
            }
          }
        }
      })
    }

    function genOhlc (recordsSlice, secondIndex) {
      return {
        secondIndex,
        open: recordsSlice[0],
        high: Math.max(...recordsSlice),
        low: Math.min(...recordsSlice),
        close: recordsSlice[recordsSlice.length - 1]
      }
    }

    async function runBacktest () {
      // const spinner = ora('Running backtest').start()
      let benchmarkStarted = false
      let secondIndex = 0
      let lastSecondIndex = 0
      const sliceInfo = {}

      // Populate slice info with periods & symbols
      for (const period of candlePeriods) {
        sliceInfo[period] = {}

        for (const symbol of symbols) {
          sliceInfo[period][symbol] = {
            periodInSeconds: period,
            startSecondIndex: 0,
            endSecondIndex: period,
            recordsSlice: [],
            trades: 0,
            volume: 0
          }
        }
      }

      for (const date of dates) {
        const marketData = await loadDataForDate(date)

        if (marketData) {
          let index = 0

          // Iterate over market data for date
          for (const record of marketData) {
            const previousRecord = index !== 0 ? marketData[index - 1] : record
            const outlierSkipCondition = Math.abs(previousRecord.price - record.price) < 1

            if (record.type === 't' && outlierSkipCondition) {
              // SPY benchmark
              if (record.symbol === 'SPY') {
                // Begin SPY benchmark
                if (!benchmarkStarted) {
                  benchmarkNumShares = startingCapital / record.price
                  benchmarkStarted = true
                }

                // Update SPY bechmark market value
                benchmarkMarketValue = record.price * benchmarkNumShares
              }

              // Update market open
              if (record.marketHours === 'open' && !marketOpen) {
                marketOpen = true
              } else if (record.marketHours === 'ext' && marketOpen) {
                marketOpen = false
              }

              // Update position market values with last price for symbol
              if (record.symbol in positions) {
                const tradeStartingCapital = positions[record.symbol].qty * positions[record.symbol].price
                positions[record.symbol].marketValue = positions[record.symbol].qty * record.price
                positions[record.symbol].lastPrice = record.price
                positions[record.symbol].unrealizedPl = (positions[record.symbol].qty * record.price) - tradeStartingCapital
                positions[record.symbol].unrealizedPlPercentage = (positions[record.symbol].unrealizedPl / tradeStartingCapital) * 100
              }

              // Calculate metrics
              calculateMetrics()

              // Fill orders
              fillOrders(record)

              // Update accountValueTimeSeries for time index
              accountValueTimeSeries.push({
                longMarketValue,
                shortMarketValue,
                equity,
                pl,
                plPercentage,
                timestamp: record.timestamp
              })

              // Update benchmarkValueTimeSeries for time index
              benchmarkValueTimeSeries.push({
                benchmarkMarketValue,
                benchmarkPl,
                benchmarkPlPercentage,
                timestamp: record.timestamp
              })

              // Assign empty ohlc object before calculation
              record.ohlc = {}

              // Iterate over ohlc periods
              for (const period in sliceInfo) {
                // Update startSecondIndex, endSecondIndex, recordsSlice if out of period
                if (secondIndex > sliceInfo[period][record.symbol].endSecondIndex) {
                  sliceInfo[period][record.symbol].startSecondIndex = secondIndex
                  sliceInfo[period][record.symbol].endSecondIndex = sliceInfo[period][record.symbol].startSecondIndex + sliceInfo[period][record.symbol].periodInSeconds
                  sliceInfo[period][record.symbol].recordsSlice.length = 0
                  sliceInfo[period][record.symbol].volume = 0
                  sliceInfo[period][record.symbol].trades = 0
                }

                // Update sliceInfo
                sliceInfo[period][record.symbol].recordsSlice.push(record.price)
                sliceInfo[period][record.symbol].volume += record.volume
                sliceInfo[period][record.symbol].trades++

                // Calcualte ohlc
                record.ohlc[period] = {
                  complete: (secondIndex + 1) > sliceInfo[period][record.symbol].endSecondIndex ? true : false,
                  volume: sliceInfo[period][record.symbol].volume,
                  trades: sliceInfo[period][record.symbol].trades,
                  ...genOhlc(sliceInfo[period][record.symbol].recordsSlice, secondIndex)
                }
              }

              // Fire new trade callback
              onNewTrade(record)

              // Update secondIndex
              const currentSecondIndex = record.jsDate.getUTCSeconds()
              if (lastSecondIndex !== currentSecondIndex) {
                lastSecondIndex = currentSecondIndex
                secondIndex++
              }
            } else if (record.type === 'q') {
              // Fire new quote callback
              onNewQuote(record)
            }

            index++
          }
        }
      }

      // spinner.succeed('Backtest complete')
    }

    function renderChart () {
      console.log('chart here...')
    }

    // Return exposed functions
    return {
      // Main api
      accountValues,
      runBacktest,
      renderChart,

      // Orders api
      createOrder,
      cancelOrder,
      cancelAllOrders,
      getOrder,
      getOrders,

      // Positions api
      closePositions,
      closePosition,
      getPosition,
      getPositions
    }
  } catch (error) {
    console.error('Backtester build error', error)

    return null
  }
}

module.exports = backtester
