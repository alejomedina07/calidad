(function(){
  'use strict';

  app.controller('defectos', function($http, $timeout, $mdDialog, ToastFactoria, $filter){
    var $dCtrl = this;

    $dCtrl.init = function() {
      $dCtrl.listarDefectos();
      $dCtrl.form = {estado:'Activo'};
    };


    // formulario

    $dCtrl.guardar = function() {
      $dCtrl.loading = true;
      $dCtrl.errores = validate($dCtrl.form, _validar);
      if (!$dCtrl.errores) {
        let url = $dCtrl.form.id ? '/chequeo/defectos/editar' : '/chequeo/defectos/';
        $http.post(url, $dCtrl.form)
        .then(result => {
          ToastFactoria.verde({contenido: 'Defecto creado exitosamente'});
          $dCtrl.listarDefectos();
          $dCtrl.form = {estado:'Activo'};
          // window.location.href = "/defectos/";
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
      estado: {
        presence: {message: "^El campo 'Línea de Producción' es requerido"},
      },
    };



    // Lista
    $dCtrl.pagina = 0;
    $dCtrl.idEliminar = 0;
    $dCtrl.registrosXpagina = 10;
    $dCtrl.filtros = {};

    $dCtrl.listarDefectos = function () {
      $dCtrl.loading = true;
      $http.get('/chequeo/defectos/listar')
      .then(function(result){
        $dCtrl.defectos = result.data;
        $dCtrl.defectosFiltrados = $dCtrl.defectos;
        $dCtrl.paginar();
        $dCtrl.loading = false;
      })
      .catch(function(e){
        $dCtrl.loading = false;
        console.log(e);
      });
    };

    $dCtrl.filtrar = function() {
      $dCtrl.defectosFiltrados = $filter('filter')($dCtrl.defectos, $dCtrl.search);
      $dCtrl.paginar();
    };


    $dCtrl.paginar = function() {
      $dCtrl.totalPaginas = Math.ceil($dCtrl.defectosFiltrados.length/$dCtrl.registrosXpagina);
    };


    $dCtrl.ordenarPor = function (campo) {
      $dCtrl.reverse = ($dCtrl.propertyName === campo) ? !$dCtrl.reverse : false;
      $dCtrl.propertyName = campo;
    }

    $dCtrl.init();

  });
})();
