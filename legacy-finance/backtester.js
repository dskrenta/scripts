'use strict'

const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const enumerateDates = require('./utils/enumerateDates')
const fsAsync = fs.promises

const DATA_PATH = path.join(__dirname, '..', 'data')

class Backtester {
  constructor ({
    name = 'Sample backtest',
    description = 'Sample backtester instance',
    tickers = ['QQQ'],
    to = '2020-10-14',
    from = '2020-10-14',
    timespan = 'minute',
    extendedHoursTrading = false,
    startingCapital = 100000,
    marginMultiplier = 1,
    shortingEnabled = false,
    tradingFunc = () => {},
    marketFillStrategy = 'h' // o, h, l, c, midpoint, smart
  }) {
    // General config
    this.id = uuidv4()
    this.name = name
    this.description = description
    this.tickers = tickers
    this.to = to
    this.from = from
    this.timespan = timespan
    this.data = {}
    this.shortingEnabled = shortingEnabled
    this.extendedHoursTrading = extendedHoursTrading
    this.tradingFunc = tradingFunc
    this.marketFillStrategy = marketFillStrategy

    // Dates between to and from
    this.dates = enumerateDates(to, from)

    // Config account values
    this.multiplier = marginMultiplier
    this.startingCapital = startingCapital
    this.cash = startingCapital
    this.buyingPower = startingCapital
    this.longMarketValue = 0
    this.shortMarketValue = 0
    this.equity = this.cash
    this.pl = 0
    this.plPercentage = 0

    // Orders config
    this.orders = new Map()

    // Positions config
    this.positions = {}
  }

  report () {
    this.calculateEquity()
    this.calculateProfitLoss()

    console.table({
      equity: this.equity,
      shortMarketValue: this.shortMarketValue,
      longMarketValue: this.longMarketValue,
      cash: this.cash,
      buyingPower: this.buyingPower,
      'P/L': this.pl,
      'P/L Percentage': `${this.plPercentage * 100}%`
    })
  }

  calculateWeightedAverageEntryPrice (symbol) {
    if (symbol in this.positions) {
      this.positions[symbol].weightedAverageEntryPrice = this.positions[symbol].entries.reduce((accumulator, { qty, price }) => accumulator + (qty * price), 0) / this.positions[symbol].qty
    } else {
      throw new Error(`No position in ${symbol}`)
    }
  }

  calculateLongMarketValue ({
    record,
    barValue = 'c' // o, h, l, c
  }) {
    let longMarketValue = 0

    for (const symbol in this.positions) {
      const currentBar = record.currentBars[symbol]

      if (currentBar) {
        longMarketValue += this.positions[symbol].qty * currentBar[barValue]
      }
    }

    this.longMarketValue = longMarketValue
  }

  calculateEquity () {
    this.equity = this.cash + this.longMarketValue + this.shortMarketValue
  }

  calculateProfitLoss () {
    this.pl = this.equity - this.startingCapital
    this.plPercentage = this.pl / this.startingCapital
  }

  updatePosition ({
    symbol,
    qty,
    side = 'buy', // buy, sell
    price
  }) {
    const marketValue = qty * price

    if (marketValue <= this.buyingPower) {
      if (symbol in this.positions) {
        if (side === 'buy') {
          // Add to long position
          this.positions[symbol].qty += qty
          this.positions[symbol].entries.push({ price, qty })
          this.cash -= marketValue
          this.buyingPower -= marketValue
          this.longMarketValue += marketValue
          this.calculateWeightedAverageEntryPrice(symbol)
          this.calculateEquity()
        } else {
          if (this.positions[symbol].side === 'long') {
            if (qty === this.positions[symbol].qty) {
              // Sell full long position
              this.cash += marketValue
              this.longMarketValue -= marketValue
              this.buyingPower += marketValue
              delete this.positions[symbol]
              this.calculateEquity()
            } else if (qty < this.positions[symbol].qty) {
              throw new Error('Selling partial positions not currently supported')
            } else {
              throw new Error('Unable to sell more shares than owned')
            }
          } else {
            throw new Error('Shorting not implemented yet')
          }
        }
      } else {
        if (side === 'buy') {
          // Open long position
          this.positions[symbol] = {
            id: uuidv4(),
            qty,
            side: 'long',
            entries: [{ qty, price }],
            weightedAverageEntryPrice: price
          }
          this.cash -= marketValue
          this.buyingPower -= marketValue
          this.longMarketValue += marketValue
          this.calculateEquity()
        } else {
          throw new Error('Shorting not implemented yet')
        }
      }
    } else {
      throw new Error('Not enough buying power')
    }
  }

  getPositions () {
    return this.positions
  }

  getPosition (symbol) {
    return this.positions[symbol]
  }

  closePositions () {
    // close all positions
    this.positions = {}
  }

  getOrders () {
    return this.orders.entries()
  }

  getOrder (orderId) {
    return this.orders.get(orderId)
  }

  createOrder ({
    symbol,
    qty,
    side, // buy, sell
    type = 'market',
    timeInForce = 'day',
    extendedHours = false
  }) {
    // if (symbol in this.positions &&
    this.orders.set(
      uuidv4(), {
        orderStatus: 'open', // open, closed
        symbol,
        qty,
        side,
        type,
        timeInForce,
        extendedHours
      }
    )
  }

  replaceOrder ({
    orderId
  }) {
  }

  removeOrder (orderId) {
    this.orders.delete(orderId)
  }

  removeAllOrders () {
    this.orders.clear()
  }

  async init () {
    await this.prepareData()
  }

  async prepareData () {
    for (const ticker of this.tickers) {
      this.data[ticker] = {}

      for (const date of this.dates) {
        const filename = path.join(DATA_PATH, ticker, `${this.timespan}-${date}.json`)
        const data = await fsAsync.readFile(filename, 'utf-8')
        const record = JSON.parse(data)
        this.data[ticker][date] = record.results
      }
    }
  }

  fillOrders (record) {
    for (const [orderId, order] of this.orders) {
      if (order.orderStatus !== 'closed') {
        this.updatePosition({
          symbol: order.symbol,
          qty: order.qty,
          side: order.side,
          price: record.currentBars[order.symbol][this.marketFillStrategy]
        })

        // Update order status to closed
        this.orders.set(orderId, { ...order, orderStatus: 'closed' })
      }
    }
  }

  aggTradingBar (tradingFunc) {
    this.tradingFunc = tradingFunc
    const aggData = {}

    // Aggregate data
    for (const date of this.dates) {
      for (const ticker of this.tickers) {
        for (const bar of this.data[ticker][date]) {
          const resultBar = { ...bar }

          if (aggData[bar.t]) {
            aggData[bar.t][ticker] = resultBar
          } else {
            aggData[bar.t] = { [ticker]: resultBar }
          }
        }
      }
    }

    const aggDataArr = []

    for (const time in aggData) {
      const currentDate = new Date()
      const openDate = new Date()
      const closeDate = new Date()

      currentDate.setTime(time)

      openDate.setTime(time)
      openDate.setUTCHours(14, 30, 0)

      closeDate.setTime(time)
      closeDate.setUTCHours(21, 0, 0)

      const marketOpen = currentDate > openDate && currentDate < closeDate

      aggDataArr.push({
        currentDate,
        marketOpenDate: openDate,
        marketCloseDate: closeDate,
        marketOpen,
        time,
        currentBars: aggData[time]
      })
    }

    // Ensure data is sorted in chronological order
    aggDataArr.sort((a, b) => {
      if (a.currentDate < b.currentDate) {
        return -1
      }

      if (a.currentDate > b.currentDate) {
        return 1
      }

      return 0
    })

    for (const record of aggDataArr) {
      // Update longMarketValue according to marketFillStrategy
      this.calculateLongMarketValue({ record, barValue: this.marketFillStrategy })

      // Fill orders according to marketFillStragety
      this.fillOrders(record)

      // Update longMarketValue according to close
      this.calculateLongMarketValue({ record, barValue: 'c' })

      // Execute trading function for current bar
      this.tradingFunc(record)
    }
  }
}

module.exports = Backtester
