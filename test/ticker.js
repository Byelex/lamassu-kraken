'use strict'

var tickerPlugin = require('../ticker');

tickerPlugin.ticker('EUR', function(err, results) {
    console.log(results)
});
