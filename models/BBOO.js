var mysql = require('mysql'),
  General = function(){};

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodelogin'
});


General.prototype.consulta = function (query) {
  console.log('query');
  console.log(query);
  return new Promise((resolver, rechazar) => {
    connection.connect(function(error) {
      if (error) rechazar(error);
      connection.query("SELECT name, address FROM customers", function (err, result, fields) {
        if (err) rechazar(error);
        console.log(fields);
        resolver(fields);
      });
    });
  });

};






module.exports = new General();
