(function(){
  'use strict';

  app.controller('formUsuario', function($http, $timeout, md5, ToastFactoria, $location){
    var $fCtrl = this;
    $fCtrl.form = {};

    $fCtrl.iniciar = function(doc) {
      console.log('doc');
      console.log(doc);
    };

    $fCtrl.init = function() {
      if ($fCtrl.id) obtenerUsuario();
      obtenerRoles();
    };

    function obtenerUsuario() {
      $http.get('/usuarios/obtener/'+ $fCtrl.id)
      .then(result => {
        if (!result.data || !result.data.length) window.location.href = "/usuarios/";
        $fCtrl.form = result.data[0];
        $fCtrl.form.id = $fCtrl.id;
        $fCtrl.form.idAplicacionMovil = String($fCtrl.form.idAplicacionMovil);
        $fCtrl.form.contrasena2 = $fCtrl.form.contrasena;
        console.log($fCtrl.form);
      })
      .catch(error => {
        console.log(error);
      });
    }

    function obtenerRoles() {
      $http.get('/usuarios/obtener-roles')
      .then(result => {
        $fCtrl.roles = result.data;
      })
      .catch(error => {

      });
    }

    $fCtrl.guardar = function() {
      $fCtrl.errores = validate($fCtrl.form, _validar);
      if (!$fCtrl.errores) {
        if (!$fCtrl.id) { $fCtrl.form.contrasena = md5.createHash($fCtrl.form.contrasena); };
        delete $fCtrl.form.contrasena2;
        let url = $fCtrl.form.id ? '/usuarios/editar' : '/usuarios/';
        $http.post(url, $fCtrl.form)
        .then(result => {
          ToastFactoria.verde({contenido: 'Usuario creado exitosamente'});
          window.location.href = "/usuarios/";
        })
        .catch(error => {
          console.log(error);
          ToastFactoria.rojo({contenido: 'No se pudo realizar la acción intentelo de nuevo.'})
        });
      }else ToastFactoria.rojo({contenido: 'Revise los campos.'});

    };


    var _validar = {
      nombre: {
        presence: {message: "^El campo 'Nombre' es requerido"},
      },
      estado: {
        presence: {message: "^El campo 'Estado' es requerido"},
      },
      correo: {
        presence: {message: "^El campo 'Correo' es requerido"},
        email: {message: "^El campo 'Correo' no es correcto"}
      },
      usuarioRed: {
        presence: {message: "^El campo 'Usuario de Red' es requerido"},
      },
      contrasena: {
        presence: {message: "^El campo 'Contraseña' es requerido"},
      },
      contrasena2: {
        presence: {message: "^El campo 'Confirmar Contraseña' es requerido"},
        equality: {
          attribute: "contrasena",
          message: "^EL campo 'Confirmar Contraseña' no coincide con la 'Contraseña'"
        }
      },
      idAplicacionMovil: {
        presence: {message: "^El campo 'ID de Aplicación Movil' es requerido"},
        format: {
          // Must be numbers followed by a name
          pattern: "[0-9]+",
          flags: "i",
          message: "^El id Solo debe contener números"
        }
      },
      // rol: {
      //   presence: {message: "^El campo 'Rol' es requerido"},
      // },
    };

    // $fCtrl.init();

  });
})();
