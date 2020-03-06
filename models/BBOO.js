var mysql = require('mysql'),
  General = function(){};

const connection = mysql.createConnection({
	host     : '172.16.0.12',
	user     : 'root',
	password : 'skpc99;B',
	database : 'homologacion'
});


General.prototype.consulta = function (query) {
  console.log('query');
  console.log(query);
  return new Promise((resolver, rechazar) => {
    connection.connect(function(error) {
      if (error) rechazar(error);
      connection.query("SELECT * FROM bodega", function (err, result, fields) {
        if (err) rechazar(error);
        // console.log('fields');
        // console.log(fields);
        resolver(fields);
      });
    });
  });

};






module.exports = new General();
