let express = require('express'),
 debug = require('debug')('BC:ctrOperacio'),
 config = require( '../config/general' ),
 usuario = require( '../models/Usuario' ),
 mysql = require('mysql'),
 mdAutenticacion = require('../middlewares/autenticacion'),
 router = express.Router();

router.get('/', mdAutenticacion.verificatoken(usuario.PERMISO.LISTAR), (req, res, next) => {
  res.render("permisos/operacion_rol", { title: 'Permisos - Operacion', usuario:req.session.usuario });
});

router.get('/listar',  mdAutenticacion.verificatoken(usuario.PERMISO.LISTAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  let promesa = config.consultar(connection, 'SELECT ro.*, o.nombre as operacion, r.nombre as rol FROM rol_operacion ro INNER JOIN operacion o ON ro.idOperacion = o.id INNER JOIN rol r ON ro.idRol = r.id');
  promesa.then(value => {
    res.json(value);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

router.get('/listar-roles',  mdAutenticacion.verificatoken(usuario.PERMISO.LISTAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  let promesa = config.consultar(connection, 'SELECT * FROM rol WHERE estado = "Activo"');
  promesa.then(value => {
    res.json(value);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});



router.get('/formulario', mdAutenticacion.verificatoken(usuario.PERMISO.CREAR), (req, res, next) => {
  res.render('usuarios/formulario', { title: 'Usuarios - Formulario', usuario:req.session.usuario });
});

router.get('/formulario/:id', mdAutenticacion.verificatoken(usuario.PERMISO.EDITAR), (req, res, next) => {
  res.render('usuarios/formulario', { title: 'Usuarios - Formulario', id : req.params.id, usuario:req.session.usuario });
});

router.post('/',  mdAutenticacion.verificatoken(usuario.PERMISO.CREAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection),
    query = "INSERT INTO rol_operacion (idRol, idOperacion) VALUES (?,?)",
    data = [req.body.idRol, req.body.idOperacion];
  connection.connect();
  let promesa = config.consultar(connection, query, data);
  promesa
  .then(value => {
    res.json({data: value});
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

router.post('/editar',  mdAutenticacion.verificatoken(usuario.PERMISO.EDITAR), (req, res, next) => {
  debug('**************-*************-************');
  let connection = mysql.createConnection(config.connection),
    query = `UPDATE rol_operacion
     SET idRol = '${req.body.idRol}', idOperacion = '${req.body.idOperacion}'
     WHERE id = '${req.body.id}'`;
  connection.connect();
  let promesa = config.consultar(connection, query);
  promesa.then(value => {
    debug(222222222222222222222222);
    res.json({data: value});
  })
  .catch(err => {
    debug('??????????????');
    debug(err);
    res.status(500).json(err);
  });
});

router.get('/obtener/:id',  mdAutenticacion.verificatoken(usuario.PERMISO.EDITAR), (req, res, next) => {
  let query = 'SELECT * FROM usuario INNER JOIN usuario_rol ON usuario.id = usuario_rol.idUsuario WHERE usuario.id = ' + req.params.id,
    connection = mysql.createConnection(config.connection);
  connection.connect();
  let promesa = config.consultar(connection, query);
  promesa.then(value => {
    debug('value obtener');
    debug(value);
    let roles = [];
    value.forEach((item, i) => {
      roles.push(item.idRol);
    });
    debug(roles);
    value[0].idRol = roles;
    if (value && value.length) res.json(value);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});


module.exports = router;
