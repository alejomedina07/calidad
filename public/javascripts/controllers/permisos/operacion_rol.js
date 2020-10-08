(function(){
  'use strict';

  app.controller('operacion_rol', function($http, $timeout, $mdDialog, ToastFactoria, $filter){
    var $oCtrl = this;

    $oCtrl.init = function() {
      $oCtrl.listarOperacionesRol();
      $oCtrl.listarOperaciones();
      $oCtrl.listarRol();
      $oCtrl.form = {estado:'Activo'};
    };


    $oCtrl.focoParaBuscar = function() {
      $timeout(function(){
        var campo = angular.element('.campo-busqueda');
        campo.focus();
      }, 500);
    };

    $oCtrl.buscar = function(ev) {
        ev.stopPropagation();
    };

    // formulario

    $oCtrl.guardar = function() {
      $oCtrl.loading = true;
      $oCtrl.errores = validate($oCtrl.form, _validar);
      if (!$oCtrl.errores) {
        let url = $oCtrl.form.id ? '/permisos/rol/editar' : '/permisos/rol';
        $http.post(url, $oCtrl.form)
        .then(result => {
          ToastFactoria.verde({contenido: 'Operación - Rol creado exitosamente'});
          $oCtrl.listarOperacionesRol();
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
      idOperacion: {
        presence: {message: "^El campo 'Operación' es requerido"},
      },
      idRol: {
        presence: {message: "^El campo 'Rol' es requerido"},
      },
    };



    // Lista
    $oCtrl.pagina = 0;
    $oCtrl.idEliminar = 0;
    $oCtrl.registrosXpagina = 10;
    $oCtrl.filtros = {};

    $oCtrl.listarOperacionesRol = function () {
      $oCtrl.loading = true;
      $http.get('/permisos/rol/listar')
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

    $oCtrl.listarOperaciones = function () {
      $oCtrl.loading = true;
      $http.get('/permisos/listar')
      .then(function(result){
        $oCtrl.listaOperaciones = result.data;
        $oCtrl.loading = false;
      })
      .catch(function(e){
        $oCtrl.loading = false;
        console.log(e);
      });
    };

    $oCtrl.listarRol = function () {
      $oCtrl.loading = true;
      $http.get('/permisos/rol/listar-roles')
      .then(function(result){
        $oCtrl.listaRol = result.data;
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
