(function(){
  'use strict';

  app.controller('operacion', function($http, $timeout, $mdDialog, ToastFactoria, $filter){
    var $oCtrl = this;

    $oCtrl.init = function() {
      $oCtrl.listarOperaciones();
      $oCtrl.form = {estado:'Activo'};
    };


    // formulario

    $oCtrl.guardar = function() {
      $oCtrl.loading = true;
      $oCtrl.errores = validate($oCtrl.form, _validar);
      if (!$oCtrl.errores) {
        let url = $oCtrl.form.id ? '/permisos/editar' : '/permisos';
        $http.post(url, $oCtrl.form)
        .then(result => {
          ToastFactoria.verde({contenido: 'Defecto creado exitosamente'});
          $oCtrl.listarOperaciones();
          $oCtrl.form = {estado:'Activo'};
          // window.location.href = "/operaciones/";
        })
        .catch(error => {
          console.log(error);
          ToastFactoria.rojo({contenido: 'No se pudo realizar la acción intentelo de nuevo.'});
          $oCtrl.loading = false;
        });
      }else {
        $oCtrl.loading = false;
        ToastFactoria.rojo({contenido: 'Revise los campos.'});
      }

    };

    var _validar = {
      nombre: {
        presence: {message: "^El campo 'Nombre' es requerido"},
      },
      estado: {
        presence: {message: "^El campo 'Estado' es requerido"},
      },
    };



    // Lista
    $oCtrl.pagina = 0;
    $oCtrl.idEliminar = 0;
    $oCtrl.registrosXpagina = 10;
    $oCtrl.filtros = {};

    $oCtrl.listarOperaciones = function () {
      $oCtrl.loading = true;
      $http.get('/permisos/listar')
      .then(function(result){
        $oCtrl.operaciones = result.data;
        $oCtrl.operacionesFiltrados = $oCtrl.operaciones;
        $oCtrl.paginar();
        $oCtrl.loading = false;
      })
      .catch(function(e){
        $oCtrl.loading = false;
        console.log(e);
      });
    };

    $oCtrl.filtrar = function() {
      $oCtrl.operacionesFiltrados = $filter('filter')($oCtrl.operaciones, $oCtrl.search);
      $oCtrl.paginar();
    };


    $oCtrl.paginar = function() {
      $oCtrl.totalPaginas = Math.ceil($oCtrl.operacionesFiltrados.length/$oCtrl.registrosXpagina);
    };


    $oCtrl.ordenarPor = function (campo) {
      $oCtrl.reverse = ($oCtrl.propertyName === campo) ? !$oCtrl.reverse : false;
      $oCtrl.propertyName = campo;
    }

    $oCtrl.init();

  });
})();
