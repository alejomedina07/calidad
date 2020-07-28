var push = require( 'pushsafer-notifications' );


var p = new push( {
    k: 'bTfKBVlOsrWJUePSeVta',             // your 20 chars long private key
    debug: true
});

module.exports.pushsafer = p;

module.exports.SEED = '@seed-busscar-ti';

// BBOO

module.exports.CONNECTION = {
  host     : '172.16.0.37',//Desarrollo
	// host     : '172.16.0.12',// Producción
	user     : 'root',
	password : 'skpc99;B',
	database : 'calidad'
};
