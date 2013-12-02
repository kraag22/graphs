var gra = gra || {};

gra.Data = function(data) {
    
    this.data_ = data;
    this.players_ = {};
    this.nameRegexp = /[A-Z]{1}1$/;
    this.dataRegexp = /[A-Z]{1}[0-9]{1,3}/;

    this.init();
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
    console.log(this.players_);
};

gra.Data.prototype.renderPie = function(ctx) {
    var data = [];

    for (var playerIndex in this.players_) {
        var player = this.players_[playerIndex];
        var randomColor = '#';
        for (var i = 0; i<6; i++) {
           randomColor += Math.round(Math.random()*10);
        }
        data.push({value:player.wins, color:randomColor});
    }
    console.log(data);
    return new Chart(ctx).Pie(data);
};

gra.Data.prototype.renderBar = function(ctx) {
    var wins = [];
    var loses = [];
    var labels = [];

    for (var playerIndex in this.players_) {
        var player = this.players_[playerIndex];
        labels.push(player.name);
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



