let express = require('express'),
 debug = require('debug')('BC:ctrDefectos'),
 config = require( '../../config/general' ),
 chequeo = require( '../../models/Chequeo' ),
 mysql = require('mysql'),
 mdAutenticacion = require('../../middlewares/autenticacion'),
 router = express.Router();

router.get('/', mdAutenticacion.verificatoken(chequeo.PERMISO.OPERACION.LISTAR), (req, res, next) => {
  res.render("chequeo/operaciones", { title: 'Operacion - chequeo', usuario:req.session.usuario });
});

router.get('/listar',  mdAutenticacion.verificatoken(chequeo.PERMISO.OPERACION.LISTAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  let query = `SELECT oc.*, c.nombre as categoria FROM operacion_chequeo oc
    INNER JOIN categoria c ON c.id = oc.idCategoria`
  let promesa = config.consultar(connection, query);
  promesa.then(value => {
    res.json(value);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});


router.get('/listar-categorias',  mdAutenticacion.verificatoken(chequeo.PERMISO.OPERACION.CREAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  let query = `SELECT * FROM categoria`
  let promesa = config.consultar(connection, query);
  promesa.then(value => {
    res.json(value);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});


router.post('/',  mdAutenticacion.verificatoken(chequeo.PERMISO.OPERACION.CREAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  let query = `INSERT INTO operacion_chequeo (nombre, estado, idCategoria, idUsuarioCreacion)
   values ('${req.body.nombre}', '${req.body.estado}', '${req.body.idCategoria}', '${req.session.usuario.id}')`;
  connection.connect();
  let promesa = config.consultar(connection, query);

  debug(666666666666666666666666666666666666666666);
  promesa
  .then(value => {
    res.json({data: value});
  })
  .catch(err => {
    debug('err');
    debug(err);
    res.status(500).json(err);
  });
});

router.post('/editar',  mdAutenticacion.verificatoken(chequeo.PERMISO.OPERACION.EDITAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection),
    query = `UPDATE operacion_chequeo
      SET estado = '${req.body.estado}', nombre = '${req.body.nombre}', idCategoria = '${req.body.idCategoria}' WHERE id = '${req.body.id}'`;
  connection.connect();
  let promesa = config.consultar(connection, query);
  promesa
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
