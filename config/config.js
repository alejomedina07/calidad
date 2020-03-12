var push = require( 'pushsafer-notifications' );


var p = new push( {
    k: 'Your20CharPrivateKey',             // your 20 chars long private key
    debug: true
});

module.exports.pushsafer = p;

module.exports.SEED = '@seed-busscar-ti';

// BBOO

module.exports.CONNECTION = {
	host     : '172.16.0.37',
	user     : 'root',
	password : 'skpc99;B',
	database : 'calidad'
};
