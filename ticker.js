'use strict'
var Request = require('request')
var Promise = require('promise')

exports.NAME = 'Kraken'
exports.SUPPORTED_MODULES = ['ticker']

var PAIRS = {
  BTC: {
    USD: 'XXBTZUSD',
    EUR: 'XXBTZEUR'
  },
  ETH: {
    USD: 'XETHZUSD',
    EUR: 'XETHZEUR'
  }
}

var pluginConfig = {
	api_url: 'https://api.kraken.com/0/public'
}

exports.config = function config (localConfig) {
	if (localConfig) _.merge(pluginConfig, localConfig)
}

function getCurrencyRates (currency, cryptoCode) {

	return new Promise(
		function (resolve, reject) {

			var pair = PAIRS[cryptoCode][currency]
			var ticker_url = pluginConfig.api_url + '/Ticker' + '?pair=' + pair

			var options = {
				url: ticker_url,
				method: 'GET',
				json:true
			}

			Request(options, function (err, res, body) {

			if (!err && res.statusCode === 200) {
				var rates = body.result[pair]
				var rec = {}

				rec[currency] = {
					currency: currency,
					rates: {
						ask: parseFloat(rates.a[0]),
						bid: parseFloat(rates.b[0])
					}
				}

				resolve(rec) } else {
					reject(new Error(res.statusCode))
				}
			})

	})
}

exports.ticker = function ticker (currencies, cryptoCoin, callback) {
	if (typeof currencies === 'string') currencies = [currencies]

	if (currencies.length === 0) {
		return callback(new Error('Currency not specified'))
	}

	if (!callback) {
		callback = cryptoCoin
		cryptoCoin = 'BTC'
	}

	var currency = currencies[0]
		
	getCurrencyRates(currency, cryptoCoin).then(
		function (res) {
			callback(null, res)
		},
		function (reason) {
			return callback(new Error('Something went wrong getting the rates'))
		}
	)
	
}
