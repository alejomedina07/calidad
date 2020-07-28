var jwt = require('jsonwebtoken');
var debug = require('debug')('BC:ctrAuth');
var SEED = require('../config/config').SEED;

// verificar usuairios

exports.verificatoken = function(permiso, sinPermiso) {
  return function(req, res, next) {
    var token = req.session.loggedin;
    jwt.verify( token, SEED, ( err, decoded ) => {
      if (err || !req.session.usuario || !req.session.usuario.operaciones || !req.session.usuario.operaciones.includes(permiso)) {
        res.redirect("/")
      }else {
        req.session.usuario = decoded.usuario || '';
        next();
      }
    });
  }
}
