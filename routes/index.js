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
      usuario.id,
      usuario.nombre,
      usuario.usuarioRed,
      rol.nombre AS rol,
      GROUP_CONCAT(operacion.nombre) AS operaciones
    FROM usuario INNER JOIN usuario_rol on usuario.id = usuario_rol.idUsuario
    INNER JOIN rol on rol.id = usuario_rol.idRol
    INNER JOIN rol_operacion on rol.id = rol_operacion.idRol
    INNER JOIN operacion on operacion.id = rol_operacion.idOperacion
    WHERE usuario.usuarioRed = '${req.body.usuarioRed}' and usuario.contrasena = '${req.body.contrasena}'
    AND usuario.estado = 'Activo'
    GROUP by usuario.id`
  // let promesa = config.consultar(connection, `SELECT * FROM usuario WHERE usuarioRed = '${req.body.usuarioRed}' and contrasena = '${req.body.contrasena}'`);
  let promesa = config.consultar(connection, query);
  promesa.then(usuario => {
    if (!usuario || !usuario.length) {
      res.status(400).json( { error:false, mensaje: 'Credenciales incorrectas -- email'});
    }else {
      usuario = usuario[0];
      delete usuario.contrasena;
       token = jwt.sign( { usuario: usuario }, SEED, { expiresIn:14400 } ) // 4horas
      req.session.loggedin = token;
      req.session.usuario = usuario;
      // debug('req.session.usuario');
      // debug(req.session.usuario);
      return res.status(200).json( { error:false, usuario, token });
      res.json(usuario);

    }
  })
  .catch(err => {
    res.status(500).json( { error:false, mensaje: 'Error interno.'});
  });

});



module.exports = router;
