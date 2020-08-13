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
        // $fCtrl.form.idRol = [];
        // result.data.forEach((item, i) => {
        //   $fCtrl.form.idRol.push(item.idRol);
        // });

        $fCtrl.form.id = $fCtrl.id;
        // $fCtrl.form.idAplicacionMovil = String($fCtrl.form.idAplicacionMovil);
      })
      .catch(error => {
        ToastFactoria.rojo({contenido: 'Error al obtener el usuario.'});
      });
    }

    function obtenerRoles() {
      $http.get('/usuarios/obtener-roles')
      .then(result => {
        $fCtrl.roles = result.data;
      })
      .catch(error => {
        ToastFactoria.rojo({contenido: 'Error al obtener los roles.'});
      });
    }

    $fCtrl.guardar = function() {
      $fCtrl.errores = validate($fCtrl.form, _validar);
      if (!$fCtrl.errores) {
        $fCtrl.loading = true;
        // if (!$fCtrl.id) { $fCtrl.form.contrasena = md5.createHash($fCtrl.form.contrasena); };
        // delete $fCtrl.form.contrasena2;
        let url = $fCtrl.form.id ? '/usuarios/editar' : '/usuarios/';
        $http.post(url, $fCtrl.form)
        .then(result => {
          ToastFactoria.verde({contenido: 'Usuario creado exitosamente'});
          window.location.href = "/usuarios/";
        })
        .catch(error => {
          console.log(error);
          ToastFactoria.rojo({contenido: 'No se pudo realizar la acción intentelo de nuevo.'})
          $fCtrl.loading = false;
        });
      }else ToastFactoria.rojo({contenido: 'Revise los campos.'});

    };


    var _validar = {
      nombre: {
        presence: {message: "^El campo 'Nombre' es requerido"},
        length: {
          minimum: 6,
          message: "El Nombre es muy corto"
        }
      },
      cedula: {
        presence: {message: "^El campo 'Cedula' es requerido"},
        length: {
          minimum: 5,
          message: "La cédula es muy corta"
        }
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
      telefonoMovil: {
        presence: {message: "^El campo 'Teléfono Móvil' es requerido"},
        format: {
          // Must be numbers followed by a name
          pattern: "[0-9]+",
          flags: "i",
          message: "^El Teléfono Móvil Solo debe contener números"
        },
        length: {
          minimum: 10,
          maximum:10,
          message: "^El Teléfono Móvil debe tener 10 dígitos"
        }
      },
      idRol: {
        presence: {message: "^El campo 'Rol' es requerido", allowEmpty: false},
      },
    };

    // $fCtrl.init();

  });
})();
