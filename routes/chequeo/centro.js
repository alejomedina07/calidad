let express = require('express'),
 debug = require('debug')('BC:ctrCentro'),
 config = require( '../../config/general' ),
 centro = require( '../../models/Centro' ),
 mysql = require('mysql'),
 mdAutenticacion = require('../../middlewares/autenticacion'),
 router = express.Router();

router.get('/', mdAutenticacion.verificatoken(centro.PERMISO.LISTAR), (req, res, next) => {
  res.render("chequeo/centro/lista", { title: 'Chequeo - Centro', usuario:req.session.usuario });
});

router.get('/formulario', mdAutenticacion.verificatoken(centro.PERMISO.LISTAR), (req, res, next) => {
  res.render("chequeo/centro/form", { title: 'Chequeo - Centro', usuario:req.session.usuario });
});

router.get('/editar/:id/:idCentro', mdAutenticacion.verificatoken(centro.PERMISO.LISTAR), (req, res, next) => {
  res.render("chequeo/centro/form", { title: 'Operacion - chequeo', usuario:req.session.usuario, id:req.params.id, idCentro:req.params.idCentro });
});

router.get('/indicador-centro/', mdAutenticacion.verificatoken(centro.PERMISO.LISTAR), (req, res, next) => {
  res.render("chequeo/indicadores/indicadorCentro", { title: 'Chequeo - Centro', usuario:req.session.usuario });
});

router.get('/indicador-op', mdAutenticacion.verificatoken(centro.PERMISO.LISTAR), (req, res, next) => {
  res.render("chequeo/indicadores/indicadorOp", { title: 'Chequeo - Centro', usuario:req.session.usuario });
});

router.get('/foto/', mdAutenticacion.verificatoken(centro.PERMISO.LISTAR), (req, res, next) => {
  res.render("fotos/fotos", { title: 'Chequeo - Centro', usuario:req.session.usuario });
});

router.get('/listar',  mdAutenticacion.verificatoken(centro.PERMISO.LISTAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  // usuario_centro_trabajo.id,
  let query = `SELECT co.id, co.idCentro, co.idChasisCarroceria, co.linea, co.fechaCreacion, COUNT(co.id) as operaciones, u.nombre as usuario,
      -- COUNT(d.id) as defectos,
      hct.descripcion as centro, pc.nombre as carroceria, pch.abreviatura as chasis
    FROM centro_operacion co
      -- INNER JOIN centro_defecto d ON d.idChasisCarroceria = co.idChasisCarroceria
    INNER JOIN usuario u ON u.id = co.idUsuarioCreacion
    INNER JOIN homologacion.centro_trabajo hct ON hct.id = co.idCentro
    INNER JOIN chasis_carroceria chaca ON chaca.id = co.idChasisCarroceria
    INNER JOIN pdmsinergia.chasis_carroceria pcc ON chaca.idChasisCarroceria = pcc.id
    INNER JOIN pdmsinergia.carroceria pc ON pcc.idCarroceria = pc.id
    INNER JOIN pdmsinergia.chasis pch ON pcc.idChasis = pch.id
    GROUP BY co.idChasisCarroceria, co.idCentro
    `
  let promesa = config.consultar(connection, query);
  promesa.then(value => {
    res.json(value);
  })
  .catch(err => {
    debug(err);
    debug(err);
    res.status(500).json(err);
  });
});


router.get('/obtener-defectos',  mdAutenticacion.verificatoken(centro.PERMISO.LISTAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  // usuario_centro_trabajo.id,
  let query = `SELECT * FROM defecto`
  let promesa = config.consultar(connection, query);
  promesa.then(value => {
    res.json(value);
  })
  .catch(err => {
    debug(err);
    debug(err);
    res.status(500).json(err);
  });
});

router.get('/carrocerias',  mdAutenticacion.verificatoken(centro.PERMISO.LISTAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  // usuario_centro_trabajo.id,
  let query = `SELECT chaca.*, ca.nombre, ca.id as idCarroceria FROM chasis_carroceria chaca
    INNER JOIN pdmsinergia.chasis_carroceria cc ON cc.id = chaca.idChasisCarroceria
    INNER JOIN pdmsinergia.carroceria ca ON cc.idCarroceria = ca.id
    GROUP BY chaca.idChasisCarroceria`
  let promesa = config.consultar(connection, query);
  promesa.then(value => {
    res.json(value);
  })
  .catch(err => {
    debug(err);
    debug(err);
    res.status(500).json(err);
  });
});

router.get('/chasis/:idCarroceria',  mdAutenticacion.verificatoken(centro.PERMISO.LISTAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  // usuario_centro_trabajo.id,
  let query = `SELECT chaca.*, ca.abreviatura FROM chasis_carroceria chaca
    INNER JOIN pdmsinergia.chasis_carroceria cc ON cc.id = chaca.idChasisCarroceria AND cc.idCarroceria=${req.params.idCarroceria}
    INNER JOIN pdmsinergia.chasis ca ON cc.idChasis = ca.id
    GROUP BY chaca.idChasisCarroceria`
  let promesa = config.consultar(connection, query);
  promesa.then(value => {
    res.json(value);
  })
  .catch(err => {
    debug(err);
    debug(err);
    res.status(500).json(err);
  });
});



router.get('/operaciones/:idChasisCarroceria',  mdAutenticacion.verificatoken(centro.PERMISO.LISTAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  // usuario_centro_trabajo.id,
  let query = `SELECT o.nombre, o.id as idOperacion, c.nombre as categoria FROM chasis_carroceria_operacion cco
    INNER JOIN operacion_chequeo o ON o.id=cco.idOperacion
    INNER JOIN categoria c ON o.idCategoria=c.id
    WHERE cco.estado = 'Activo' AND idChasisCarroceria= ${req.params.idChasisCarroceria}`
  let promesa = config.consultar(connection, query);
  promesa.then(value => {
    res.json(value);
  })
  .catch(err => {
    debug(err);
    debug(err);
    res.status(500).json(err);
  });
});

router.post('/',  mdAutenticacion.verificatoken(centro.PERMISO.CREAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection),
    data = '', arrayPromesas = [];
  req.body.defectos.forEach((item, i) => {
    data = ` ${data} ( ${item}, ${req.body.idCentro}, ${req.body.idChasisCarroceria},'Activo',${req.session.usuario.id}),`
  });

  data = data.slice(0, data.length - 1);
  let query = `INSERT INTO centro_defecto (idDefecto, idCentro, idChasisCarroceria, estado, idUsuarioCreacion)
  values ${data}`;
  connection.connect();
  arrayPromesas.push(config.consultar(connection, query));

  let connection2 = mysql.createConnection(config.connection), data2 = '';
  req.body.operaciones.forEach((item, i) => {
    data2 = ` ${data2} ( ${req.body.idCentro}, ${item}, ${req.body.idChasisCarroceria},'Activo', ${i}, '${req.body.linea}', ${req.session.usuario.id}),`
  });
  data2 = data2.slice(0, data2.length - 1);
  let query2 = `INSERT INTO centro_operacion (idCentro, idOperacion, idChasisCarroceria, estado, orden, linea, idUsuarioCreacion)
  values ${data2}`;
  connection2.connect();
  arrayPromesas.push(config.consultar(connection2, query2));

  debug('data2');
  debug(data2);


  debug(666666666666666666666666666666666666666666);
  Promise.all(arrayPromesas)
  .then(value => {
    res.json({data: value});
  })
  .catch(err => {
    debug('err 9999888888888888');
    debug(err);
    res.status(500).json(err);
  });
});

router.post('/editar',  mdAutenticacion.verificatoken(centro.PERMISO.EDITAR), (req, res, next) => {

  let connection = mysql.createConnection(config.connection), arrayPromesas = [];

  let query = `UPDATE centro_defecto SET estado='Inactivo' WHERE idChasisCarroceria = ${req.body.idChasisCarroceria} AND idCentro = ${req.body.idCentro} `;
  connection.connect();
  arrayPromesas.push(config.consultar(connection, query));

  let connection2 = mysql.createConnection(config.connection);
  let query2 = `UPDATE centro_operacion SET estado='Inactivo' WHERE idChasisCarroceria = ${req.body.idChasisCarroceria} AND idCentro = ${req.body.idCentro}`;
  connection2.connect();
  arrayPromesas.push(config.consultar(connection2, query2));


  Promise.all(arrayPromesas)
  .then(value => {
    let connection = mysql.createConnection(config.connection),
      data = '', arrayPromesas2 = [];
    req.body.defectos.forEach((item, i) => {
      data = ` ${data} ( ${item}, ${req.body.idCentro}, ${req.body.idChasisCarroceria},'Activo',${req.session.usuario.id}),`
    });

    data = data.slice(0, data.length - 1);
    let query = `INSERT INTO centro_defecto (idDefecto, idCentro, idChasisCarroceria, estado, idUsuarioCreacion)
    values ${data} ON DUPLICATE KEY update estado='Activo'`;
    connection.connect();
    arrayPromesas2.push(config.consultar(connection, query));

    let connection2 = mysql.createConnection(config.connection), data2 = '';
    req.body.operaciones.forEach((item, i) => {
      data2 = ` ${data2} ( ${req.body.idCentro}, ${item}, ${req.body.idChasisCarroceria},'Activo', ${i}, '${req.body.linea}', ${req.session.usuario.id}),`
    });
    data2 = data2.slice(0, data2.length - 1);
    // let query2 = `INSERT INTO centro_operacion (idCentro, idOperacion, idChasisCarroceria, estado, orden, linea, idUsuarioCreacion)
    // values ${data2} ON DUPLICATE KEY update estado='Activo'`;

    let query2 = `INSERT INTO centro_operacion (idCentro, idOperacion, idChasisCarroceria, estado, orden, linea, idUsuarioCreacion)
    values ${data2} ON DUPLICATE KEY update estado='Activo', orden=values(orden)`;
    connection2.connect();
    arrayPromesas2.push(config.consultar(connection2, query2));

    debug(666666666666666666666666666666666666666666);
    debug(query2);
    return Promise.all(arrayPromesas2);
  })
  .then(value => {
    res.json({data: value});
  })
  .catch(err => {
    debug('??????????????');
    debug(err);
    res.status(500).json(err);
  });
});

router.get('/obtener/:id/:idCentro',  mdAutenticacion.verificatoken(centro.PERMISO.EDITAR), (req, res, next) => {
  // usuario_centro_trabajo.id,
  let query = `SELECT d.idDefecto FROM centro_defecto d WHERE d.idChasisCarroceria = ${req.params.id} AND d.idCentro = ${req.params.idCentro} AND estado = 'Activo'` ,
    connection = mysql.createConnection(config.connection), arrayPromesas = [];
  connection.connect();
  arrayPromesas.push(config.consultar(connection, query));

  let query2 = `SELECT co.*,
      pcc.idCarroceria as carroceria
    FROM centro_operacion co
    INNER JOIN chasis_carroceria chaca ON chaca.id = co.idChasisCarroceria
    INNER JOIN pdmsinergia.chasis_carroceria pcc ON pcc.id = chaca.idChasisCarroceria
    WHERE co.idChasisCarroceria = ${req.params.id} AND co.idCentro = ${req.params.idCentro} AND co.estado = 'Activo'
    GROUP BY co.idChasisCarroceria` ,
    connection2 = mysql.createConnection(config.connection);
  connection2.connect();
  arrayPromesas.push(config.consultar(connection2, query2));

  let query3 = `SELECT
      c.nombre as categoria,
      co.idOperacion,
      op.nombre
    FROM centro_operacion co
    INNER JOIN operacion_chequeo op ON op.id = co.idOperacion
    INNER JOIN categoria c ON op.idCategoria = c.id
    WHERE co.idChasisCarroceria = ${req.params.id} AND co.idCentro = ${req.params.idCentro} AND co.estado = 'Activo'
    ORDER BY orden ASC` ,
    connection3 = mysql.createConnection(config.connection);
  connection3.connect();
  arrayPromesas.push(config.consultar(connection3, query3));


  Promise.all(arrayPromesas)
  .then(value => {
    if (value && value.length) res.json(value);
  })
  .catch(err => {
    debug('¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿');
    debug(err);
    res.status(500).json(err);
  });
});

module.exports = router;
