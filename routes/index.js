var express = require('express'),
  mysql = require('mysql'),
  config = require( '../config/general' ),
  debug = require('debug')('BC:controlador'),
  jwt = require('jsonwebtoken'),
  SEED = require('../config/config').SEED,
  router = express.Router();


router.get('/', (req, res, next) => {
  res.render('index', { title: 'Login' });
});

router.get('/error', (req, res, next) => {
  res.render('error', { title: 'Login' });
});


router.get('/logout', (req, res, next) => {
  req.session.loggedin = false;
  req.session.usuario = '';
  res.redirect('/');
});

app.post('/login',  ( req, res ) => {


  let connection = mysql.createConnection(config.connection);
  connection.connect();
  let query = `SELECT
      usuario.id, usuario.contrasena, usuario.nombre, usuario.usuarioRed, rol.nombre AS rol,
      GROUP_CONCAT(operacion.nombre) AS operaciones
    FROM usuario INNER JOIN usuario_rol on usuario.id = usuario_rol.idUsuario
    INNER JOIN rol on rol.id = usuario_rol.idRol
    INNER JOIN rol_operacion on rol.id = rol_operacion.idRol
    INNER JOIN operacion on operacion.id = rol_operacion.idOperacion
    WHERE usuario.usuarioRed = '${req.body.usuarioRed}'
    AND usuario.estado = 'Activo'
    GROUP by usuario.id`
  let promesa = config.consultar(connection, query);
  promesa
  .then(usuario => {
    if (!usuario || !usuario.length) {
      res.status(400).json( { error:false, mensaje: 'Credenciales incorrectas'});
    }else {

      // login sin autenticar en directorio activo
      // usuario = usuario[0];
      // token = jwt.sign( { usuario: usuario }, SEED, { expiresIn:14400 } ) // 4horas
      // req.session.loggedin = token;
      // req.session.usuario = usuario;
      //
      // let md5 = require('md5');
      // req.body.contrasena = md5(req.body.contrasena);
      // delete usuario.contrasena;
      // return res.status(200).json( { error:false, usuario, token });

      //Fin  login sin autenticar en directorio activo

      // login autenticando en directorio activo

      var ActiveDirectory = require('activedirectory');
      var config = {
          url: 'ldap://172.16.0.26',
          baseDN: 'dc=busscarad,dc=local'
      };
      var ad = new ActiveDirectory(config);

      // Authenticate
      // ad.authenticate(`amedinar@busscarad.local`, '+busscar2022', function(err, auth) {
      ad.authenticate(`${req.body.usuarioRed}@busscarad.local`, req.body.contrasena, function(err, auth) {
          debug(req.body);
          debug('auth');
          debug(auth);
          debug('err');
          debug(err);
          // autenticar();
          if (err) res.status(400).json( { error:true, mensaje: 'Credenciales incorrectas'});
          else {
            if (auth) {
              autenticar();
            }
            else res.status(400).json( { error:true, mensaje: 'Credenciales incorrectas'});
          }


          function autenticar() {
            usuario = usuario[0];
            token = jwt.sign( { usuario: usuario }, SEED, { expiresIn:14400 } ) // 4horas
            req.session.loggedin = token;
            req.session.usuario = usuario;

            let md5 = require('md5');
            req.body.contrasena = md5(req.body.contrasena);
            if (usuario.contrasena != req.body.contrasena) guardarContrasena(req.body.usuarioRed, req.body.contrasena);
            delete usuario.contrasena;
            return res.status(200).json( { error:false, usuario, token });
          }
      });

    }
  })
  .catch(err => {
    debug('err catch');
    debug(err);
    res.status(500).json( { error:false, mensaje: 'Error interno.'});
  });



});



function guardarContrasena(usuario, contrasena) {
  debug(1234654645);
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  let query = `UPDATE usuario SET contrasena = '${contrasena}'
    WHERE usuario.usuarioRed = '${usuario}'`
  let promesa = config.consultar(connection, query);
  promesa
  .then(value => {
    debug('guardarContrasena');
    debug(value);
  })
  .catch(error => {
    console.log('error');
    console.log(error);
  });
}





module.exports = router;
