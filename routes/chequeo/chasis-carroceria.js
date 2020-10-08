let express = require('express'),
 debug = require('debug')('BC:ctrChasis_carroceria'),
 config = require( '../../config/general' ),
 chequeo = require( '../../models/Chequeo' ),
 mysql = require('mysql'),
 mdAutenticacion = require('../../middlewares/autenticacion'),
 router = express.Router();

router.get('/', mdAutenticacion.verificatoken(chequeo.PERMISO.OPERACION.LISTAR), (req, res, next) => {
  res.render("chequeo/chasis-carroceria/lista", { title: 'Operacion - chequeo', usuario:req.session.usuario });
});

router.get('/editar/:id', mdAutenticacion.verificatoken(chequeo.PERMISO.OPERACION.LISTAR), (req, res, next) => {
  res.render("chequeo/chasis-carroceria/formulario", { title: 'Operacion - chequeo', usuario:req.session.usuario, id:req.params.id });
});


router.get('/formulario', mdAutenticacion.verificatoken(chequeo.PERMISO.OPERACION.LISTAR), (req, res, next) => {
  res.render("chequeo/chasis-carroceria/formulario", { title: 'Operacion - chequeo', usuario:req.session.usuario });
});


router.get('/carroceria',  mdAutenticacion.verificatoken(chequeo.PERMISO.OPERACION.LISTAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  let query = `SELECT * FROM pdmsinergia.carroceria`
  let promesa = config.consultar(connection, query);
  promesa.then(value => {
    res.json(value);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

router.get('/categorias',  mdAutenticacion.verificatoken(chequeo.PERMISO.OPERACION.LISTAR), (req, res, next) => {
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

router.get('/operaciones/:idCategoria',  mdAutenticacion.verificatoken(chequeo.PERMISO.OPERACION.LISTAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  let query = `SELECT * FROM operacion_chequeo WHERE idCategoria = ${req.params.idCategoria}`
  let promesa = config.consultar(connection, query);
  promesa.then(value => {
    res.json(value);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

router.get('/chasis/:idCarroceria',  mdAutenticacion.verificatoken(chequeo.PERMISO.OPERACION.LISTAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  //SELECT  FROM `chasis_carroceria` cc INNER JOIN chasis c ON c.id = cc.idChasis
  let query = `SELECT cc.*, c.abreviatura FROM pdmsinergia.chasis_carroceria cc INNER JOIN pdmsinergia.chasis c ON c.id = cc.idChasis WHERE cc.idCarroceria = ${req.params.idCarroceria}`
  let promesa = config.consultar(connection, query);
  promesa.then(value => {
    res.json(value);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

router.get('/listar',  mdAutenticacion.verificatoken(chequeo.PERMISO.OPERACION.LISTAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  let query = `SELECT cc.*, u.nombre as usuario, chaca.idChasis, chaca.idCarroceria, ca.nombre, CONCAT(cha.marca, " ", cha.referencia, " ", cha.distanciaEjes) as abreviatura, COUNT(cco.id) as operaciones
    FROM chasis_carroceria cc
    INNER JOIN pdmsinergia.chasis_carroceria chaca ON chaca.id = cc.idChasisCarroceria
    INNER JOIN pdmsinergia.carroceria ca ON ca.id = chaca.idCarroceria
    INNER JOIN pdmsinergia.chasis cha ON cha.id = chaca.idChasis
    INNER JOIN usuario u ON u.id = cc.idUsuarioCreacion
    LEFT JOIN calidad.chasis_carroceria_operacion cco on cco.idChasisCarroceria = cc.id AND cco.estado = 'Activo' GROUP BY cco.idChasisCarroceria`
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
  let query = `INSERT INTO chasis_carroceria (idChasisCarroceria, estado, idUsuarioCreacion)
   values ('${req.body.idChasisCarroceria}', 'Activo', '${req.session.usuario.id}')`;
  connection.connect();
  let promesa = config.consultar(connection, query);

  debug(666666666666666666666666666666666666666666);
  promesa
  .then(value => {
    let connection2 = mysql.createConnection(config.connection), data = '';

    // req.body.categorias.forEach((item, i) => {
    // });
    req.body.operaciones.forEach((operacion, i) => {
      data = ` ${data} ( ${value.insertId}, ${operacion}, 'Activo', ${req.session.usuario.id} ),`;
    });
    data = data.slice(0, data.length - 1);
    let query = `INSERT INTO chasis_carroceria_operacion (idChasisCarroceria, idOperacion, estado, idUsuarioCreacion) values ${data}`;
    debug("data");
    debug(query);
    connection2.connect();
    let promesa = config.consultar(connection2, query);
    return promesa
  })
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
    query = `UPDATE chasis_carroceria_operacion
      SET estado = 'Inactivo' WHERE idChasisCarroceria = '${req.body.id}'`;
  connection.connect();
  let promesa = config.consultar(connection, query);
  promesa
  .then(value => {

    let connection = mysql.createConnection(config.connection),
      data = '';

    req.body.operaciones.forEach((operacion, i) => {
      data = ` ${data} ( ${req.body.id}, ${operacion}, 'Activo', ${req.session.usuario.id} ),`;
    });

    data = data.slice(0, data.length - 1);
    let query = `INSERT INTO chasis_carroceria_operacion (idChasisCarroceria, idOperacion, estado, idUsuarioCreacion)
     values ${data} ON DUPLICATE KEY update estado='Activo'`;
    connection.connect();
    let promesa = config.consultar(connection, query);
    return promesa;
  })
  .then(value => {
    debug(999999999999999999999999999999999999);
    res.json({data: value});
  })
  .catch(err => {
    debug('??????????????     ---------------');
    debug(err);
    res.status(500).json(err);
  });
});

router.get('/obtener/:id',  mdAutenticacion.verificatoken(chequeo.PERMISO.OPERACION.EDITAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection), arrayPromesas = [],
    query = `SELECT cc.*, chaca.idCarroceria FROM chasis_carroceria cc
      INNER JOIN pdmsinergia.chasis_carroceria chaca on chaca.id = cc.idChasisCarroceria
      WHERE cc.id = ${req.params.id}`;
  connection.connect();
  arrayPromesas.push(config.consultar(connection, query));

  let connection2 = mysql.createConnection(config.connection),
    query2 = `SELECT * FROM chasis_carroceria_operacion WHERE idChasisCarroceria = ${req.params.id} AND estado = 'Activo'`;
  connection2.connect();
  arrayPromesas.push(config.consultar(connection2, query2));

  Promise.all(arrayPromesas)
  .then(value => {
    res.json(value);
  })
  .catch(err => {
    debug('??????????????');
    debug(err);
    res.status(500).json(err);
  });
});


module.exports = router;
