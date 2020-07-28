let express = require('express'),
 debug = require('debug')('BC:ctrNoti'),
 config = require( '../config/general' ),
 notificacion = require( '../models/Notificacion' ),
 mysql = require('mysql'),
 pushsafer = require('../config/config').pushsafer,
 mdAutenticacion = require('../middlewares/autenticacion'),
 router = express.Router();

router.get('/', mdAutenticacion.verificatoken(notificacion.PERMISO.LISTAR), (req, res, next) => {
  debug('---------------****************---------------');
  res.render("notificaciones/lista", { title: 'Notificaciones', usuario:req.session.usuario });
});

router.get('/listar-asistencias',  mdAutenticacion.verificatoken(notificacion.PERMISO.LISTAR), (req, res, next) => {
  let filtro = req.session.usuario.rol != 'Super Admin' && req.session.usuario.rol != 'Admin' ?
    `AND uct.idUsuario = '${req.session.usuario.id}' AND uct.estado = 'Activo'` :
    'AND nt.idUsuarioCreacion = uct.idUsuario';
  let connection = mysql.createConnection(config.connection),
    query = `SELECT
      nt.*,
      us.nombre as usuario,
      CONCAT(CT.codigo, "-", CT.descripcion) as centro,
      CONCAT(op.prefijo, op.op) as op ,
      asi.fechaAsistencia,
      asi.estado as estadoAsistencia,
      usu.nombre as asistente
    FROM usuario_centro_trabajo uct
    INNER JOIN notificacion nt ON (nt.idCentro = uct.idCentro ${filtro})
    INNER JOIN usuario us ON us.id = nt.idUsuarioCreacion
    INNER JOIN homologacion.centro_trabajo AS CT ON CT.id = nt.idCentro
    INNER JOIN pdmsinergia.orden_produccion AS op ON op.id = nt.idOp
    LEFT JOIN asistencia AS asi ON asi.idNotificacion = nt.id
    LEFT JOIN usuario AS usu ON usu.id = asi.idUsuario
    WHERE date(nt.fechaCreacion) >= '${req.query.fechaInicio}' AND date(nt.fechaCreacion) <= '${req.query.fechaFin}' AND uct.idRol = 3
    ORDER BY fechaCreacion DESC`;

  connection.connect();
  let promesa = config.consultar(connection, query);
  promesa.then(value => {
    res.json(value);
  })
  .catch(err => {
    debug(err);
    res.status(500).json(err);
  });
});

router.get('/listar',  mdAutenticacion.verificatoken(notificacion.PERMISO.LISTAR), (req, res, next) => {
  let filtro = req.session.usuario.rol != 'Super Admin' && req.session.usuario.rol != 'Admin' ?
    `AND uct.idUsuario = '${req.session.usuario.id}' AND uct.estado = 'Activo'` :
    'AND nt.idUsuarioCreacion = uct.idUsuario';
  let connection = mysql.createConnection(config.connection),
    query = `SELECT
      nt.*,
      us.nombre as usuario,
      CONCAT(CT.codigo, "-", CT.descripcion) as centro,
      CONCAT(op.prefijo, op.op) as op
    FROM usuario_centro_trabajo uct
    INNER JOIN notificacion nt ON (nt.idCentro = uct.idCentro ${filtro})
    INNER JOIN usuario us ON us.id = nt.idUsuarioCreacion
    INNER JOIN homologacion.centro_trabajo AS CT ON CT.id = nt.idCentro
    INNER JOIN pdmsinergia.orden_produccion AS op ON op.id = nt.idOp
    WHERE date(nt.fechaCreacion) >= '${req.query.fechaInicio}' AND date(nt.fechaCreacion) <= '${req.query.fechaFin}' AND uct.idRol = 3
    ORDER BY fechaCreacion DESC`;

  connection.connect();
  let promesa = config.consultar(connection, query);
  promesa.then(value => {
    res.json(value);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

router.get('/obtener-centros', mdAutenticacion.verificatoken(notificacion.PERMISO.CREAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  let query = `SELECT
      usuario_centro_trabajo.idUsuario,
      usuario_centro_trabajo.idCentro,
      usuario_centro_trabajo.linea,
      CT.codigo, CT.descripcion
    FROM usuario_centro_trabajo
    INNER JOIN homologacion.centro_trabajo AS CT ON CT.id = usuario_centro_trabajo.idCentro
    WHERE usuario_centro_trabajo.idUsuario = ${req.session.usuario.id} AND usuario_centro_trabajo.estado = 'Activo'  AND idRol = 3`
  // let query = `SELECT * FROM usuario_centro_trabajo WHERE idUsuario = ${req.session.usuario.id} AND estado = 'Activo'`
  let promesa = config.consultar(connection, query);
  promesa.then(value => {
    console.log('877974984764564654646');
    console.log(value);
    res.json(value);
  })
  .catch(err => {
    debug(err);
    res.status(500).json(err);
  });
});

router.get('/obtener-asistencias/:id', mdAutenticacion.verificatoken(notificacion.PERMISO.CREAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  let query = `SELECT
              	usuario.nombre,
                  asistencia.id,
                  asistencia.fechaAsistencia,
                  asistencia.estado
              FROM asistencia
              INNER JOIN usuario ON usuario.id = asistencia.idUsuario
              WHERE asistencia.idNotificacion = ${req.params.id}`
  // let query = `SELECT * FROM usuario_centro_trabajo WHERE idUsuario = ${req.session.usuario.id} AND estado = 'Activo'`
  let promesa = config.consultar(connection, query);
  promesa.then(value => {
    res.json(value);
  })
  .catch(err => {
    debug(err);
    res.status(500).json(err);
  });
});

router.get('/obtener-ops', mdAutenticacion.verificatoken(notificacion.PERMISO.CREAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  let query = `SELECT
      id,prefijo,op
    FROM pdmsinergia.orden_produccion
    WHERE lineaProduccion = '${req.query.linea}' AND estado <> 'Entregado' AND estado <> 'Comercial'`
  // let query = `SELECT * FROM usuario_centro_trabajo WHERE idUsuario = ${req.session.usuario.id} AND estado = 'Activo'`
  let promesa = config.consultar(connection, query);
  promesa
  .then(value => {
    res.json(value);
  })
  .catch(err => {
    debug(err);
    res.status(500).json(err);
  });
});

router.get('/formulario', mdAutenticacion.verificatoken(notificacion.PERMISO.CREAR), (req, res, next) => {
  res.render('notificaciones/formulario', { title: 'Notificaciones - Formulario', usuario:req.session.usuario });
});

router.get('/formulario/:id', mdAutenticacion.verificatoken(notificacion.PERMISO.EDITAR), (req, res, next) => {
  res.render('notificaciones/formulario', { title: 'Notificaciones - Formulario', id : req.params.id, usuario:req.session.usuario });
});

router.post('/',  mdAutenticacion.verificatoken(notificacion.PERMISO.CREAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection),
    arrayPromesasNOtificacion = [],

    query = `SELECT uct.idUsuario, u.idAplicacionMovil
      FROM usuario_centro_trabajo uct
      INNER JOIN usuario u ON uct.idUsuario = u.id
      WHERE uct.idCentro = '${req.body.idCentro}' AND uct.estado = 'Activo' AND uct.idRol = 5`;
  connection.connect();
  let promesa = config.consultar(connection, query);
  arrayPromesasNOtificacion.push(promesa)

  let connection2 = mysql.createConnection(config.connection),
    query2 = `INSERT INTO notificacion
     (idUsuarioCreacion,icono,sonido,idOp,idCentro,descripcion)
     values ('${req.session.usuario.id}','${req.body.icono}','${req.body.sonido}','${req.body.idOp}', '${req.body.idCentro}', '${req.body.descripcion}')`;
  connection2.connect();
  let promesa2 = config.consultar(connection2, query2);
  arrayPromesasNOtificacion.push(promesa2)

  Promise.all(arrayPromesasNOtificacion)
  .then(value => {

    // debug('value usuario_centro_trabajo arrayPromesasNOtificacion 55555555555555555');
    // debug(value);

    let arrayPromesas = [];


    let connection = mysql.createConnection(config.connection),
      data = '';
    value[0].forEach((item, i) => {
      data = ` ${data} ( ${item.idUsuario}, ${value[1].insertId},'Pendiente' ),`;
      debug('item safasfasdfasdfasd');
      debug(item);
      var msg = {
          m: `Se solicita en ${req.body.nombreCentro}`,
          t: "Notificación", s: req.body.sonido, v: '3', i: req.body.icono, pr: '2', re: '60',
          d: item.idAplicacionMovil.toString()
      };
      if (req.body.icono == 5) msg.c = '#FF0000';
      debug('msg 123154661*********** ')
      debug(msg)
      arrayPromesas.push(pushsafer.send(msg));
    });
    // if (req.body.icono == 5) msg.c = '#FF0000';
    // debug('msg 123154661*********** ')
    // debug(msg)
    // arrayPromesas.push(pushsafer.send(msg));
    data = data.slice(0, data.length - 1);
    let query = `INSERT INTO asistencia
     (idUsuario,idNotificacion,estado)
     values ${data}`;
    connection.connect();
    let promesa = config.consultar(connection, query);
    arrayPromesas.push(promesa);
    debug('arrayPromesas');
    debug(arrayPromesas);
    // return Promise.all([pushsafer.send(msg1), pushsafer.send(msg)])
    return Promise.all(arrayPromesas)
  })
  .then(value => {
    debug('+++++++++++++++++++++++++++++++++++++++');
    debug(value);
    res.json({data: value});
  })
  .catch(err => {
    debug('¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿');
    debug(err);
    res.status(500).json(err);
  });
});

router.post('/cerrar-notificacion',  mdAutenticacion.verificatoken(notificacion.PERMISO.EDITAR), (req, res, next) => {
  let moment = require('moment');
  let connection = mysql.createConnection(config.connection),
    query = `UPDATE notificacion
     SET causa = '${req.body.causa}', fechaCierre = '${moment().format('YYYY-MM-DD hh:mm:ss')}'
     WHERE id = '${req.body.id}'`;
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

router.get('/marcar-asistencia/:idNotificacion/:idAsistencia',  mdAutenticacion.verificatoken(notificacion.PERMISO.EDITAR), (req, res, next) => {
  let moment = require('moment');
  let query = `UPDATE asistencia SET estado = 'Asistio', fechaAsistencia = '${moment().format('YYYY-MM-DD hh:mm:ss')}' WHERE asistencia.id =  '${req.params.idAsistencia}'`,
    connection = mysql.createConnection(config.connection);
  connection.connect();
  let promesa = config.consultar(connection, query);
  promesa
  .then(value => {
    let connection = mysql.createConnection(config.connection);
    connection.connect();
    let query = `SELECT
                  usuario.nombre,
                    asistencia.id,
                    asistencia.fechaAsistencia,
                    asistencia.estado
                FROM asistencia
                INNER JOIN usuario ON usuario.id = asistencia.idUsuario
                WHERE asistencia.idNotificacion = ${req.params.idNotificacion}`
    // let query = `SELECT * FROM usuario_centro_trabajo WHERE idUsuario = ${req.session.usuario.id} AND estado = 'Activo'`
    let promesa = config.consultar(connection, query);
    return promesa
  })
  .then(value => {
    res.json(value);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

router.get('/eliminar/:id', mdAutenticacion.verificatoken(notificacion.PERMISO.ELIMINAR), (req, res, next) => {
  let query = "UPDATE notificacion SET estado = 'Eliminado' WHERE notificacion.id = " + req.params.id;
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


module.exports = router;
