let express = require('express'),
 debug = require('debug')('BC:ctrFoto'),
 config = require( '../config/general' ),
 fs = require('fs'),
 fileUpload = require('express-fileupload'),
 usuario = require( '../models/Usuario' ),
 mysql = require('mysql'),
 mdAutenticacion = require('../middlewares/autenticacion'),
 router = express.Router();

router.get('/', mdAutenticacion.verificatoken(usuario.PERMISO.LISTAR), (req, res, next) => {
  res.render("fotos/fotos", { title: 'Usuarios', usuario:req.session.usuario });
});

router.get('/crear', mdAutenticacion.verificatoken(usuario.PERMISO.LISTAR), (req, res, next) => {
  res.render("fotos/fotos", { title: 'Fotos', usuario:req.session.usuario, mensaje:'La imagen se guardo correctamente' });
});

router.get('/listar',  mdAutenticacion.verificatoken(usuario.PERMISO.LISTAR), (req, res, next) => {

  let connection = mysql.createConnection(config.connection),
    query = `SELECT f.*, CONCAT(op.prefijo, op.op) as op, u.nombre as usuario
    FROM foto f
    INNER JOIN pdmsinergia.orden_produccion op ON op.id = f.idOp
    INNER JOIN usuario u ON u.id = f.idUsuarioCreacion`;
  connection.connect();
  let promesa = config.consultar(connection, query);
  promesa.then(value => {
    res.json(value);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});


router.get('/obtener-ops/:linea',  mdAutenticacion.verificatoken(usuario.PERMISO.LISTAR), (req, res, next) => {
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


router.use(fileUpload());

router.post('/', ( req, res ) => {
  // req.body.op = req.body.idOp.prefijo + req.body.idOp.op;
  // req.body.op = req.body.idOp.id;

  debug('req.body');
  debug(req.body);
  let moment = require('moment');
  if ( !req.files )
      return res.status(400).json({ok: false, mensaje:'No se selecciono nada'});

  // NOMBRE DEL ARCHIVO
  var archivo = req.files.imagenes, ext = archivo.name.split('.');
  ext = ext[ext.length-1];

  //validar extenciones
  var extPermitidas = ['png', 'jpg', 'jpeg']
  if ( extPermitidas.indexOf( ext.toLowerCase() ) < 0 )
      return res.status(400).json({ok: false, mensaje:'Extension no valida, las validas son ' + extPermitidas.join(', ')});

  var ano_mes = moment().format('YYYY/MM');

  let query = `INSERT INTO foto (idOp, ano_mes, idUsuarioCreacion)
   values (${req.body.idOp}, ${ano_mes}, ${req.session.usuario.id})`;
  let connection = mysql.createConnection(config.connection);
  connection.connect();
  let promesa = config.consultar(connection, query);
  promesa.then(value => {
    // nombre de archivo personalizado
    var nombreArchivo = `${ value.insertId }.${ext}`
    var patch = `./fotos/calidad/${nombreArchivo}`;
    debug('nombreArchivo');
    debug(nombreArchivo);
    debug('patch');
    debug(patch);

    archivo.mv(patch, function(err) {
        if (err)
          return res.status(500).json({ok: false, mensaje:'La imagen no se guardo correctamente'});
        const sharp = require('sharp');

        sharp(patch)
          .resize(900)
          .toBuffer()
          .then( data => {
            fs.writeFileSync(patch, data);
            debug('holaaaa');
            debug(data);

            try {
              var EasyFtp = require('easy-ftp');
              var ftp = new EasyFtp();
              var config = {
                host: '172.16.2.28',
                port: 21,
                username: 'admin_ftp',
                password: 'SR-53rv1d0r',
                type : 'ftp'
              };
              ftp.connect(config);
              var dir = 'FOTOS/calidad/' + moment().format('YYYY/MM') + '/' +req.body.op;
              ftp.exist(dir, function(exist){
                if (!exist) {
                  ftp.mkdir(dir, function(err){
                    if (err)
                      return res.status(500).json({ok: false, mensaje:'La imagen no se guardo correctamente'});
                    ftp.upload(patch, `${dir}/${nombreArchivo}`, function(err){
                      if (err)
                        return res.status(500).json({ok: false, mensaje:'La imagen no se guardo correctamente'});
                      fs.unlinkSync( `./fotos/calidad/${nombreArchivo}` );
                      // return res.status(200).json({ok: true, mensaje:'La imagen se guardo correctamente'});
                      return res.redirect("fotos");
                    });
                  });
                }else{
                  ftp.upload(patch, `${dir}/${nombreArchivo}`, function(err){
                    if (err)
                      return res.status(500).json({ok: false, mensaje:'La imagen no se guardo correctamente'});
                    fs.unlinkSync( `./fotos/calidad/${nombreArchivo}` );
                    // return res.status(200).json({ok: true, mensaje:'La imagen se guardo correctamente'});
                    return res.redirect("fotos");
                  });
                }
              })
            } catch (err) {
              return res.status(500).json({ok: false, mensaje:'La imagen no se guardo correctamente'});
            }



              // return res.status(200).json({ok: true, mensaje:'La imagen se guardo correctamente', nombreArchivo});
          })
          .catch( err => {
            debug('654649849516313216');
            debug(err);
            console.log(err);
          });
      });
  })
  .catch(err => {
    debug('err');
    debug(err);
    res.status(500).json(err);
  });
});


router.get('/ejemplo', (req, res, next) => {
  // res.send('hola ');
  debug('holaaaa ejemplo');
  const ftp = require("basic-ftp");
  example()

  async function example() {
      const client = new ftp.Client()
      client.ftp.verbose = true
      try {
          await client.access({
              host: "172.16.2.28",
              user: "admin_ftp",
              password: "SR-53rv1d0r",
              secure: false
          })

          // await client.ensureDir("FOTOS/calidad/2020")
          await client.uploadFrom("fotos/calidad/1-494.jpg", "FOTOS/calidad/2020/1-494.jpg")
          // await client.downloadTo("README_COPY.md", "README_FTP.md")
      }
      catch(err) {
        debug('err');
        debug(err);
          // console.log(err)
      }
      client.close()
  }
});


router.get('/ejemplis', (req, res, next) => {
  debug(23423);

  var EasyFtp = require('easy-ftp');
  var ftp = new EasyFtp();
  var config = {
    host: '172.16.2.28',
    port: 21,
    username: 'admin_ftp',
    password: 'SR-53rv1d0r',
    type : 'ftp'
  };
  ftp.connect(config);
  var dir = 'FOTOS/calidad/' + moment().format('YYYY/MM') + req.body.op;
  ftp.exist("FOTOS/calidad/2020/02/1852", function(exist){
    if (!exist) {
      ftp.mkdir("FOTOS/calidad/2020/02/1852", function(err){
        if (err)
          return res.status(500).json({ok: false, mensaje:'La imagen no se guardo correctamente'});
        ftp.upload("fotos/calidad/1-494.jpg", "FOTOS/calidad/2020/02/1852/1-494.jpg", function(err){
          if (err)
            return res.status(500).json({ok: false, mensaje:'La imagen no se guardo correctamente'});
          return res.status(200).json({ok: true, mensaje:'La imagen se guardo correctamente'});
        });
      });
    }else{
      ftp.upload("fotos/calidad/1-494.jpg", "FOTOS/calidad/2020/02/1852/1-494.jpg", function(err){
        if (err)
          return res.status(500).json({ok: false, mensaje:'La imagen no se guardo correctamente'});
        return res.status(200).json({ok: true, mensaje:'La imagen se guardo correctamente'});
      });
    }
  })

});



module.exports = router;
