var express = require('express'),
  debug=require("debug")("EV:index"),
  // ObjectId = require('mongoose').Types.ObjectId,
  moment= require('moment'),
  push = require( 'pushsafer-notifications' ),
  db = require( '../models/BBOO' ),
  router = express.Router();


router.get("/", function(req, res) {
  // console.log('connection');
  // console.log(connection);
  db.consulta('hola')
  .then(value => {
    console.log('value');
    console.log(value);
  })
  .catch(err => {
    console.log('err');
    console.log(err);
  });
  res.render("index");
});


router.get("/lista", function(req, res) {
  res.render("notificaciones/lista");
});


router.post("/generar-notificacion", function(req, res) {
  debug(req.body);
  console.log('req.body');
  console.log(req.body);

  var p = new push( {
      k: 'bTfKBVlOsrWJUePSeVta',             // your 20 chars long private key
      debug: true
  });

  var msg = {
      m: 'Se solicita en la linea ' + req.body.linea + ' OP-00' + req.body.op + ' En el puesto de trabajo ' + req.body.puesto,   // message (required)
      t: "Notificacion",                     // title (optional)
      s: req.body.sonido,                                // sound (value 0-50)
      v: '3',                                // vibration (empty or value 1-3)
      i: req.body.icono,                                // icon (value 1-176)
      // c: '#FF0000',                          // iconcolor (optional)
      pr: '2',
      re: '60',
      u: 'https://www.pushsafer.com',        // url (optional)
      ut: 'Open Link',                       // url title (optional)
      d: 'a'
  };

  if (req.body.icono == 5) msg.c = '#FF0000';

  console.log('msg');
  console.log(msg);

  // Promise.all([p.send(msg)])
  // p.send(msg)
  // .then(result => {
  //   console.log(result);
  //   res.json({ msg:result });
  // })
  // .catch(error => {
  //   console.log(error);
  // });
});





module.exports = router;
