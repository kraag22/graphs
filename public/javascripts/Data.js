var gra = gra || {};

gra.Data = function(data) {

    this.data_ = data;
    this.players_ = {};
    this.nameRegexp = /[A-Z]{1}1$/;
    this.dataRegexp = /[A-Z]{1}[0-9]{1,3}/;
    this.plays_ = [];

    this.init();
};

gra.Data.prototype.getPlayers = function(minPlays) {
    var plrs = {};

    for (var playerIndex in this.players_) {
        var player = this.players_[playerIndex];
        if (player.wins + player.loses > minPlays) {
            plrs[playerIndex] = this.getPlayerName(playerIndex);
        }
    }

    return plrs;
};

gra.Data.prototype.getPlayerName = function(index) {
    return this.players_[index].name.substring(0,10);
};

gra.Data.prototype.init = function() {
    console.log(this.data_);

    for (var row in this.data_) {
        if (this.nameRegexp.test(row)) {
            this.players_[row.charAt(0)] = {name: this.data_[row], wins: 0, loses: 0};
        }
        else if (this.dataRegexp.test(row)) {
            if (row.charAt(0) === 'A') {
                continue;
            }

            if (this.players_[row.charAt(0)] === undefined) {
                console.log(row);
            }
            else {
                if (this.data_[row] == 1) {
                    this.players_[row.charAt(0)].wins++;
                }
                else {
                    this.players_[row.charAt(0)].loses++;
                }
            }
        }
    }
};

gra.Data.prototype.renderPie = function(ctx) {
    var data = [];

    for (var playerIndex in this.players_) {
        var player = this.players_[playerIndex];
        var randomColor = '#';
        var letters = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F'];
        for (var i = 0; i<6; i++) {
           randomColor += letters[Math.round(Math.random()*10)];
        }
        data.push({value:player.wins, color:randomColor});
    }

    return new Chart(ctx).Pie(data);
};

gra.Data.prototype.renderBar = function(ctx) {
    var wins = [];
    var loses = [];
    var labels = [];

    for (var playerIndex in this.players_) {
        var player = this.players_[playerIndex];
        labels.push(this.getPlayerName(playerIndex));
        loses.push(player.loses);
        wins.push(player.wins);
    }
    console.log(loses, wins, labels);

    return new Chart(ctx).Bar({labels:labels, datasets:[
        {
            fillColor : "rgba(151,187,205,0.5)",
            strokeColor : "rgba(151,187,205,1)",
            data : wins
        },
        {
            fillColor : "rgba(220,220,220,0.5)",
            strokeColor : "rgba(220,220,220,1)",
            data : loses
        }]});
};

// current - char of currently counted player
gra.Data.prototype.renderRadar = function(ctx, current) {
    console.log(this.data_);
    var results = {};
    // from B to last existant letter
    for (var i = 66; i<100; i++) {
        var letter = String.fromCharCode(i);
        if (this.players_[letter] === undefined) {
            break;
        }

        // skip actually counted player
        if (letter === current) {
            continue;
        }

        results[letter] = {with:0, against: 0};

        for (var j = 2; j < 1000; j++) {
            var row = letter+j;
            var currentRow = current+j;
            // finish when no data is aviable
            if (this.data_['A'+j] === undefined) {
                break;
            }
            // dont count if player didnt play
            if (this.data_[currentRow] === undefined) {
                continue;
            }

            if (this.data_[row] == this.data_[currentRow]) {
                results[letter].with++;
            }
            else if (this.data_[row] !== undefined) {
                results[letter].against++;
            }

        }

    }
    console.log(results);

    // prepare data for graph
    var data = {labels:[], datasets:[{
            fillColor : "rgba(220,220,220,0.5)",
            strokeColor : "rgba(220,220,220,1)",
            pointColor : "rgba(220,220,220,1)",
            pointStrokeColor : "#fff",
            data : []
        },
        {
            fillColor : "rgba(151,187,205,0.5)",
            strokeColor : "rgba(151,187,205,1)",
            pointColor : "rgba(151,187,205,1)",
            pointStrokeColor : "#fff",
            data : []
        }]};

    for (var k = 66; k<100; k++) {
        l = String.fromCharCode(k);
        if (this.players_[l] === undefined) {
            break;
        }

        // skip actually counted player
        if (l === current) {
            continue;
        }

        if ((results[l].with + results[l].against) <=1) {
            continue;
        }
        data.labels.push(this.getPlayerName(l));
        data.datasets[1].data.push(results[l].with);
        data.datasets[0].data.push(results[l].against);
    }

    return new Chart(ctx).Radar(data);
};



