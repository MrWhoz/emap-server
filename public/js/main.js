$('.message a').click(function() {
    $('form').animate({
        height: "toggle",
        opacity: "toggle"
    }, "slow");

});

function checkLogin() {
    var user = null;
    $.ajax({
        url: '/isLogged',
        type: 'GET',
        dataType: "json",
        async: false,
        success: function(data) {
            if (data.username) {
                var strtmp = '<li data-toggle="modal" data-target="#myModal1" id="modalbox"> <a href="#">' + data.username + '</a></li>';
                console.log(strtmp);
                $("#name").html(data.name);
                $("#navbar").append('<li data-toggle="modal" data-target="#myModal1" id="modalbox"> <a href="#">' + data.username + '</a></li>')
                user = data;
                document.cookie = data;
            } else {
                $("#navbar").append('<li data-toggle="modal" data-target="#myModal" id="modalbox"><a href="#" id="user">LOGIN</a></li>');
            }
        }
    });
    return user;
};

function getMonthlyRecord() {
    var mData = null;
    $.ajax({
        url: '/node/monthlyrecord',
        type: 'GET',
        dataType: "json",
        async: false,
        success: function(data) {
            mData = data;
        }
    });
    return mData;
}
function totalNode(data){
  var sumNode = null;
  var count = Object.keys(data.record).length;
  for (var i = 0; i < count; i++) {
      sumNode += Number(data.nodes[i].reduction);
  }
  return sumNode;
}
function totalRecord(data){
  var sumRecord = null;
  var count = Object.keys(data.record).length;
  for (var i = 0; i < count; i++) {
      sumRecord += Number(data.record[i].reduction);
  }
  return sumRecord;
}
function drawMonthlyChart(data) {
    var month = [];
    var record = [];
    var node = [];
    var count = Object.keys(data.record).length;
    console.log('count', count);
    for (var i = 0; i < count; i++) {
        month.push(data.record[i].group[1] + ' - ' + data.record[i].group[0]);
        record.push(Number(data.record[i].reduction));
        node.push(Number(data.nodes[i].reduction));
    }
    console.log(month, record);
    $(function() {
            Highcharts.chart('container', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Monthly number of Nodes and Records'
                },
                subtitle: {
                    text: ''
                },
                xAxis: [{
                    categories: month,
                    crosshair: true
                }],
                yAxis: [{ // Primary yAxis
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'Node',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    }
                }, { // Secondary yAxis
                    title: {
                        text: 'Records',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        format: '{value} records',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    opposite: true
                }],
                tooltip: {
                    shared: true
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    x: 120,
                    verticalAlign: 'top',
                    y: 100,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                },
                series: [{
                    name: 'Records',
                    data: record,
                    type: 'column',
                    yAxis: 1,
                    tooltip: {
                        valueSuffix: ' Records'
                    }

                }, {
                    name: 'Node',
                    type: 'spline',
                    data: node,
                    tooltip: {
                        valueSuffix: ' Nodes'
                    }
                }]
            });
        });
    }
