var crypto = require('crypto');
var $u = require('util');
/*
	@param paramOrParams 	- the names of the keys in the querystring to decrypt can be an array or a single parameter
	@param password 		- password used for decryption
	@param options			- optional, various options related to the operation of the middleware:
								algorithm: 				which algo is used for encyption/decryption, defaults to 'aes192'

								debug: 					debug mode will write errors from decipher.final() to console and alert if 
														query middleware isn't installed

								decryptedDataEncoding:	encoding used to output decrypted data - must be the same encoding used in 
														the encyption process - defaults to 'ascii'

								encryptedDataEncoding: 	encoding used for encrypted data - defaults to 'base64'
*/
exports.queryDecryptor = function(paramOrParams, password, options) {
	if (!password)
		throw new Error('must specify password');

	options = options || {};

	var params = $u.isArray(paramOrParams) ? paramOrParams : [paramOrParams];

	options.algorithm = options.algorithm || 'aes192';
	options.debug = options.debug || false;
	options.decryptedDataEncoding = options.decryptedDataEncoding || 'ascii';
	options.encryptedDataEncoding = options.encryptedDataEncoding || 'base64';
	
	if (options.debug)
		console.log('query decipherer options: %s', $u.inspect(options));

	return function(request, response, next) {

		if (typeof(request.query) !== 'undefined') {
			
			for (var i = 0; i < params.length; i++) {
				
				var param = params[i];
				var cipheredValue = request.query[param];
				
				if (cipheredValue) {
					
					var decipher = crypto.createDecipher(options.algorithm, password)										
					var result = decipher.update(decodeURIComponent(cipheredValue), options.encryptedDataEncoding, options.decryptedDataEncoding);
					
					try {												
						request.query[param] = result + decipher.final(options.decryptedDataEncoding);						
					} catch (e) {
						if (options.debug) 							
							throw e;						
					}
				}
			}

		} else if (options.debug) {
			console.warn('query middleware not installed!');
		}

		next();
	};

};