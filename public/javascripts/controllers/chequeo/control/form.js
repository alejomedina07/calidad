(function(){
  'use strict';

  app.controller('formControl', function($scope, $http, $timeout, $mdDialog, ToastFactoria, $filter){
    var $fCtrl = this;
    $fCtrl.pagina = 0;
    $fCtrl.idEliminar = 0;
    $fCtrl.registrosXpagina = 10;
    $fCtrl.filtros = {};

    $fCtrl.init = function() {
      $fCtrl.form = {};
      $fCtrl.obtenerOPs();
      $fCtrl.obtener_ops();
      if ($fCtrl.id) {
        $fCtrl.form.id = $fCtrl.id;
        obtenerRegistro();
      }
      // $fCtrl.listarCarroceria();
    };

    $fCtrl.obtener_ops = function() {
      // $http.get('/chequeo/control/obtener-ops/'+  $fCtrl.obtenerLinea($fCtrl.form.linea) )
      $http.get('/chequeo/control/obtener-ops/linea')
      .then(function(result){
        $fCtrl.ops = result.data;
        console.log($fCtrl.ops);
      })
      .catch(function(e){
        console.log(e);
      });
    };


    $fCtrl.buscarCentro = function() {
      console.log($fCtrl.form.op);
      $fCtrl.form.idCarroceria = $fCtrl.form.op.idCarroceria
      $http.get('/chequeo/control/obtener-centro-real/' + $fCtrl.obtenerPrefijoLinea($fCtrl.form.op.lineaReal))
      .then(function(result){
        $fCtrl.centroReales = result.data;
        console.log('$fCtrl.centroReales');
        console.log($fCtrl.centroReales);
      })
      .catch(function(e){
        console.log(e);
      });
    };


    $fCtrl.buscarCentroDefinido = function() {
      // debugger;
      console.log($fCtrl.form.centroReal);
      $http.get('/chequeo/control/obtener-centro-definido/' + $fCtrl.obtenerPrefijoLinea($fCtrl.form.op.lineaDefinida) + '/' + $fCtrl.form.centroReal.descripcionCorta)
      .then(function(result){
        $fCtrl.form.idCentro = result.data[0].id;
        $fCtrl.buscarCarrocerias();
        console.log('$fCtrl.centroReales');
        console.log($fCtrl.centroReales);
      })
      .catch(function(e){
        console.log(e);
      });
    };


    function obtenerRegistro() {
      $http.get('/chequeo/control/obtener-registro/' + $fCtrl.form.id)
      .then(function(result){
        $fCtrl.form = result.data[0];
        $fCtrl.buscarOperaciones();
        $fCtrl.buscarDefectos();
      })
      .catch(function(e){
        console.log(e);
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

    $fCtrl.obtenerDefectos = function(operacion) {
        if (!operacion.defectos || !$fCtrl.defectos) return '';
        else {
          if ( !Array.isArray(operacion.defectos) ) {
            operacion.defectos = operacion.defectos.split(",");
            let array = [];
            operacion.defectos.forEach((item, i) => {
              let def = $fCtrl.defectos;
              array.push(def.find(x => x.idDefecto == parseInt(item) ).nombre);
            });
            operacion.nombre_defectos = array.join(", ");
          }
          return operacion.nombre_defectos;
        }
    };

    $fCtrl.buscarCarrocerias = function () {
      $http.get('/chequeo/control/obtener-carrocerias?idCentro=' + $fCtrl.form.idCentro)
      .then(function(result){
        $fCtrl.carrocerias = result.data;
        if (!$fCtrl.carrocerias || !$fCtrl.carrocerias.length) {
          ToastFactoria.rojo({contenido: 'No hay carrocerias configurados.'});
        }
        $fCtrl.buscarChasis();
      })
      .catch(function(e){
        console.log(e);
      });
    };

    $fCtrl.buscarChasis = function() {
      $http.get('/chequeo/control/chasis/' + $fCtrl.form.idCarroceria)
      .then(result => {
        $fCtrl.chasis = result.data;
        // if ($fCtrl.id && fCtrl.id.id) {
        //   $fCtrl.buscarOperaciones();
        // }
      })
      .catch(error => {
        console.log(error);
        ToastFactoria.rojo({contenido: 'No se pudo realizar la acción intentelo de nuevo.'});
        $fCtrl.loading = false;
      });
    };


    $fCtrl.buscarOperaciones = function () {
      $fCtrl.loading = true;
      let url = `/chequeo/control/operaciones/${$fCtrl.form.idChasisCarroceria}/${$fCtrl.form.idCentro}?id=${$fCtrl.form.id}`
      $http.get(url)
      .then(function(result){
        $fCtrl.operaciones = result.data;
        $fCtrl.loading = false;
      })
      .catch(function(e){
        ToastFactoria.rojo({contenido: 'Ocurrio un error, intentelo mas tarde.'});
        $fCtrl.loading = false;
        console.log(e);
      });
    };


    $fCtrl.openModal = function(ev, operacion) {
      $fCtrl.operacionSeleccionada = operacion;
      if ($fCtrl.form.estado == 'Activo') {
        abrirModalDefectosActivos(ev);
      }else {
        abrirModalDefectosACerrar(ev);
      }
    };

    function abrirModalDefectosActivos(ev) {
      if ($fCtrl.operacionSeleccionada.defectos) {
        $fCtrl.defectos.forEach((item, i) => {
          var index = $fCtrl.operacionSeleccionada.defectos.indexOf(item.idDefecto.toString());
          if (index >= 0)
            item.selected = true;
          else
            item.selected = false;
        });
      }else {
        $fCtrl.defectos.forEach((item, i) => {
          item.selected = false;
        });
      }

      $mdDialog.show({
        contentElement: '#myDialog',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      });
    }

    function abrirModalDefectosACerrar(ev) {
      $fCtrl.defectosACerrar = [];
      if ($fCtrl.operacionSeleccionada.defectos) {
        $fCtrl.defectos.forEach((item, i) => {
          var index = $fCtrl.operacionSeleccionada.defectos.indexOf(item.idDefecto.toString());
          if (index >= 0)
            $fCtrl.defectosACerrar.push(item);
        });
      }else {
        ToastFactoria.rojo({contenido: 'No hay defectos.'});
        return '';
      }

      $mdDialog.show({
        contentElement: '#myDialog',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      });
    }

    $fCtrl.close = function() {
      $fCtrl.operacionSeleccionada = null;
      $mdDialog.hide();
    };


    $fCtrl.buscarDefectos = function () {
      $fCtrl.loading = true;
      let url = `/chequeo/control/obtener-defectos/${$fCtrl.form.idChasisCarroceria}/${$fCtrl.form.idCentro}`
      $http.get(url)
      .then(function(result){
        $fCtrl.defectos = result.data;
        $fCtrl.loading = false;
      })
      .catch(function(e){
        $fCtrl.loading = false;
        console.log(e);
      });
    };


    $fCtrl.obtenerOPs = function () {
      $http.get('/chequeo/control/obtener-centros?codigo=1')
      .then(function(result){
        $fCtrl.listaOps = result.data;
        if (!$fCtrl.listaOps || !$fCtrl.listaOps.length) {
          ToastFactoria.rojo({contenido: 'No hay centros de trabajo conofigurados.'});
        }
      })
      .catch(function(e){
        console.log(e);
      });
    };



    $fCtrl.cerrar = function() {
      $fCtrl.idEliminar = null;
      $mdDialog.hide();
    };

    $fCtrl.obtenerLinea = function (linea) {
      switch (linea) {
        case "LL":
          return "Linea Liviana";
          break;
        case "LP":
          return "Linea Pesada";
            break;
        case "LB":
          return "Linea BusStar";
            break;
      }
    }


    $fCtrl.obtenerPrefijoLinea = function (linea) {
      switch (linea) {
        case "Linea Liviana":
          return "LL";
          break;
        case "Linea Pesada":
          return "LP";
            break;
        case "Linea BusStar":
          return "LB";
            break;
      }
    }

    // $fCtrl.init();

    $fCtrl.guardar = function() {
      $fCtrl.loading = true;

      var form = {
        idCarroceria: $fCtrl.form.op.idCarroceria,
        op: $fCtrl.form.op.id,
        idCentroReal:$fCtrl.form.centroReal.id,
        idCentro: $fCtrl.form.idCentro,
        idChasisCarroceria: $fCtrl.form.idChasisCarroceria

      };
      $fCtrl.errores = validate(form, _validar);
      if (!$fCtrl.errores) {

        var url = $fCtrl.form.id ? '/chequeo/control/editar' : '/chequeo/control/';
        $http.post(url, form)
        .then(result => {
          ToastFactoria.verde({contenido: 'Chequeo creado exitosamente'});
          console.log('result.data[0]');
          console.log(result.data);
          window.location.href = "/chequeo/control/editar/" + result.data;
          // $fCtrl.form.id = result.data;
          // $fCtrl.id = $fCtrl.form.id;
          // obtenerRegistro();
        })
        .catch(error => {
          console.log(error);
          ToastFactoria.rojo({contenido: 'No se pudo realizar la acción intentelo de nuevo.'});
          $fCtrl.loading = false;
        });
      }else {
        ToastFactoria.rojo({contenido: 'Revise los campos.'});
        $fCtrl.loading = false;
      }

    };

    $fCtrl.guardarDefectos = function() {
      $fCtrl.loading = true;
      $fCtrl.errores = validate($fCtrl.form, _validar);
      var form = { id:$fCtrl.form.id, idOperacion: $fCtrl.operacionSeleccionada.idOperacion, arrayDefectos:[] };
      $fCtrl.operacionSeleccionada.defectos = '';
      $fCtrl.defectos.forEach((item, i) => {
        if (item.selected)
          form.arrayDefectos.push(item.idDefecto);
      });

      $http.post('/chequeo/control/defecto', form)
      .then(result => {
        ToastFactoria.verde({contenido: 'Defecto guardado exitosamente'});
        $timeout(function(){
          $fCtrl.buscarOperaciones();
        }, 500);
        $fCtrl.close();
      })
      .catch(error => {
        console.log(error);
        ToastFactoria.rojo({contenido: 'No se pudo realizar la acción intentelo de nuevo.'});
        $fCtrl.loading = false;
      });
    };

    $fCtrl.cerrarDefectos = function() {
      $fCtrl.loading = true;
      var form = { id:$fCtrl.form.id, idOperacion: $fCtrl.operacionSeleccionada.idOperacion, arrayDefectos:[] };
      $fCtrl.operacionSeleccionada.defectos = '';
      $fCtrl.defectosACerrar.forEach((item, i) => {
        if (item.selected)
          form.arrayDefectos.push(item.idDefecto);
      });

      $http.post('/chequeo/control/defecto/cerrar', form)
      .then(result => {
        ToastFactoria.verde({contenido: 'Defecto Cerrado exitosamente'});
        console.log('result');
        console.log(result);
        $timeout(function(){
          $fCtrl.buscarOperaciones();
        }, 500);
        $fCtrl.close();
        if (result.data.affectedRows == 1) {
          notificacionFinalizado();
        }
      })
      .catch(error => {
        console.log(error);
        ToastFactoria.rojo({contenido: 'No se pudo realizar la acción intentelo de nuevo.'});
        $fCtrl.loading = false;
      });
    };



    function notificacionFinalizado() {
      var confirm = $mdDialog.confirm()
      .title('Notificación')
      .textContent('Se ha finalizado con éxito el chequeo.')
      .ariaLabel('Finalizado')
      .ok('Aceptar')
      $mdDialog.show(confirm).then(function() {
        window.location.href = "/chequeo/control";
      }, function() {
        window.location.href = "/chequeo/control";
      });
    }

    $fCtrl.finalizar = function () {
      $fCtrl.errores = validate($fCtrl.form, _validar_observacion);
      if (!$fCtrl.errores) {
        $http.get('/chequeo/control/finalizar/' + $fCtrl.form.id + '?observacion=' + $fCtrl.form.observacion)
        .then(function(result){
          window.location.href = "/chequeo/control";
        })
        .catch(function(e){
          console.log(e);
        });
      }
    };

    var _validar = {
      // linea: {
      //   presence: {message: "^El campo 'Línea de Producción' es requerido"},
      // },
      idCentro: {
        presence: {message: "^El campo 'Centro de Trabajo' es requerido"},
      },
      idCarroceria: {
        presence: {message: "^El campo 'Carrocería' es requerido", allowEmpty: false},
      },
      idChasisCarroceria: {
        presence: {message: "^El campo 'Chasis' es requerido", allowEmpty: false},
      },
      op: {
        presence: {message: "^El campo 'Orden de Producción' es requerido", allowEmpty: false},
      }

    },_validar_observacion = {
      observacion: {
        presence: {message: "^El campo 'Observación' es requerido", allowEmpty: false},
      }
    };

  });
})();
