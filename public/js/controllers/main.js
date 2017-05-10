var app = angular.module('alpha', ['nvd3'])

app.controller('MainCtrl', function ($scope, $http) {
  let store = {}
  let barChartResult = []
  let sortedBarData = []
  let lineChartResult = []
  let newLineData = []
  let newBarData = []
  let months = {
    0: 'Dec',
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov'
  }
  $scope.periods = ['All', 'This Month']
  $scope.submit = function (selection) {
    let todayDate = new Date()
    if (selection === 'This Month') {
      lineChartResult.filter(function (item) {
        if (+item.month.split('/')[1] >= todayDate.getFullYear()) {
          if (+item.month.split('/')[0] > todayDate.getMonth()) {
            newLineData.push(item)
          }
        }
      })

      sortedBarData.filter(function (item) {
        if (+item.month.split('/')[1] >= todayDate.getFullYear()) {
          if (+item.month.split('/')[0] > todayDate.getMonth()) {
            newBarData.push(item)
          }
        }
      })
      $scope.data = [
        {
          "key": "Month's Revenue",
          "bar": true,
          "values": newBarData
        },
        {
          "key": "Cumulative Revenue",
          "values": newLineData
        }
      ].map(function (series) {
        series.values = series.values.map(function (d) {
          return {x: d.month, y: d.revenue}
        })
        return series
      })
      newLineData = []
      newBarData = []
    } else {
      $scope.data = [
        {
          "key": "Month's Revenue",
          "bar": true,
          "values": sortedBarData
        },
        {
          "key": "Cumulative Revenue",
          "values": lineChartResult
        }
      ].map(function (series) {
        series.values = series.values.map(function (d) {
          // console.log(d)
          return {x: d.month, y: d.revenue}
        })
        return series
      })
      newLineData = []
      newBarData = []
    }
  }

  $scope.options = {
    chart: {
      type: 'linePlusBarChart',
      focusEnable: false,
      height: 500,
      margin: {
        top: 30,
        right: 100,
        bottom: 50,
        left: 100
      },
      bars: {
        forceY: [0, 10000000] //  <-- this one changes the y-axis scale on the left
      },
      lines: {
        forceY: [0, 60000000] //  <-- this one changes the y-axis scale on the right
      },
      color: ['#2ca02c', 'darkred'],
      x: function (d, i) { return i },
      xAxis: {
        axisLabel: 'Date',
        tickFormat: function (d, i) {
          var dx = $scope.data[0].values[d] && $scope.data[0].values[d].x || 0
          if (dx > 0) {
            return d3.time.format('%B')(new Date(sortedBarData.month))
          }
          return months[(d+5)%12] //  <-- when i use $scope.data[1].values[d].x, it says x is undefined
        }
      },
      y1Axis: {
        axisLabel: 'Current Amount',
        tickFormat: function (d) {
          return d3.format('$,.2f')(d)
        },
        axisLabelDistance: 30
      },
      y2Axis: {
        axisLabel: 'Cumulative Amount',
        tickFormat: function (d) {
          return d3.format('$,.2f')(d)
        },
        axisLabelDistance: 20
      },
      y3Axis: {
        tickFormat: function (d) {
          return d3.format('$,.2f')(d)
        }
      },
      y4Axis: {
        tickFormat: function (d) {
          return d3.format('$,.2f')(d)
        }
      }
    }
  }

  $http.get('http://localhost:3000/api/invoice/all')
  .then(function (response) {
    store = response

    let barChartHash = store.data.reduce(function (a, b) { // hashing to sort data by month
      let currentMonth = b.date.split('/')[0]
      let currentYear = b.date.split('/')[2]
      if (a[currentMonth + '/' + currentYear]) {
        a[currentMonth + '/' + currentYear].data.push(b)
      } else {
        a[currentMonth + '/' + currentYear] = { month: currentMonth + '/' + currentYear, data: [b] }
      }
      return a
    }, {})

    for (let key in barChartHash) { // preparing the hash for input into chart by summing per month revenue
      var sum = barChartHash[key].data.reduce(function (a, b) {
        return a + b.amount
      }, 0)
      barChartResult.push({'month': key, 'revenue': +sum.toFixed(2)})
    }

    sortedBarData = barChartResult.sort(function (a, b) { // sort according to date
      if (a.month.split('/')[1] - b.month.split('/')[1] === 0) {
        return a.month.split('/')[0] - b.month.split('/')[0]
      } else {
        return b.month.split('/')[0] - a.month.split('/')[0]
      }
    })

    sortedBarData.reduce(function(a, b, index) {
      if (a === 0) {
        lineChartResult.push({'month': b.month, 'revenue': b.revenue})
      } else {
        lineChartResult.push({'month': sortedBarData[index].month, 'revenue': +(a + +b.revenue).toFixed(2)})
      }
      return a + +b.revenue
    }, 0)

    $scope.data = [
      {
        "key": "Month's Revenue",
        "bar": true,
        "values": sortedBarData
      },
      {
        "key": "Cumulative Revenue",
        "values": lineChartResult
      }
    ].map(function (series) {
      series.values = series.values.map(function (d) {
        return {x: d.month, y: d.revenue}
      })
      return series
    })
  })
})

app.controller('TableCtrl', function ($scope, $http) {
  $http.get('http://localhost:3000/api/invoice/all')
  .then(function (response) {
    $scope.data = response.data
  })
})
