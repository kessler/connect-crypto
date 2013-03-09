connect crypto utils
====================


### Install ###

```
	npm install connect-crypto
```

### query decryptor ###

decrypt predefined url parameters and reassigns the decrypted value to request.query

```
var queryDecryptor = require('connect-crypto').queryDecryptor;

var mypassword = '123123Foo';

// the server
var server = connect()		
		.use(connect.query())		
		.use(queryDecryptor('p', mypassword)) // decrypt any url that has ?p=encryptedData (will turn to ?p=decryptedData)
		.listen(3000);	


// the server
var server = connect()		
		.use(connect.query())		
		.use(queryDecryptor(['p1', 'p2'], mypassword)) // several querystring params can be decrypted 
		.listen(3000);	
	
```

further customization can be achieved by supplying an options object:
```
var options = {
	algorithm: 				which algo is used for encyption/decryption, defaults to 'aes192'

	debug: 					debug mode will write errors from decipher.final() to console and alert if 
							query middleware isn't installed

	decryptedDataEncoding:	encoding used to output decrypted data - must be the same encoding used in 
							the encyption process - defaults to 'ascii'

	encryptedDataEncoding: 	encoding used for encrypted data - defaults to 'base64'	
};

connect()
	.use(connect.query())		
	.use(queryDecryptor('p', mypassword, options));
```
when using the options object, one may specify only a subset of the above options
