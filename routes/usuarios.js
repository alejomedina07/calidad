let express = require('express'),
 debug = require('debug')('BC:ctrUser'),
 config = require( '../config/general' ),
 mysql = require('mysql'),
 router = express.Router();

router.get('/', function(req, res, next) {
  console.log('register/success');
  res.render("usuarios/lista");
});

router.get('/listar', function(req, res, next) {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  let promesa = config.consultar(connection, 'SELECT * FROM usuario');
  promesa.then(value => {
    res.json(value);
  })
  .catch(err => {
    connection.end();
  });
});


router.get('/obtener-roles', function(req, res, next) {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  let promesa = config.consultar(connection, 'SELECT * FROM rol WHERE estado = "Activo" ');
  promesa.then(value => {
    res.json(value);
  })
  .catch(err => {
    debug(err);
    connection.end();
  });
});

router.get('/formulario', function(req, res, next) {
  res.render('usuarios/formulario', { title: 'Usuarios - Formulario' });
});

router.get('/formulario/:id', function(req, res, next) {
  res.render('usuarios/formulario', { title: 'Usuarios - Formulario', id : req.params.id });
});

router.get('/eliminar/:id', function(req, res, next) {
  let query = "UPDATE usuario SET estado = 'Eliminado' WHERE usuario.id = " + req.params.id;
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  let promesa = config.consultar(connection, query);
  promesa.then(value => {
    res.json(value);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

router.get('/obtener/:id', function(req, res, next) {
  let query = 'SELECT * FROM usuario INNER JOIN usuario_rol ON usuario.id = usuario_rol.idUsuario WHERE usuario.id = ' + req.params.id,
    connection = mysql.createConnection(config.connection);
  connection.connect();
  let promesa = config.consultar(connection, query);
  promesa.then(value => {
    if (value && value.length) res.json(value);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

router.post('/', function(req, res, next) {
  let connection = mysql.createConnection(config.connection),
    query = "INSERT INTO usuario (nombre, estado, usuarioRed, contrasena, correo, idAplicacionMovil, idUsuarioCreacion, fechaCreacion) VALUES (?, ?,?, ?,?, ?,?, ?)",
    data = [req.body.nombre, req.body.estado, req.body.usuarioRed, req.body.contrasena, req.body.correo, req.body.idAplicacionMovil, 3, req.body.fechaCreacion];
  connection.connect();
  let promesa = config.consultar(connection, query, data);
  promesa
  .then(value => {
    let connection2 = mysql.createConnection(config.connection),
      query = "INSERT INTO usuario_rol ( idUsuario, idRol) VALUES (?,?)",
      data = [ value.insertId, req.body.idRol];
    let promesa = config.consultar(connection2, query, data);
    return promesa
  })
  .then(value => {
    res.json({data: value});
  })
  .catch(err => {
    res.status(500).json(err);
  });
});


router.post('/editar', function(req, res, next) {
  let connection = mysql.createConnection(config.connection),
    query = `UPDATE usuario
     SET nombre = '${req.body.nombre}', estado = '${req.body.estado}', usuarioRed = '${req.body.usuarioRed}', correo = '${req.body.correo}', idAplicacionMovil = '${req.body.idAplicacionMovil}'
     WHERE id = '${req.body.id}'`;
  connection.connect();
  let promesaUsuario = config.consultar(connection, query);
  let connection2 = mysql.createConnection(config.connection),
    query2 = `UPDATE usuario_rol SET idRol = '${req.body.idRol}' WHERE idUsuario = '${req.body.id}'`;
  let promesaUsuarioRol = config.consultar(connection2, query2);
  Promise.all([promesaUsuario, promesaUsuarioRol])
  .then(value => {
    res.json({data: value});
  })
  .catch(err => {
    debug('??????????????');
    debug(err);
    res.status(500).json(err);
  });
});


module.exports = router;
