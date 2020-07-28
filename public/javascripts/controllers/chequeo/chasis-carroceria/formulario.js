(function(){
  'use strict';

  app.controller('formChasisCarroceria', function($http, $timeout, $mdDialog, ToastFactoria, $filter){
    var $fCtrl = this;

    $fCtrl.init = function() {
      $fCtrl.form = {};
      $fCtrl.listarCarroceria();
      $fCtrl.listarCategorias();
    };

    function obtenerRegistro() {
      $http.get('/chequeo/chasis-carroceria/obtener/' + $fCtrl.id)
      .then(result => {
        $fCtrl.form.id = $fCtrl.id;
        $fCtrl.form.carroceria = result.data[0][0].idCarroceria;
        $fCtrl.buscarChasis();
        $fCtrl.form.idChasisCarroceria = result.data[0][0].idChasisCarroceria;

      })
      .catch(error => {
        console.log(error);
        ToastFactoria.rojo({contenido: 'No se pudo realizar la acción intentelo de nuevo.'});
        $fCtrl.loading = false;
      });
    }


    $fCtrl.focoParaBuscar = function() {
      $timeout(function(){
        var campo = angular.element('.campo-busqueda');
        campo.focus();
      }, 500);
    };

    $fCtrl.buscar = function(ev) {
        ev.stopPropagation();
    };


    $fCtrl.listarCategorias = function() {
      var categorias;
      $http.get('/chequeo/chasis-carroceria/categorias')
      .then(result => {
        $fCtrl.selected = [];
        categorias = result.data;
        categorias.forEach((item, i) => {
          $fCtrl.selected.push([]);
        });
        if ($fCtrl.id) {
          // obtenerRegistro();
          return $http.get('/chequeo/chasis-carroceria/obtener/' + $fCtrl.id)
        }else return;
      })
      .then(result => {
        if ($fCtrl.id) {
          $fCtrl.form.id = $fCtrl.id;
          $fCtrl.form.carroceria = result.data[0][0].idCarroceria;
          $fCtrl.buscarChasis();
          $fCtrl.form.idChasisCarroceria = result.data[0][0].idChasisCarroceria;
          $fCtrl.operacionesEditar = result.data[1];
        }
        $fCtrl.form.categorias = categorias;
      })
      .catch(error => {
        console.log(error);
        ToastFactoria.rojo({contenido: 'No se pudo realizar la acción intentelo de nuevo.'});
        $fCtrl.loading = false;
      });
    };


    $fCtrl.listarCarroceria = function() {
      $http.get('/chequeo/chasis-carroceria/carroceria')
      .then(result => {
        $fCtrl.carrocerias = result.data;
      })
      .catch(error => {
        console.log(error);
        ToastFactoria.rojo({contenido: 'No se pudo realizar la acción intentelo de nuevo.'});
        $fCtrl.loading = false;
      });
    };

    $fCtrl.buscarChasis = function() {
      $http.get('/chequeo/chasis-carroceria/chasis/' + $fCtrl.form.carroceria)
      .then(result => {
        $fCtrl.chasis = result.data;
      })
      .catch(error => {
        console.log(error);
        ToastFactoria.rojo({contenido: 'No se pudo realizar la acción intentelo de nuevo.'});
        $fCtrl.loading = false;
      });
    };


    $fCtrl.buscarOperaciones = function(categoria, index) {
      $http.get('/chequeo/chasis-carroceria/operaciones/' + categoria.id)
      .then(result => {
        categoria.operaciones = result.data;
        if ($fCtrl.id) {
          categoria.operaciones.forEach((item, i) => {
            let ind = $fCtrl.operacionesEditar.findIndex(i => i.idOperacion === item.id);
            if (ind >= 0) {
              item.selected = true;
              $fCtrl.selected[index].push(item);
              // $fCtrl.toggle(item, $fCtrl.selected[index])
            }
          });
        }
      })
      .catch(error => {
        console.log(error);
        ToastFactoria.rojo({contenido: 'No se pudo realizar la acción intentelo de nuevo.'});
        $fCtrl.loading = false;
      });
    };

    $fCtrl.guardar = function() {
      $fCtrl.loading = true;
      $fCtrl.errores = validate($fCtrl.form, _validar);
      var operaciones = [];
      let form = { id:$fCtrl.form.id, carroceria: $fCtrl.form.carroceria, categorias: $fCtrl.form.categorias, idChasisCarroceria: $fCtrl.form.idChasisCarroceria};
      form.categorias.forEach((item, i) => {
        item.operaciones.forEach((operacion, i) => {
          if (operacion.selected) {
            operaciones.push(operacion.id)
          }
        });
      });
      if (!$fCtrl.errores && operaciones.length) {
        let url = $fCtrl.form.id ? '/chequeo/chasis-carroceria/editar' : '/chequeo/chasis-carroceria/';
        delete form.categorias;
        form.operaciones = operaciones;
        $http.post(url, form)
        .then(result => {
          ToastFactoria.verde({contenido: 'Chasis - Carroceria creado exitosamente'});
          window.location.href = "/chequeo/chasis-carroceria";
        })
        .catch(error => {
          console.log(error);
          ToastFactoria.rojo({contenido: 'No se pudo realizar la acción intentelo de nuevo.'});
          $fCtrl.loading = false;
        });
      }else {
        $fCtrl.loading = false;
        ToastFactoria.rojo({contenido: 'Revise los campos.'});
      }

    };

    var _validar = {
      carroceria: {
        presence: {message: "^El campo 'Carroceria' es requerido"},
      },
      idChasisCarroceria: {
        presence: {message: "^El campo 'Chasis' es requerido"},
      },
    };

    // $fCtrl.init();


    // Seleccionar todos

    $fCtrl.toggle = function (item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      }
      else {
        list.push(item);
      }
    };

    $fCtrl.exists = function (item, list) {
      return list.indexOf(item) > -1;
    };

    $fCtrl.isIndeterminate = function(i, operaciones) {
      return ($fCtrl.selected[i].length !== 0 &&
          $fCtrl.selected[i].length !== operaciones.length);
    };

    $fCtrl.isChecked = function(i, operaciones) {
      if (operaciones)
        return $fCtrl.selected[i].length === operaciones.length;
    };

    $fCtrl.toggleAll = function(i, operaciones) {
      if (operaciones) {
        if ($fCtrl.selected[i].length === operaciones.length) {
          $fCtrl.selected[i] = [];
        } else if ($fCtrl.selected[i].length === 0 || $fCtrl.selected[i].length > 0) {
          $fCtrl.selected[i] = operaciones.slice(0);
        }
      }
    };


  });
})();
