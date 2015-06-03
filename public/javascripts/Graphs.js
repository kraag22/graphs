"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Graphs = (function () {
  function Graphs(data) {
    _classCallCheck(this, Graphs);

    this.data_ = data;
    this.players_ = {};
    this.nameRegexp = /[A-Z]{1}1$/;
    this.dataRegexp = /[A-Z]{1}[0-9]{1,3}/;
    this.plays_ = [];
    this.numberOfPlays = 0;

    this.init();
  }

  _createClass(Graphs, [{
    key: "init",
    value: function init() {
      console.log(this.data_);
      var row;

      for (row in this.data_) {
        if (this.nameRegexp.test(row)) {
          this.players_[row.charAt(0)] = { name: this.data_[row], wins: 0, loses: 0 };
        }
      }

      for (row in this.data_) {
        if (this.dataRegexp.test(row)) {
          if (row.charAt(0) === "A") {
            this.numberOfPlays++;
            continue;
          }

          if (this.players_[row.charAt(0)] === undefined) {
            console.log(row);
          } else {
            if (this.data_[row] == 1) {
              this.players_[row.charAt(0)].wins++;
            } else if (this.data_[row] == 0) {
              this.players_[row.charAt(0)].loses++;
            }
          }
        }
      }
    }
  }, {
    key: "getPlayers",
    value: function getPlayers(minPlays) {
      var plrs = {};

      for (var playerIndex in this.players_) {
        var player = this.players_[playerIndex];
        if (player.wins + player.loses > minPlays) {
          plrs[playerIndex] = this.getPlayerName(playerIndex);
        }
      }

      return plrs;
    }
  }, {
    key: "getPlayerName",
    value: function getPlayerName(index) {
      return this.players_[index].name.substring(0, 10);
    }
  }, {
    key: "getNumberOfPlays",
    value: function getNumberOfPlays() {
      return this.numberOfPlays;
    }
  }, {
    key: "getTotalNumberOfPlays",
    value: function getTotalNumberOfPlays() {
      return 36;
    }
  }, {
    key: "renderPie",
    value: function renderPie(id) {

      AmCharts.makeChart(id, {
        "type": "pie",
        "theme": "light",
        "dataProvider": [{
          "title": "remains",
          "days": this.getTotalNumberOfPlays() - this.getNumberOfPlays()
        }, {
          "title": "played",
          "days": this.getNumberOfPlays()
        }],
        "valueField": "days",
        "titleField": "title",
        "panEventsEnabled": false
      });
    }
  }, {
    key: "getSeasonCompletetion",
    value: function getSeasonCompletetion() {
      return Math.round(100 * this.getNumberOfPlays() / this.getTotalNumberOfPlays());
    }
  }, {
    key: "renderBar",
    value: function renderBar(id) {
      var data = [];
      console.log(this.players_);
      for (var playerIndex in this.players_) {
        var player = this.players_[playerIndex];
        if (player.loses + player.wins > 1) {
          data.push({
            "player": this.getPlayerName(playerIndex),
            "wins": player.wins,
            "looses": player.loses
          });
        }
      }

      console.log(data);

      var chart = AmCharts.makeChart(id, {
        "type": "serial",
        "theme": "light",
        "columnWidth:": 0.6,
        "columnSpacing": 5,
        "dataProvider": data,
        "valueAxes": [{
          "axisAlpha": 0,
          "position": "top"
        }],
        "startDuration": 1,
        "graphs": [{
          "balloonText": "Wins:[[value]]",
          "fillAlphas": 0.8,
          "lineAlpha": 0.2,
          "title": "Wins",
          "type": "column",
          "valueField": "wins"
        }, {
          "balloonText": "Looses:[[value]]",
          "fillAlphas": 0.8,
          "lineAlpha": 0.2,
          "title": "Looses",
          "type": "column",
          "valueField": "looses"
        }],
        "rotate": false,
        "panEventsEnabled": false,
        "categoryField": "player",
        "categoryAxis": {
          "gridPosition": "start",
          "position": "left"
        },
        "legend": {
          "horizontalGap": 10,
          "maxColumns": 1,
          "position": "bottom",
          "useGraphSettings": true,
          "markerSize": 10
        }
      });
    }
  }, {
    key: "renderChart",
    value: function renderChart(ctx, current) {

      var data = this.statsDataForPlayer(current);
      var dataProvider = [];

      for (var key in data) {
        if (/^[A-Z]{1}$/.test(key) && data.hasOwnProperty(key)) {

          if (data[key]["with"] + data[key]["against"] <= 1) {
            continue;
          }

          var oneData = {};
          oneData["name"] = this.getPlayerName(key);
          oneData["with"] = data[key]["with"];
          oneData["against"] = data[key]["against"];
          dataProvider.push(oneData);
        }
      }

      AmCharts.makeChart(ctx, {
        "type": "serial",
        "theme": "none",
        "legend": {
          "horizontalGap": 10,
          "maxColumns": 1,
          "position": "bottom",
          "useGraphSettings": true,
          "markerSize": 10
        },
        "dataProvider": dataProvider,
        "valueAxes": [{
          "stackType": "regular",
          "axisAlpha": 0.3,
          "gridAlpha": 0
        }],
        "graphs": [{
          "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
          "fillAlphas": 0.8,
          "labelText": "[[value]]",
          "lineAlpha": 0.3,
          "title": "Played against",
          "type": "column",
          "color": "#000000",
          "valueField": "against"
        }, {
          "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
          "fillAlphas": 0.8,
          "labelText": "[[value]]",
          "lineAlpha": 0.3,
          "title": "Played with",
          "type": "column",
          "color": "#000000",
          "valueField": "with"
        }],
        "categoryField": "name",
        "categoryAxis": {
          "gridPosition": "start",
          "axisAlpha": 0,
          "gridAlpha": 0,
          "position": "left"
        },
        "panEventsEnabled": false
      });
    }
  }, {
    key: "statsDataForPlayer",

    // current - char of currently counted player
    value: function statsDataForPlayer(current) {

      var results = {};
      // from B to last existant letter
      for (var i = 66; i < 100; i++) {
        var letter = String.fromCharCode(i);
        if (this.players_[letter] === undefined) {
          break;
        }

        // skip actually counted player
        if (letter === current) {
          continue;
        }

        results[letter] = { "with": 0, against: 0 };

        for (var j = 2; j < 1000; j++) {
          var row = letter + j;
          var currentRow = current + j;
          // finish when no data is aviable
          if (this.data_["A" + j] === undefined) {
            break;
          }
          // dont count if player didnt play
          if (this.data_[currentRow] === undefined) {
            continue;
          }

          if (this.data_[row] == this.data_[currentRow]) {
            results[letter]["with"]++;
          } else if (this.data_[row] !== undefined) {
            results[letter].against++;
          }
        }
      }

      return results;
    }
  }]);

  return Graphs;
})();