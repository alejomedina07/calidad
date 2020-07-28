let express = require('express'),
 debug = require('debug')('BC:ctrCategoria'),
 config = require( '../../config/general' ),
 centro = require( '../../models/Centro' ),
 mysql = require('mysql'),
 mdAutenticacion = require('../../middlewares/autenticacion'),
 router = express.Router();

router.get('/', mdAutenticacion.verificatoken(centro.PERMISO.LISTAR), (req, res, next) => {
  res.render("chequeo/control/lista", { title: 'Categorías', usuario:req.session.usuario });
});

router.get('/formulario', mdAutenticacion.verificatoken(centro.PERMISO.LISTAR), (req, res, next) => {
  res.render("chequeo/control/form", { title: 'Categorías', usuario:req.session.usuario });
});

router.get('/editar/:id', mdAutenticacion.verificatoken(centro.PERMISO.LISTAR), (req, res, next) => {
  res.render("chequeo/control/form", { title: 'Categorías', usuario:req.session.usuario, id:req.params.id });
});


router.get('/obtener-registro/:id',  mdAutenticacion.verificatoken(centro.PERMISO.LISTAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  // usuario_centro_trabajo.id,
  let query = `SELECT ch.* , c.descripcion as centro, CONCAT(op.prefijo, "-", op.op) as nombre_op, op.op, pdmc.nombre as carroceria , pdmch.abreviatura as chasis
    FROM chequeo ch
    INNER JOIN homologacion.centro_trabajo c ON c.id=ch.idCentro
    INNER JOIN chasis_carroceria cc ON cc.id=ch.idChasisCarroceria
    INNER JOIN pdmsinergia.chasis_carroceria chaca ON cc.idChasisCarroceria=chaca.id
    INNER JOIN pdmsinergia.carroceria pdmc ON pdmc.id=chaca.idCarroceria
    INNER JOIN pdmsinergia.chasis pdmch ON pdmch.id=chaca.idChasis
    INNER JOIN pdmsinergia.orden_produccion op ON op.id = ch.idOp
    WHERE ch.id=${req.params.id}`;
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


router.get('/listar',  mdAutenticacion.verificatoken(centro.PERMISO.LISTAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  // usuario_centro_trabajo.id,
  let query = `SELECT che.*, ct.descripcion as centro, pdmc.nombre as carroceria, pdmch.abreviatura as chasis
      FROM chequeo che
      INNER JOIN homologacion.centro_trabajo ct ON ct.id = che.idCentro
      INNER JOIN chasis_carroceria cc ON cc.id=che.idChasisCarroceria
      INNER JOIN pdmsinergia.chasis_carroceria chaca ON cc.idChasisCarroceria=chaca.id
      INNER JOIN pdmsinergia.carroceria pdmc ON pdmc.id=chaca.idCarroceria
      INNER JOIN pdmsinergia.chasis pdmch ON pdmch.id=chaca.idChasis`
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


router.get('/obtener-ops/:linea',  mdAutenticacion.verificatoken(centro.PERMISO.LISTAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  // usuario_centro_trabajo.id,
  let query = `SELECT prefijo, op, id FROM pdmsinergia.orden_produccion WHERE estado <> 'comercial' AND lineaProduccion = '${req.params.linea}'`;
  let promesa = config.consultar(connection, query);
  promesa.then(value => {
    res.json(value);
  })
  .catch(err => {
    debug(err);
    res.status(500).json(err);
  });
});

router.post('/',  mdAutenticacion.verificatoken(centro.PERMISO.CREAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  let query = `INSERT INTO chequeo (linea, idCentro, idCarroceria, idChasisCarroceria, idOp, idUsuarioCreacion)
   values ('${req.body.linea}',${req.body.idCentro},${req.body.idCarroceria}, ${req.body.idChasisCarroceria}, ${req.body.op}, ${req.session.usuario.id})`;
  connection.connect();
  let promesa = config.consultar(connection, query);
  debug(666666666666666666666666666666666666666666);
  promesa
  .then(value => {
    res.json(value.insertId);
  })
  .catch(err => {
    debug('err');
    debug(err);
    res.status(500).json(err);
  });
});


router.post('/defecto',  mdAutenticacion.verificatoken(centro.PERMISO.CREAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  let query = `UPDATE chequeo_operacion_defecto SET estado='Inactivo' WHERE estado = 'Activo' AND idOperacion = ${req.body.idOperacion} AND idChequeo = ${req.body.id}`;
  connection.connect();
  let promesa = config.consultar(connection, query);
  promesa
  .then(value => {
    if (req.body.arrayDefectos &&  req.body.arrayDefectos.length) {
      let connection2 = mysql.createConnection(config.connection), data = '';
      req.body.arrayDefectos.forEach((item, i) => {
        data = ` ${data} ( ${req.body.id}, ${req.body.idOperacion}, ${item}, 'Activo', ${req.session.usuario.id} ),`;
      });
      data = data.slice(0, data.length - 1);
      debug('data 22222222222222222222222');
      debug(data);
      let query2 = `INSERT INTO chequeo_operacion_defecto (idChequeo, idOperacion, idDefecto, estado, idUsuarioCreacion)
      values ${data} ON DUPLICATE KEY update estado='Activo'`;
      connection2.connect();
      let promesa = config.consultar(connection2, query2);
      promesa
    }else
      return value;
  })
  .then(value => {
    res.json(value);
  })
  .catch(err => {
    debug('err');
    debug(err);
    res.status(500).json(err);
  });
});


router.post('/editar',  mdAutenticacion.verificatoken(centro.PERMISO.EDITAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection),
    query = `UPDATE usuario_centro_trabajo
      SET estado = 'Inactivo' WHERE idCentro = '${req.body.idCentro}'`;
  connection.connect();
  let promesa = config.consultar(connection, query);
  promesa
  .then(value => {
    let connection = mysql.createConnection(config.connection),
      data = '';
    req.body.usuarios.forEach((item, i) => {
      data = ` ${data} ( '${req.body.idCentro}','${item}','${req.body.idRolUsuarios}','${req.body.linea}'),`
    });
    req.body.auditores.forEach((item, i) => {
      data = ` ${data} ( '${req.body.idCentro}','${item}','${req.body.idRolAuditor}','${req.body.linea}'),`
    });
    data = data.slice(0, data.length - 1);
    let query = `INSERT INTO usuario_centro_trabajo (idCentro, idUsuario, idRol, linea)
     values ${data} ON DUPLICATE KEY update estado='Activo'`;
    connection.connect();
    let promesa = config.consultar(connection, query);

    debug(666666666666666666666666666666666666666666);
    promesa
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

// router.get('/obtener/:id',  mdAutenticacion.verificatoken(centro.PERMISO.EDITAR), (req, res, next) => {
//   // usuario_centro_trabajo.id,
//   let query = `SELECT
//         GROUP_CONCAT( CASE  WHEN usuario_centro_trabajo.idRol = 3 AND usuario_centro_trabajo.estado = 'Activo' THEN usuario.id END ) as idAuditores,
//         GROUP_CONCAT( CASE  WHEN usuario_centro_trabajo.idRol = 5 AND usuario_centro_trabajo.estado = 'Activo' THEN usuario.id END ) as idUsuarios,
//         CT.codigo, CT.descripcion,
//         usuario_centro_trabajo.idCentro,
//         usuario_centro_trabajo.linea
//       FROM usuario_centro_trabajo
//       INNER JOIN homologacion.centro_trabajo AS CT ON CT.id = usuario_centro_trabajo.idCentro
//       LEFT JOIN usuario ON usuario.id = usuario_centro_trabajo.idUsuario WHERE usuario_centro_trabajo.idCentro = ${req.params.id} GROUP BY usuario_centro_trabajo.idCentro` ,
//     connection = mysql.createConnection(config.connection);
//   connection.connect();
//   let promesa = config.consultar(connection, query);
//   promesa.then(value => {
//     if (value && value.length) res.json(value);
//   })
//   .catch(err => {
//     debug('¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿');
//     debug(err);
//     res.status(500).json(err);
//   });
// });

router.get('/obtener-centros', mdAutenticacion.verificatoken(centro.PERMISO.ELIMINAR), (req, res, next) => {
  let query;
  if (req.query.codigo) {
    query = `SELECT co.idCentro, ct.codigo, ct.descripcion as nombre
      FROM centro_operacion co
      INNER JOIN homologacion.centro_trabajo ct ON ct.id = co.idCentro
      WHERE co.linea = '${req.query.codigo}'
      GROUP BY idCentro `;
  }else {
    query = `SELECT ch.*, c.descripcion
      FROM chequeo ch
      INNER JOIN homologacion.centro_trabajo c ON c.id = ch.idCentro
      GROUP BY ch.idCentro`;
  }

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



router.get('/obtener-ops', mdAutenticacion.verificatoken(centro.PERMISO.ELIMINAR), (req, res, next) => {
  let query = `SELECT ch.*, op.prefijo, op.op
    FROM chequeo ch
    INNER JOIN pdmsinergia.orden_produccion op ON op.id = ch.idOp
    GROUP BY ch.idOp`;

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


router.get('/obtener-grafica', mdAutenticacion.verificatoken(centro.PERMISO.ELIMINAR), (req, res, next) => {
  let query;
  if (req.query.centro) {


    query = `SELECT o.id, o.nombre, COUNT(cod.idDefecto) as defectos
        FROM chequeo ch
        INNER JOIN chequeo_operacion_defecto cod ON cod.idChequeo = ch.id
        INNER JOIN operacion_chequeo o ON cod.idOperacion = o.id
        WHERE idCentro = ${req.query.centro} AND cod.fechaCreacion BETWEEN '${req.query.fechaInicio}' AND '${req.query.fechaFin}'
        GROUP BY cod.idOperacion`;
  }else {
    query = `SELECT o.id, o.nombre, COUNT(cod.idDefecto) as defectos
        FROM chequeo ch
        INNER JOIN chequeo_operacion_defecto cod ON cod.idChequeo = ch.id
        INNER JOIN operacion_chequeo o ON cod.idOperacion = o.id
        WHERE idOp = ${req.query.op} AND cod.fechaCreacion BETWEEN '${req.query.fechaInicio}' AND '${req.query.fechaFin}'
        GROUP BY cod.idOperacion`;
  }

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



router.get('/obtener-grafica-defectos/:idOperacion', mdAutenticacion.verificatoken(centro.PERMISO.ELIMINAR), (req, res, next) => {
  let query;
  if (req.query.centro) {

    query = `SELECT ch.*, d.nombre, COUNT(d.id) AS defectos
      FROM chequeo ch
      INNER JOIN chequeo_operacion_defecto cod ON cod.idChequeo=ch.id AND cod.idOperacion=${req.params.idOperacion} AND cod.fechaCreacion BETWEEN '${req.query.fechaInicio}' AND '${req.query.fechaFin}'
      INNER JOIN defecto d ON d.id=cod.idDefecto
      WHERE ch.idCentro = ${req.query.centro}
      GROUP BY cod.idDefecto`;
  }else {
    query = `SELECT ch.*, d.nombre, COUNT(d.id) AS defectos
      FROM chequeo ch
      INNER JOIN chequeo_operacion_defecto cod ON cod.idChequeo=ch.id AND cod.idOperacion=${req.params.idOperacion} AND cod.fechaCreacion BETWEEN '${req.query.fechaInicio}' AND '${req.query.fechaFin}'
      INNER JOIN defecto d ON d.id=cod.idDefecto
      WHERE ch.idOp = ${req.query.op} 
      GROUP BY cod.idDefecto`;
  }

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

router.get('/obtener-carrocerias', mdAutenticacion.verificatoken(centro.PERMISO.ELIMINAR), (req, res, next) => {
  let query = `SELECT co.idChasisCarroceria, ca.id, ca.nombre
    FROM centro_operacion co
    INNER JOIN chasis_carroceria chaca ON chaca.id = co.idChasisCarroceria
    INNER JOIN pdmsinergia.chasis_carroceria cc ON cc.id = chaca.idChasisCarroceria
    INNER JOIN pdmsinergia.carroceria ca ON ca.id = cc.idCarroceria
    WHERE co.idCentro = ${req.query.idCentro}
    GROUP BY idChasisCarroceria`;
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


router.get('/finalizar/:id', mdAutenticacion.verificatoken(centro.PERMISO.ELIMINAR), (req, res, next) => {
  let query = `UPDATE chequeo SET estado="Finalizado" WHERE id = ${req.params.id} `;
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


router.get('/operaciones/:idChasisCarroceria/:idCentro',  mdAutenticacion.verificatoken(centro.PERMISO.LISTAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  // usuario_centro_trabajo.id,
  // let query = `SELECT o.nombre, o.id as idOperacion, c.nombre as categoria
  //   FROM centro_operacion cco
  //   INNER JOIN operacion_chequeo o ON o.id=cco.idOperacion
  //   INNER JOIN categoria c ON o.idCategoria=c.id
  //   WHERE cco.estado = 'Activo' AND cco.idChasisCarroceria = ${req.params.idChasisCarroceria} AND cco.idCentro = ${req.params.idCentro}
  //   ORDER BY cco.orden`;
  let query = `SELECT o.nombre, o.id as idOperacion, c.nombre as categoria
   	,GROUP_CONCAT(cod.idDefecto) as defectos
      FROM centro_operacion cco
      LEFT JOIN operacion_chequeo o ON o.id=cco.idOperacion AND o.estado = 'Activo'
      LEFT JOIN chequeo_operacion_defecto cod ON cod.idChequeo = ${req.query.id} AND cco.idOperacion = cod.idOperacion AND cod.estado = 'Activo'
      LEFT JOIN categoria c ON o.idCategoria=c.id
      WHERE cco.estado = 'Activo' AND cco.idChasisCarroceria = ${req.params.idChasisCarroceria} AND cco.idCentro = ${req.params.idCentro}
      GROUP BY cco.idOperacion
      ORDER BY cco.orden`
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



router.get('/obtener-defectos/:idChasisCarroceria/:idCentro',  mdAutenticacion.verificatoken(centro.PERMISO.LISTAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  // usuario_centro_trabajo.id,
  let query = `SELECT d.nombre, d.id as idDefecto
    FROM centro_defecto cd
    INNER JOIN defecto d ON d.id=cd.idDefecto
    WHERE cd.estado = 'Activo' AND cd.idChasisCarroceria = ${req.params.idChasisCarroceria} AND cd.idCentro = ${req.params.idCentro}`
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


module.exports = router;
