class Graphs {
  constructor(data) {
    this.data_ = data
    this.players_ = {}
    this.nameRegexp = /[A-Z]{1}1$/
    this.dataRegexp = /[A-Z]{1}[0-9]{1,3}/
    this.plays_ = []
    this.numberOfPlays = 0

    this.TIE = 0.5
    this.WIN = 1
    this.LOSS = 0
    this.ABSENT = -1

    this.init()
  }

  init() {
    var row

    for (row in this.data_) {
      if (this.nameRegexp.test(row)) {
        this.players_[row.charAt(0)] = {
          name: this.data_[row],
          wins: 0,
          loses: 0,
        }
      }
    }

    for (row in this.data_) {
      if (this.dataRegexp.test(row)) {
        if (row.charAt(0) === 'A') {
          this.numberOfPlays++
          continue
        }

        if (this.players_[row.charAt(0)] === undefined) {
          console.log('Player undefined', row)
        } else {
          var current = this.parseNumber(this.data_[row])
          if (current === 0) {
            this.players_[row.charAt(0)].loses++
          } else if (current === 1 || current === 0.5) {
            this.players_[row.charAt(0)].wins += current
          }
        }
      }
    }
  }

  parseNumber(str) {
    return str ? Number(str.replace(',', '.')) : undefined
  }

  getPlayers(minPlays) {
    var plrs = {}

    for (var playerIndex in this.players_) {
      var player = this.players_[playerIndex]
      if (player.wins + player.loses > minPlays) {
        plrs[playerIndex] = this.getPlayerName(playerIndex)
      }
    }

    return plrs
  }

  gameResultForPlayer(playerLetter, gameNumber) {
    const tableId = playerLetter + gameNumber
    if (!Object.keys(this.data_).includes(tableId)) {
      return this.ABSENT
    }
    switch (this.parseNumber(this.data_[tableId])) {
      case this.WIN: {
        return this.WIN
        break
      }
      case this.TIE: {
        return this.TIE
        break
      }
      case this.LOSS: {
        return this.LOSS
        break
      }
    }
    return this.ABSENT
  }

  getPlayerName(index) {
    return this.players_[index]
      ? this.players_[index].name.substring(0, 10)
      : false
  }

  getNumberOfPlays() {
    return this.numberOfPlays
  }

  getTotalNumberOfPlays() {
    return 36
  }

  getActiveColumnsLetters() {
    // filter columns on first row and then returns array of first letters
    return Object.keys(this.data_)
      .filter((key) => key[1] == 1 && key.length == 2)
      .map((key) => key[0])
  }

  getIndexOfLastGame() {
    let index = 0
    const allRowNumbers = Object.keys(this.data_)
      .filter((key) => key[0] == 'A')
      .map((key) => key.substr(1))
      .map((key) => parseInt(key))
    const distinctRowNumbers = new Set(allRowNumbers)
    distinctRowNumbers.forEach((row) => {
      if (row > index) {
        index = row
      }
    })
    return index
  }

  getWithAgainstStat(playerA, playerB) {
    let playedWith = 0
    let playedAgainst = 0
    let wonWith = 0
    let lostWith = 0

    for (let i = 2; i <= this.getIndexOfLastGame(); i++) {
      const resultA = this.gameResultForPlayer(playerA, i)
      const resultB = this.gameResultForPlayer(playerB, i)

      if (resultA === this.ABSENT || resultB === this.ABSENT) {
        continue
      }

      if (resultA === resultB) {
        playedWith++
        if (resultA === this.WIN) {
          wonWith++
        }
        if (resultA === this.LOSS) {
          lostWith++
        }
      } else {
        playedAgainst++
      }
    }
    return {
      with: playedWith,
      against: playedAgainst,
      wonWith: wonWith,
      lostWith: lostWith,
    }
  }

  getSeasonCompletetion() {
    return Math.round(
      (100 * this.getNumberOfPlays()) / this.getTotalNumberOfPlays()
    )
  }

  getWinsAndLosses() {
    const data = []

    for (var playerIndex in this.players_) {
      var player = this.players_[playerIndex]
      if (player.loses + player.wins > 1) {
        data.push({
          player: this.getPlayerName(playerIndex),
          wins: player.wins,
          looses: player.loses,
        })
      }
    }

    return data
  }

  renderPie(id, season) {
    let coronaMissedDays = 0
    if (season == 2019 || season == 2020) {
      coronaMissedDays = season == 2019 ? 10 : 24
    }

    var data = [
      {
        title: 'remains',
        days:
          this.getTotalNumberOfPlays() -
          this.getNumberOfPlays() -
          coronaMissedDays,
      },
      {
        title: 'played',
        days: this.getNumberOfPlays(),
      },
    ]

    if (coronaMissedDays != 0) {
      data.push({
        title: 'Corona virus',
        days: coronaMissedDays,
      })
    }

    AmCharts.makeChart(id, {
      type: 'pie',
      theme: 'light',
      dataProvider: data,
      valueField: 'days',
      titleField: 'title',
      panEventsEnabled: false,
    })
  }

  getPlayerChances() {
    const data = this.getWinsAndLosses()
    data.map((player) => {
      const chance = Math.round(
        (player.wins / (player.wins + player.looses)) * 100
      )
      player.chance = chance
      return player
    })

    //sort data by chance desc
    data.sort((a, b) => {
      if (a.chance > b.chance) {
        return -1
      }
      if (a.chance < b.chance) {
        return 1
      }
      return 0
    })

    return data
  }

  renderChance(elementId) {
    const element = document.getElementById(elementId)

    let data = this.getPlayerChances()

    data.forEach((player) => {
      const chanceElement = document.createElement('li')
      chanceElement.innerHTML = `${player.player}: ${player.chance}%`
      element.appendChild(chanceElement)
    })
  }

  renderTotals(id) {
    const data = this.getWinsAndLosses()

    AmCharts.makeChart(id, {
      type: 'serial',
      theme: 'light',
      'columnWidth:': 0.6,
      columnSpacing: 5,
      dataProvider: data,
      valueAxes: [
        {
          axisAlpha: 0,
          position: 'top',
        },
      ],
      startDuration: 1,
      graphs: [
        {
          balloonText: 'Wins:[[value]]',
          fillAlphas: 0.8,
          lineAlpha: 0.2,
          title: 'Wins',
          type: 'column',
          valueField: 'wins',
        },
        {
          balloonText: 'Looses:[[value]]',
          fillAlphas: 0.8,
          lineAlpha: 0.2,
          title: 'Looses',
          type: 'column',
          valueField: 'looses',
        },
      ],
      rotate: false,
      panEventsEnabled: false,
      categoryField: 'player',
      categoryAxis: {
        gridPosition: 'start',
        position: 'left',
      },
      legend: {
        horizontalGap: 10,
        maxColumns: 1,
        position: 'bottom',
        useGraphSettings: true,
        markerSize: 10,
      },
    })
  }

  renderMatesChart(ctx, current, operation) {
    const data = this.matesDataForPlayer(current)
    const dataProvider = this.prepareMatesData(data, operation)
    const firstLabel = operation === 'played' ? 'Played against' : 'Lost with'
    const secondLabel = operation === 'played' ? 'Played with' : 'Won with'

    AmCharts.makeChart(ctx, {
      type: 'serial',
      theme: 'none',
      legend: {
        horizontalGap: 10,
        maxColumns: 1,
        position: 'bottom',
        useGraphSettings: true,
        markerSize: 10,
      },
      dataProvider: dataProvider,
      valueAxes: [
        {
          stackType: 'regular',
          axisAlpha: 0.3,
          gridAlpha: 0,
        },
      ],
      graphs: [
        {
          balloonText:
            "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
          fillAlphas: 0.8,
          labelText: '[[value]]',
          lineAlpha: 0.3,
          title: firstLabel,
          type: 'column',
          color: '#000000',
          valueField: 'first',
        },
        {
          balloonText:
            "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
          fillAlphas: 0.8,
          labelText: '[[value]]',
          lineAlpha: 0.3,
          title: secondLabel,
          type: 'column',
          color: '#000000',
          valueField: 'second',
        },
      ],
      categoryField: 'name',
      categoryAxis: {
        gridPosition: 'start',
        axisAlpha: 0,
        gridAlpha: 0,
        position: 'left',
      },
      panEventsEnabled: false,
    })
  }

  // playerLetter - char of currently counted player
  matesDataForPlayer(playerLetter) {
    var results = {}
    let letters = this.getActiveColumnsLetters().filter(
      (char) => char != 'A' && char != playerLetter
    )
    letters.forEach((letter) => {
      if (!this.getPlayerName(letter)) {
        return results
      }
      results[letter] = this.getWithAgainstStat(playerLetter, letter)
    })

    return results
  }

  prepareMatesData(data, operation = 'played') {
    const result = []
    const firstKey = operation === 'played' ? 'against' : 'lostWith'
    const secondKey = operation === 'played' ? 'with' : 'wonWith'
    for (var key in data) {
      if (
        operation === 'played' &&
        data[key][secondKey] + data[key][firstKey] <= 1
      ) {
        continue
      }

      const oneData = {}
      oneData['name'] = this.getPlayerName(key)
      oneData['first'] = data[key][firstKey]
      oneData['second'] = data[key][secondKey]
      result.push(oneData)
    }
    return result
  }
}

try {
  module.exports.Graphs = Graphs
} catch (error) {}
