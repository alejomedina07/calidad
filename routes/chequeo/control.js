let express = require('express'),
 debug = require('debug')('BC:ctrControl'),
 config = require( '../../config/general' ),
 chequeo = require( '../../models/Chequeo' ),
 mysql = require('mysql'),
 mdAutenticacion = require('../../middlewares/autenticacion'),
 router = express.Router();

router.get('/', mdAutenticacion.verificatoken(chequeo.PERMISO.CONTROL.LISTAR), (req, res, next) => {
  debug(8923984293);
  res.render("chequeo/control/lista", { title: 'Categorías', usuario:req.session.usuario });
});

router.get('/formulario', mdAutenticacion.verificatoken(chequeo.PERMISO.CONTROL.CREAR), (req, res, next) => {
  res.render("chequeo/control/form", { title: 'Categorías', usuario:req.session.usuario });
});

router.get('/editar/:id', mdAutenticacion.verificatoken(chequeo.PERMISO.CONTROL.CREAR), (req, res, next) => {
  res.render("chequeo/control/form", { title: 'Categorías', usuario:req.session.usuario, id:req.params.id });
});

router.get('/obtener-registro/:id',  mdAutenticacion.verificatoken(chequeo.PERMISO.CONTROL.CREAR), (req, res, next) => {
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

router.get('/listar',  mdAutenticacion.verificatoken(chequeo.PERMISO.CONTROL.LISTAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  // usuario_centro_trabajo.id,
  let query = `SELECT che.*, ct.descripcion as centro, pdmc.nombre as carroceria,
        pdmch.abreviatura as chasis, u.nombre as usuario, CONCAT(op.prefijo, op.op) as nombre_op, usu.nombre as auditor
      FROM chequeo che
      INNER JOIN homologacion.centro_trabajo ct ON ct.id = che.idCentro
      INNER JOIN chasis_carroceria cc ON cc.id=che.idChasisCarroceria
      INNER JOIN pdmsinergia.chasis_carroceria chaca ON cc.idChasisCarroceria=chaca.id
      INNER JOIN pdmsinergia.carroceria pdmc ON pdmc.id=chaca.idCarroceria
      INNER JOIN pdmsinergia.orden_produccion op ON op.id=che.idOp
      INNER JOIN usuario u ON u.id = che.idUsuarioCreacion
      LEFT JOIN usuario usu ON usu.id = che.idUsuarioCierra
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

router.get('/obtener-ops/linea',  mdAutenticacion.verificatoken(chequeo.PERMISO.CONTROL.LISTAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  // usuario_centro_trabajo.id,
  let query = `SELECT prefijo, op, id FROM pdmsinergia.orden_produccion WHERE estado <> 'comercial'`;
  let promesa = config.consultar(connection, query);
  promesa.then(value => {
    res.json(value);
  })
  .catch(err => {
    debug(err);
    res.status(500).json(err);
  });
});

router.get('/chasis/:idCarroceria',  mdAutenticacion.verificatoken(chequeo.PERMISO.CONTROL.CREAR), (req, res, next) => {
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

router.post('/',  mdAutenticacion.verificatoken(chequeo.PERMISO.CONTROL.CREAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  let query = `INSERT INTO chequeo ( idCentro, idCarroceria, idChasisCarroceria, idOp, idUsuarioCreacion)
   values (${req.body.idCentro},${req.body.idCarroceria}, ${req.body.idChasisCarroceria}, ${req.body.op}, ${req.session.usuario.id})`;
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

router.post('/defecto',  mdAutenticacion.verificatoken(chequeo.PERMISO.CONTROL.CREAR), (req, res, next) => {
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

router.post('/defecto/cerrar',  mdAutenticacion.verificatoken(chequeo.PERMISO.CONTROL.CREAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection), arrayIds = req.body.arrayDefectos.join(","),
    moment = require('moment');
  let date = moment().format('YYYY-MM-DD h:mm:ss');
  let query = `UPDATE chequeo_operacion_defecto
    SET estado='Cerrado', idUsuarioCierra=${req.session.usuario.id}, fechaCierre='${date}'
    WHERE idDefecto in (${arrayIds}) AND idOperacion = ${req.body.idOperacion} AND idChequeo = ${req.body.id}`;
  connection.connect();
  let promesa = config.consultar(connection, query);
  debug('query');
  debug(query);
  promesa.then(value => {
    let connection2 = mysql.createConnection(config.connection);
    let query = `SELECT * FROM chequeo_operacion_defecto
      WHERE idChequeo = ${req.body.id} AND estado='Activo'`;
    connection2.connect();
    let promesa2 = config.consultar(connection2, query);
    debug('query');
    debug(query);
    return promesa2
    // res.json(value);
  })
  .then(value => {
    if (value.length) {
      debug('if 1111111111111');
      res.json(value);
    }else {
      debug(2);
      let connection3 = mysql.createConnection(config.connection);
      let query = `UPDATE chequeo SET estado='Finalizado', idUsuarioCierra=${req.session.usuario.id}
        WHERE id = ${req.body.id}`;
      connection3.connect();
      let promesa3 = config.consultar(connection3, query);
      debug('query');
      debug(query);
      return promesa3
    }
  })
  .then(value => {
    debug('value');
    debug(value);
    res.json(value);
  })
  .catch(err => {
    debug('err');
    debug(err);
    res.status(500).json(err);
  });
});

router.post('/editar',  mdAutenticacion.verificatoken(chequeo.PERMISO.CONTROL.EDITAR), (req, res, next) => {
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

router.get('/obtener-centros', mdAutenticacion.verificatoken(chequeo.PERMISO.CONTROL.CREAR), (req, res, next) => {
  let query;
  if (req.query.codigo) {
    // query = `SELECT co.idCentro, ct.codigo, ct.descripcion as nombre
    //   FROM centro_operacion co
    //   INNER JOIN homologacion.centro_trabajo ct ON ct.id = co.idCentro
    //   WHERE co.linea = '${req.query.codigo}'
    //   GROUP BY idCentro `;
      query = `SELECT co.idCentro, ct.codigo, ct.descripcion as nombre
        FROM centro_operacion co
        INNER JOIN homologacion.centro_trabajo ct ON ct.id = co.idCentro
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

router.get('/obtener-ops', mdAutenticacion.verificatoken(chequeo.PERMISO.CONTROL.CREAR), (req, res, next) => {
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

router.get('/obtener-grafica', mdAutenticacion.verificatoken(chequeo.PERMISO.CENTRO.LISTAR), (req, res, next) => {
  let query, arrayPromesas=[];
  if (req.query.centro) {

    query = `SELECT o.id, o.nombre, COUNT(cod.idDefecto) as defectos
        FROM chequeo ch
        INNER JOIN chequeo_operacion_defecto cod ON cod.idChequeo = ch.id
        INNER JOIN operacion_chequeo o ON cod.idOperacion = o.id
        WHERE idCentro = ${req.query.centro} AND Date(cod.fechaCreacion) BETWEEN '${req.query.fechaInicio}' AND '${req.query.fechaFin}'
        GROUP BY cod.idOperacion`;
  }else {
    query = `SELECT o.id, o.nombre, COUNT(cod.idDefecto) as defectos
        FROM chequeo ch
        INNER JOIN chequeo_operacion_defecto cod ON cod.idChequeo = ch.id
        INNER JOIN operacion_chequeo o ON cod.idOperacion = o.id
        WHERE idOp = ${req.query.op} AND Date(cod.fechaCreacion) BETWEEN '${req.query.fechaInicio}' AND '${req.query.fechaFin}'
        GROUP BY cod.idOperacion`;
  }
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  let promesa = config.consultar(connection, query);
  arrayPromesas.push(promesa)

  if (req.query.centro) {
    let connection2 = mysql.createConnection(config.connection);
      let query2 = `SELECT week(cod.fechaCreacion) AS semana, COUNT(*)  AS defectos FROM chequeo che
      INNER JOIN chequeo_operacion_defecto cod ON cod.idChequeo=che.id
      WHERE che.idCentro=${req.query.centro} AND DATE(cod.fechaCreacion) BETWEEN '${req.query.fechaInicio}' AND '${req.query.fechaFin}'
      GROUP BY week(cod.fechaCreacion)`;
    connection2.connect();
    let promesa2 = config.consultar(connection2, query2);
    arrayPromesas.push(promesa2);

    let connection3 = mysql.createConnection(config.connection);
      let query3 = `SELECT week(fechaCreacion) AS semana, COUNT(DISTINCT(idOp)) as vehiculos FROM chequeo
        WHERE idCentro=${req.query.centro} AND Date(fechaCreacion) BETWEEN '${req.query.fechaInicio}' AND '${req.query.fechaFin}'
        GROUP BY week(fechaCreacion)`;
    connection3.connect();
    let promesa3 = config.consultar(connection3, query3);
    arrayPromesas.push(promesa3);

    let connection4 = mysql.createConnection(config.connection);
      let query4 = `SELECT COUNT(DISTINCT(idOp)) as vehiculos FROM chequeo WHERE idCentro=${req.query.centro} AND Date(fechaCreacion) BETWEEN '${req.query.fechaInicio}' AND '${req.query.fechaFin}'`;
    connection4.connect();
    let promesa4 = config.consultar(connection4, query4);
    arrayPromesas.push(promesa4);

    let connection5 = mysql.createConnection(config.connection);
      let query5 = `SELECT COUNT(*) AS defectos FROM chequeo che
        INNER JOIN chequeo_operacion_defecto cod ON cod.idChequeo=che.id
        WHERE idCentro=${req.query.centro} AND Date(cod.fechaCreacion) BETWEEN '${req.query.fechaInicio}' AND '${req.query.fechaFin}'`;
    connection5.connect();
    let promesa5 = config.consultar(connection5, query5);
    arrayPromesas.push(promesa5);

  }


  Promise.all(arrayPromesas).then(value => {
    res.json(value);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

router.get('/obtener-grafica-defectos/:idOperacion', mdAutenticacion.verificatoken(chequeo.PERMISO.CENTRO.LISTAR), (req, res, next) => {
  let query;
  if (req.query.centro) {

    query = `SELECT ch.*, d.nombre, COUNT(d.id) AS defectos
      FROM chequeo ch
      INNER JOIN chequeo_operacion_defecto cod ON cod.idChequeo=ch.id AND cod.idOperacion=${req.params.idOperacion} AND Date(cod.fechaCreacion) BETWEEN '${req.query.fechaInicio}' AND '${req.query.fechaFin}'
      INNER JOIN defecto d ON d.id=cod.idDefecto
      WHERE ch.idCentro = ${req.query.centro}
      GROUP BY cod.idDefecto`;
  }else {
    query = `SELECT ch.*, d.nombre, COUNT(d.id) AS defectos
      FROM chequeo ch
      INNER JOIN chequeo_operacion_defecto cod ON cod.idChequeo=ch.id AND cod.idOperacion=${req.params.idOperacion} AND Date(cod.fechaCreacion) BETWEEN '${req.query.fechaInicio}' AND '${req.query.fechaFin}'
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

router.get('/obtener-carrocerias', mdAutenticacion.verificatoken(chequeo.PERMISO.CONTROL.LISTAR), (req, res, next) => {
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

router.get('/finalizar/:id', mdAutenticacion.verificatoken(chequeo.PERMISO.CONTROL.CREAR), (req, res, next) => {
  let query = `UPDATE chequeo SET estado="En progreso", observacion='${req.query.observacion}' WHERE id = ${req.params.id} `;
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

router.get('/operaciones/:idChasisCarroceria/:idCentro',  mdAutenticacion.verificatoken(chequeo.PERMISO.CONTROL.LISTAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
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

router.get('/operaciones-pdf/:idChequeo',  mdAutenticacion.verificatoken(chequeo.PERMISO.CONTROL.LISTAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  let query = `SELECT cod.* ,GROUP_CONCAT(" ", d.nombre) as defectos ,o.nombre as operacion, c.nombre as categoria
    FROM chequeo_operacion_defecto cod
    INNER JOIN defecto d ON d.id=cod.idDefecto
    INNER JOIN operacion_chequeo o ON o.id=cod.idOperacion
    INNER JOIN categoria c ON c.id=o.idCategoria
    WHERE cod.idChequeo=${req.params.idChequeo} AND cod.estado <> 'Inactivo'
    GROUP BY cod.idOperacion
    ORDER BY categoria`
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

router.get('/obtener-defectos/:idChasisCarroceria/:idCentro',  mdAutenticacion.verificatoken(chequeo.PERMISO.CONTROL.LISTAR), (req, res, next) => {
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
