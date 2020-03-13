let express = require('express'),
 debug = require('debug')('BC:ctrCentro'),
 config = require( '../config/general' ),
 centro = require( '../models/Centro' ),
 mysql = require('mysql'),
 mdAutenticacion = require('../middlewares/autenticacion'),
 router = express.Router();

router.get('/', mdAutenticacion.verificatoken(centro.PERMISO.LISTAR), (req, res, next) => {
  res.render("centros/lista", { title: 'Centros', usuario:req.session.usuario });
});

router.get('/listar',  mdAutenticacion.verificatoken(centro.PERMISO.LISTAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  // usuario_centro_trabajo.id,
  let query = `SELECT
        GROUP_CONCAT( CASE  WHEN usuario_centro_trabajo.idRol = 3 AND usuario_centro_trabajo.estado = 'Activo' THEN usuario.id END ) as idAuditores,
        GROUP_CONCAT( CASE  WHEN usuario_centro_trabajo.idRol = 5 AND usuario_centro_trabajo.estado = 'Activo' THEN usuario.id END ) as idUsuarios,
        CT.codigo, CT.descripcion,
        usuario_centro_trabajo.idCentro,
        usuario_centro_trabajo.linea,
        CT.estado
      FROM usuario_centro_trabajo
      INNER JOIN homologacion.centro_trabajo AS CT ON CT.id = usuario_centro_trabajo.idCentro
      LEFT JOIN usuario ON usuario.id = usuario_centro_trabajo.idUsuario
      GROUP BY usuario_centro_trabajo.idCentro`
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

router.get('/obtener-ops', mdAutenticacion.verificatoken(centro.PERMISO.CREAR), (req, res, next) => {
  // let  con = config.connection;
  // con.database = 'homologacion';
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  let promesa = config.consultar(connection, `SELECT * FROM homologacion.centro_trabajo WHERE codigo like '${req.query.codigo}%' OR descripcion like '%ALISTAMIENTO%' OR descripcion like '%LIBERACION%' OR descripcion like '%pintura%'` );
  promesa.then(value => {
    res.json(value);
  })
  .catch(err => {
    debug('err *------------');
    debug(err);
    res.status(500).json(err);
  });
});

router.get('/formulario', mdAutenticacion.verificatoken(centro.PERMISO.CREAR), (req, res, next) => {
  res.render('centros/formulario', { title: 'Centros - Formulario', usuario:req.session.usuario });
});

router.get('/formulario/:id', mdAutenticacion.verificatoken(centro.PERMISO.EDITAR), (req, res, next) => {
  res.render('centros/formulario', { title: 'Centros - Formulario', id : req.params.id, usuario:req.session.usuario });
});

router.get('/obtener-usuarios',  mdAutenticacion.verificatoken(centro.PERMISO.CREAR), (req, res, next) => {
  let connection = mysql.createConnection(config.connection),
    query = `SELECT usuario.id, usuario.nombre, rol.id as idRol
      FROM usuario
      INNER JOIN usuario_rol on usuario.id = usuario_rol.idUsuario
      INNER JOIN rol on rol.id = usuario_rol.idRol
      WHERE rol.id = 3`;
  connection.connect();
  let promesaAuditores = config.consultar(connection, query);
  let connection2 = mysql.createConnection(config.connection),
    query2 = `SELECT usuario.id, usuario.nombre, rol.id as idRol
      FROM usuario
      INNER JOIN usuario_rol on usuario.id = usuario_rol.idUsuario
      INNER JOIN rol on rol.id = usuario_rol.idRol
      WHERE rol.id = 5`;
  let promesaUsuarios = config.consultar(connection2, query2);
  Promise.all([promesaAuditores, promesaUsuarios])
  .then(value => {
    res.json({auditores: value[0], usuarios: value[1]});
  })
  .catch(err => {
    debug('??????????????');
    debug(err);
    res.status(500).json(err);
  });
});


router.post('/',  mdAutenticacion.verificatoken(centro.PERMISO.CREAR), (req, res, next) => {
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
   values ${data}`;
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

router.get('/obtener/:id',  mdAutenticacion.verificatoken(centro.PERMISO.EDITAR), (req, res, next) => {
  // usuario_centro_trabajo.id,
  let query = `SELECT
        GROUP_CONCAT( CASE  WHEN usuario_centro_trabajo.idRol = 3 AND usuario_centro_trabajo.estado = 'Activo' THEN usuario.id END ) as idAuditores,
        GROUP_CONCAT( CASE  WHEN usuario_centro_trabajo.idRol = 5 AND usuario_centro_trabajo.estado = 'Activo' THEN usuario.id END ) as idUsuarios,
        CT.codigo, CT.descripcion,
        usuario_centro_trabajo.idCentro,
        usuario_centro_trabajo.linea
      FROM usuario_centro_trabajo
      INNER JOIN homologacion.centro_trabajo AS CT ON CT.id = usuario_centro_trabajo.idCentro
      LEFT JOIN usuario ON usuario.id = usuario_centro_trabajo.idUsuario WHERE usuario_centro_trabajo.idCentro = ${req.params.id} GROUP BY usuario_centro_trabajo.idCentro` ,
    connection = mysql.createConnection(config.connection);
  connection.connect();
  let promesa = config.consultar(connection, query);
  promesa.then(value => {
    if (value && value.length) res.json(value);
  })
  .catch(err => {
    debug('¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿¿');
    debug(err);
    res.status(500).json(err);
  });
});

router.get('/eliminar/:id', mdAutenticacion.verificatoken(centro.PERMISO.ELIMINAR), (req, res, next) => {
  let query = "UPDATE usuario_centro_trabajo SET estado = 'Eliminado' WHERE centro.id = " + req.params.id;
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
