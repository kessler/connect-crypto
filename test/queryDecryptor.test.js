var vows = require('vows');
var assert = require('assert');
var crypto = require('crypto');

var queryDecryptor = require('../index').queryDecryptor;

function encrypt(data) {
	var cipher = crypto.createCipher('aes192', '123');
	var zz = cipher.update(data, 'ascii', 'base64');
	
	return zz + cipher.final('base64');
}

var suite = vows.describe('query decipherer middleware');

suite.addBatch({
	'main test': {
		topic: function() {
			return queryDecryptor(['a', 'b'], '123', {debug:true});
		},		
		'yet another useless label': function(topic) {

			var mock = {
				query: {
					a: encrypt('foo 123987 1!@# )()(!@# @#)@()@ #()# @'),
					b: encrypt('bar 92929299 109123 0ojkasdmnka;f !#${"!{!{2')
				}
			}
			
			topic(mock, null, function() {});
			
			assert.strictEqual(mock.query.a, 'foo 123987 1!@# )()(!@# @#)@()@ #()# @');
			assert.strictEqual(mock.query.b, 'bar 92929299 109123 0ojkasdmnka;f !#${"!{!{2');
		}
	}	
});

suite.export(module);