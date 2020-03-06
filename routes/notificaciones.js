var express = require('express'),
 debug = require('debug')('BC:ctrNoti'),
 config = require( '../config/general' ),
 mysql = require('mysql'),
 connection = mysql.createConnection({
   host     : config.connection.host,
   user     : config.connection.user,
   password : config.connection.password,
   database : config.connection.database
 }),
 router = express.Router();

/* GET home page. */




router.get('/', function(req, res, next) {



  console.log('register/success');
    //console.log(obj)// success
  var connection = mysql.createConnection(config.connection);
  connection.connect();
  var promesa = config.consultar(connection);

  promesa.then(value => {
    debug('value ***************************');
    debug(value);
    res.render("notificaciones/lista");
  })
  .catch(err => {
    debug(err);
    connection.end();
  });


});

router.get('/formulario', function(req, res, next) {
  res.render('notificaciones/formulario', { title: 'Express' });
});


module.exports = router;
