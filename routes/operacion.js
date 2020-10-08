let express = require('express'),
 debug = require('debug')('BC:ctrOperacio'),
 config = require( '../config/general' ),
 usuario = require( '../models/Usuario' ),
 mysql = require('mysql'),
 mdAutenticacion = require('../middlewares/autenticacion'),
 router = express.Router();

router.get('/', mdAutenticacion.verificatoken(usuario.PERMISO.PERMISOS.LISTAR), (req, res, next) => {
  res.render("permisos/operacion", { title: 'Permisos - Operacion', usuario:req.session.usuario });
});

router.get('/listar',  mdAutenticacion.verificatoken(usuario.PERMISO.LISTAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  let promesa = config.consultar(connection, 'SELECT * FROM operacion');
  promesa.then(value => {
    res.json(value);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});


router.get('/formulario', mdAutenticacion.verificatoken(usuario.PERMISO.PERMISOS.CREAR), (req, res, next) => {
  res.render('usuarios/formulario', { title: 'Usuarios - Formulario', usuario:req.session.usuario });
});

router.get('/formulario/:id', mdAutenticacion.verificatoken(usuario.PERMISO.PERMISOS.EDITAR), (req, res, next) => {
  res.render('usuarios/formulario', { title: 'Usuarios - Formulario', id : req.params.id, usuario:req.session.usuario });
});

router.post('/',  mdAutenticacion.verificatoken(usuario.PERMISO.PERMISOS.CREAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection),
    query = "INSERT INTO operacion (nombre, estado) VALUES (?,?)",
    data = [req.body.nombre, req.body.estado];
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

router.post('/editar',  mdAutenticacion.verificatoken(usuario.PERMISO.PERMISOS.EDITAR), (req, res, next) => {
  debug('**************-*************-************');
  let connection = mysql.createConnection(config.connection),
    query = `UPDATE operacion
     SET nombre = '${req.body.nombre}', estado = '${req.body.estado}'
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

router.get('/obtener/:id',  mdAutenticacion.verificatoken(usuario.PERMISO.PERMISOS.EDITAR), (req, res, next) => {
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
