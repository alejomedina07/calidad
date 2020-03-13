(function(){
  'use strict';

  app.controller('formNotificacion', function($http, $timeout, ToastFactoria){
    var $fCtrl = this;
    $fCtrl.form = {sonido:8};

    $fCtrl.sonidos =  [
      {id:8, nombre:'Buzzer'},
      {id:20, nombre:'Honk'},
      {id:22, nombre:'Morse'},
      {id:26, nombre:'Military Trumpets'}
    ];

    $fCtrl.iconos = [
      {id:1, icono:'bell' , nombre:'Alarma'},
      {id:2, icono:'alert' , nombre:'Exclamacion'},
      {id:3, icono:'question' , nombre:'Pregunta'},
      {id:4, icono:'info' , nombre:'Información'},
      {id:5, icono:'warning' , nombre:'Peligro'},
    ];

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
      if ($fCtrl.id) obtenerUsuario();
      obtenerCentros();
    };

    function obtenerUsuario() {
      $http.get('/notificaciones/obtener/'+ $fCtrl.id)
      .then(result => {
        if (!result.data || !result.data.length) window.location.href = "/notificaciones/";
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

    function obtenerCentros() {
      $http.get('/notificaciones/obtener-centros')
      .then(result => {
        if (!result.data || !result.data.length) ToastFactoria.rojo({contenido: 'No tiene centros de trabajo asociados.'});
        else {
          $fCtrl.centros = result.data;
          console.log('$fCtrl.centros');
          console.log($fCtrl.centros);
          $fCtrl.lineas = [...new Set($fCtrl.centros.map(item => item.linea))];
          console.log('$fCtrl.lineas');
          console.log($fCtrl.lineas);
        }
      })
      .catch(error => {
        console.log(error);
      });
    }

    $fCtrl.guardar = function() {
      $fCtrl.errores = validate($fCtrl.form, _validar);
      if (!$fCtrl.errores) {
        let opSeleccionada = $fCtrl.ops.filter( x => { return x.id == $fCtrl.form.idOp  } )
        $fCtrl.form.nombreOp = opSeleccionada[0].prefijo + opSeleccionada[0].op;
        $fCtrl.form.nombreLinea = $fCtrl.obtenerLinea($fCtrl.form.linea);
        let url = $fCtrl.form.id ? '/notificaciones/editar' : '/notificaciones/';
        $http.post(url, $fCtrl.form)
        .then(result => {
          ToastFactoria.verde({contenido: 'Usuario creado exitosamente'});
          window.location.href = "/notificaciones/";
        })
        .catch(error => {
          console.log(error);
          ToastFactoria.rojo({contenido: 'No se pudo realizar la acción intentelo de nuevo.'})
        });
      }else ToastFactoria.rojo({contenido: 'Revise los campos.'});

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
    };

    function obtenerOp() {
      $http.get('/notificaciones/obtener-ops/?linea='+ $fCtrl.obtenerLinea($fCtrl.form.linea))
      .then(result => {
        $fCtrl.ops = result.data;
      })
      .catch(error => {
        console.log(error);
      });
    }

    $fCtrl.cambioDeLinea = function() {
      $fCtrl.form.idCentro = null;
      obtenerOp();
    }

    var _validar = {
      idCentro: {
        presence: {message: "^El campo 'Centro de trabajo' es requerido"},
      },
      idOp: {
        presence: {message: "^El campo 'OP' es requerido"},
      },
      icono: {
        presence: {message: "^El campo 'Icono' es requerido"}
      },
      linea: {
        presence: {message: "^El campo 'Línea' es requerido"},
      },
      sonido: {
        presence: {message: "^El campo 'Sonido' es requerido"},
      },
      descripcion: {
        presence: {message: "^El campo 'Descripción' es requerido"},
      },
    };

    // $fCtrl.init();

  });
})();
