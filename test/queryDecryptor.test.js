var vows = require('vows');
var assert = require('assert');
var crypto = require('crypto');

var queryDecryptor = require('../index').queryDecryptor;

function encrypt(data) {
	var cipher = crypto.createCipher('aes192', '123');
	cipher.update(data, 'ascii');

	return cipher.final('base64');
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
					a: encrypt('foo'),
					b: encrypt('bar')
				}
			}
			
			topic(mock, null, function() {});

			assert.strictEqual('foo', mock.query.a);
			assert.strictEqual('bar', mock.query.b);
		}
	}	
});

suite.export(module);