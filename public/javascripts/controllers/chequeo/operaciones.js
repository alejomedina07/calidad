(function(){
  'use strict';

  app.controller('operaciones', function($http, $timeout, $mdDialog, ToastFactoria, $filter){
    var $dCtrl = this;

    $dCtrl.init = function() {
      $dCtrl.listarOperaciones();
      $dCtrl.listarCategorias();
      $dCtrl.form = {estado:'Activo'};
    };


    // formulario

    $dCtrl.listarCategorias = function () {
      $dCtrl.loading = true;
      $http.get('/chequeo/operaciones/listar-categorias')
      .then(function(result){
        $dCtrl.categorias = result.data;
        $dCtrl.loading = false;
      })
      .catch(function(e){
        $dCtrl.loading = false;
        console.log(e);
      });
    };


    $dCtrl.guardar = function() {
      $dCtrl.loading = true;
      $dCtrl.errores = validate($dCtrl.form, _validar);
      if (!$dCtrl.errores) {
        let url = $dCtrl.form.id ? '/chequeo/operaciones/editar' : '/chequeo/operaciones/';
        $http.post(url, $dCtrl.form)
        .then(result => {
          ToastFactoria.verde({contenido: 'Defecto creado exitosamente'});
          $dCtrl.listarOperaciones();
          $dCtrl.form = {estado:'Activo'};
          // window.location.href = "/operaciones/";
        })
        .catch(error => {
          console.log(error);
          ToastFactoria.rojo({contenido: 'No se pudo realizar la acción intentelo de nuevo.'});
          $dCtrl.loading = false;
        });
      }else {
        $dCtrl.loading = false;
        ToastFactoria.rojo({contenido: 'Revise los campos.'});
      }

    };

    var _validar = {
      nombre: {
        presence: {message: "^El campo 'Nombre' es requerido"},
      },
      idCategoria: {
        presence: {message: "^El campo 'Categoria' es requerido"},
      },
      estado: {
        presence: {message: "^El campo 'Línea de Producción' es requerido"},
      },
    };



    // Lista
    $dCtrl.pagina = 0;
    $dCtrl.idEliminar = 0;
    $dCtrl.registrosXpagina = 10;
    $dCtrl.filtros = {};

    $dCtrl.listarOperaciones = function () {
      $dCtrl.loading = true;
      $http.get('/chequeo/operaciones/listar')
      .then(function(result){
        $dCtrl.operaciones = result.data;
        $dCtrl.operacionesFiltrados = $dCtrl.operaciones;
        $dCtrl.paginar();
        $dCtrl.loading = false;
      })
      .catch(function(e){
        $dCtrl.loading = false;
        console.log(e);
      });
    };

    $dCtrl.filtrar = function() {
      $dCtrl.operacionesFiltrados = $filter('filter')($dCtrl.operaciones, $dCtrl.search);
      $dCtrl.paginar();
    };


    $dCtrl.paginar = function() {
      $dCtrl.totalPaginas = Math.ceil($dCtrl.operacionesFiltrados.length/$dCtrl.registrosXpagina);
    };


    $dCtrl.ordenarPor = function (campo) {
      $dCtrl.reverse = ($dCtrl.propertyName === campo) ? !$dCtrl.reverse : false;
      $dCtrl.propertyName = campo;
    }

    $dCtrl.init();

  });
})();
