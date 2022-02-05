const moment = require('moment')

function enumerateDates (from, to) {
  const dateArray = []
  let currentDate = moment(from)
  const stopDate = moment(to)

  while (currentDate <= stopDate) {
    dateArray.push(moment(currentDate).format('YYYY-MM-DD'))
    currentDate = moment(currentDate).add(1, 'days')
  }

  if (currentDate === stopDate) {
    dateArray.push(stopDate)
  }

  return dateArray
}

module.exports = enumerateDates
