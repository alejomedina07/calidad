var Config = function(){};

// const connection = mysql.createConnection({
// 	host     : '172.16.0.37',
// 	user     : 'root',
// 	password : 'skpc99;B',
// 	database : 'calidad'
// });

// INSERT INTO `calidad`.`rol` (`id`, `nombre`, `estado`) VALUES ('0', 'Auditor', 'Activo');

Config.prototype.connection = {
	host     : '172.16.0.37',
	user     : 'root',
	password : 'skpc99;B',
	database : 'calidad'
};



Config.prototype.consultar = function(connection, query, data) {
  return new Promise(function(resolve,reject){

      // connection.query('INSERT INTO rol (nombre, estado) VALUES (?, ?)', ['Auditor','Activo'],function(error,results,field){
			// connection.query('SELECT * FROM rol',function(error,results,field){
      connection.query(query,data,function(error,results,field){
					console.log('weqwerqwer');
					console.log(query);
          if(error){reject( new Error("Error " + error))};
					// console.log('results xxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
					// console.log(results);
					// console.log('field xxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
					// console.log(field);
					resolve(results);
          // resolve(JSON.parse(JSON.stringify(results)))
      })
      connection.end()
  })
}


module.exports = new Config();
