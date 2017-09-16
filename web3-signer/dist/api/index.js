'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _package = require('../../package.json');

var _express = require('express');

var _facets = require('./facets');

var _facets2 = _interopRequireDefault(_facets);

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
	var config = _ref.config,
	    db = _ref.db;

	var api = (0, _express.Router)();

	// mount the facets resource
	api.use('/facets', (0, _facets2.default)({ config: config, db: db }));

	// perhaps expose some API metadata at the root
	api.get('/', function (req, res) {
		res.json({ version: _package.version });
	});

	api.get('/do_transaction', function (req, res) {

		var web3 = new _web2.default(new _web2.default.providers.HttpProvider('https://rinkeby.infura.io/cPqmhj9ZK2EWjKRq3FUG'));
		var address = '0xc51fb6b35bc1534373aedee98dea0f153acc3ae9';
		var key = '2653534f4b92cfea6ff14d13080e87b95eff99594ae9bebf4ccc0e81eee5f18e';

		var merchant = "0x9838ECaa5D49a01e1B6e13bA07bDc87a6AEBab92";
		var blogOwner = "0x2a86D62A7e5860a275A2ace8bfe3141dC7EE907D";
		var siroop = "0xCeCfF1AD5dfbA6C12AB1c3D45549609F028B97Dd";

		/*
  console.log(web3);
  	var smartBuyer = new web3.eth.Contract([{"constant":false,"inputs":[{"name":"_merchant","type":"address"},{"name":"_category","type":"bool"},{"name":"_maxOrder","type":"uint256"},{"name":"_amountStock","type":"uint256"}],"name":"addProduct","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_orderID","type":"uint256"}],"name":"returnArrived","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"austrianPost","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"blogOwners","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"electronicProducts","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_productID","type":"uint256"},{"name":"_merchant","type":"address"},{"name":"_blogOwner","type":"address"},{"name":"isSiroop","type":"bool"},{"name":"_amount","type":"uint256"}],"name":"doPurchase","outputs":[{"name":"result","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"siroop","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"productStock","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"productMaxOrders","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"products","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_orderID","type":"uint256"}],"name":"productDelivered","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_merchant","type":"address"}],"name":"addMerchant","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_siroop","type":"address"}],"name":"changeSiroop","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_blogOwner","type":"address"}],"name":"addBlogOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"merchants","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}]);
  smartBuyer.options.address = '0x76e9abef06dfcd3b862234ccfc5030fd8ba231d7';
  	var x = smartBuyer.methods.doPurchase(0, merchant, blogOwner, true, 2).send({from: '0xc51fb6b35bc1534373aedee98dea0f153acc3ae9'})
  .then(function(receipt){
      console.log(receipt);
  });
  */

		var Tx = require('ethereumjs-tx');
		var privateKey = new Buffer(key, 'hex');
		console.log();

		// Get current nonce
		web3.eth.getTransactionCount(address, function (error, result) {
			console.log(result.toString(16));
			var rawTx = {
				nonce: '0x' + result.toString(16),
				gasPrice: '0x174876E800',
				gasLimit: '0x3D090',
				to: '0x76e9abef06dfcd3b862234ccfc5030fd8ba231d7',
				value: '0x16345785D8A0000',
				data: '0x46e9b66100000000000000000000000000000000000000000000000000000000000000000000000000000000000000009838ecaa5d49a01e1b6e13ba07bdc87a6aebab920000000000000000000000002a86d62a7e5860a275a2ace8bfe3141dc7ee907d00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002'
			};

			var tx = new Tx(rawTx);
			tx.sign(privateKey);

			var serializedTx = tx.serialize();
			//serializedTx = parseInt(serializedTx).toString(16);
			console.log('serializedTx');
			console.log(serializedTx.toString('hex'));
			serializedTx = '0x' + serializedTx.toString('hex');

			// send transaction
			web3.eth.sendRawTransaction(serializedTx.toString('hex'), function (err, hash) {
				if (!err) console.log(hash);
				res.json(hash);
			});
		});

		//web3.eth.sendRaw()


		//res.json(true);
	});

	return api;
};
//# sourceMappingURL=index.js.map