(function(){
  'use strict';

  app.controller('formCentroDeTrabajo', function($http, $timeout, md5, ToastFactoria, $location){
    var $fCtrl = this;
    $fCtrl.form = {};

    $fCtrl.focoParaBuscar = function() {
      $timeout(function(){
        var campo = angular.element('.campo-busqueda');
        campo.focus();
      }, 500);
    };

    $fCtrl.buscar = function(ev) {
        ev.stopPropagation();
    };

    $fCtrl.init = function() {
      if ($fCtrl.id) obtenerCentro();
      obtenerUsuarios();
    };

    function obtenerUsuarios() {
      $http.get('/centros/obtener-usuarios')
      .then(result => {
        $fCtrl.auditores = result.data.auditores;
        $fCtrl.usuarios = result.data.usuarios;
      })
      .catch(error => {

      });
    }


    $fCtrl.obtenerOPs = function () {
      $http.get('/centros/obtener-ops?codigo=' + $fCtrl.form.linea)
      .then(function(result){
        $fCtrl.listaOps = result.data;
      })
      .catch(function(e){
        console.log(e);
      });
    }

    function obtenerCentro() {
      $http.get('/centros/obtener/'+ $fCtrl.id)
      .then(result => {
        if (!result.data || !result.data.length) window.location.href = "/centros/";
        $fCtrl.form = result.data[0];
        $fCtrl.obtenerOPs();
        $fCtrl.form.id = $fCtrl.id;
        $fCtrl.form.usuarios = $fCtrl.form.idUsuarios.split(",");
        $fCtrl.form.auditores = $fCtrl.form.idAuditores.split(",");
        $fCtrl.form.usuarios.map( x => parseInt(x) );
        $fCtrl.form.auditores.map( x => parseInt(x) );
        console.log($fCtrl.form);
      })
      .catch(error => {
        console.log(error);
      });
    }

    $fCtrl.guardar = function() {
      $fCtrl.loading = true;
      $fCtrl.errores = validate($fCtrl.form, _validar);
      if (!$fCtrl.errores) {
        $fCtrl.form.idRolAuditor = $fCtrl.auditores[0].idRol;
        $fCtrl.form.idRolUsuarios = $fCtrl.usuarios[0].idRol;
        let url = $fCtrl.form.id ? '/centros/editar' : '/centros/';
        $http.post(url, $fCtrl.form)
        .then(result => {
          ToastFactoria.verde({contenido: 'Centro creado exitosamente'});
          window.location.href = "/centros/";
        })
        .catch(error => {
          console.log(error);
          ToastFactoria.rojo({contenido: 'No se pudo realizar la acción intentelo de nuevo.'});
          $fCtrl.loading = false;
        });
      }else ToastFactoria.rojo({contenido: 'Revise los campos.'});

    };

    var _validar = {
      linea: {
        presence: {message: "^El campo 'Línea de Producción' es requerido"},
      },
      idCentro: {
        presence: {message: "^El campo 'Centro de Trabajo' es requerido"},
      },
      // estado: {
      //   presence: {message: "^El campo 'Estado' es requerido"},
      // },
      auditores: {
        presence: {message: "^El campo 'Auditores' es requerido", allowEmpty: false},
      },
      usuarios: {
        presence: {message: "^El campo 'Usuarios' es requerido", allowEmpty: false},
      }
    };

    // $fCtrl.init();

  });
})();
