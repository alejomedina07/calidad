let express = require('express'),
 debug = require('debug')('BC:ctrDefectos'),
 config = require( '../../config/general' ),
 chequeo = require( '../../models/Chequeo' ),
 mysql = require('mysql'),
 mdAutenticacion = require('../../middlewares/autenticacion'),
 router = express.Router();

router.get('/', mdAutenticacion.verificatoken(chequeo.PERMISO.DEFECTO.LISTAR), (req, res, next) => {
  res.render("chequeo/defectos", { title: 'Defectos', usuario:req.session.usuario });
});

router.get('/listar',  mdAutenticacion.verificatoken(chequeo.PERMISO.DEFECTO.LISTAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  // usuario_centro_trabajo.id,
  let query = `SELECT * FROM defecto`
  let promesa = config.consultar(connection, query);
  promesa.then(value => {
    res.json(value);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});


router.post('/',  mdAutenticacion.verificatoken(chequeo.PERMISO.DEFECTO.CREAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  let query = `INSERT INTO defecto (nombre, estado, idUsuarioCreacion)
   values ('${req.body.nombre}', '${req.body.estado}', '${req.session.usuario.id}')`;
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

router.post('/editar',  mdAutenticacion.verificatoken(chequeo.PERMISO.DEFECTO.EDITAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection),
    query = `UPDATE defecto
      SET estado = '${req.body.estado}', nombre = '${req.body.nombre}' WHERE id = '${req.body.id}'`;
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
