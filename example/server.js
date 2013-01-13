var http = require('http');
var connect = require('connect');
var queryDecryptor = require('../index').queryDecryptor;
var crypto = require('crypto');
var querystring = require('querystring');

var decryptedData = 'lkaasssssssssssss';
var password = 'shhhhh';

// the server
var server = connect()
		.use(connect.query())
		.use(queryDecryptor('p', password, {debug:true}))
		.use('/foo', function(request, response) {
			
			if (request.query.p !== decryptedData)	
				throw new Error('oops!');

			console.log(request.query.p); //prints the value of decryptedData		
			response.end();
		}).listen(80);	

server.on('listening', function() {
	console.log('listening');
	
	// client simulation
	var cipher = crypto.createCipher('aes192', password);
	cipher.update(decryptedData, 'ascii');
	var encryptedData = cipher.final('hex');
	
	var url = 'http://localhost/foo?p=' + encryptedData;
	
	http.get(url, function(response) {
		console.log(response.statusCode);
		
		server.close();
		process.exit(0);
	});	

});

