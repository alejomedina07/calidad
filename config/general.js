var Config = function(){};

Config.prototype.connection = require('./config').CONNECTION;

Config.prototype.consultar = function(connection, query, data) {
	// console.log('query ------------');
	// console.log(query);
  return new Promise(function(resolve,reject){
      connection.query(query,data,function(error,results,field){
        console.log('error *------------------------------');
        console.log(error);
          if(error){reject( new Error("Error " + error))};
					resolve(results);
      })
      connection.end()
  })
}


module.exports = new Config();
