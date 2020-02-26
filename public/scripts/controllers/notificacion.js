(function(){
  'use strict';

  app.controller('notificacion', function($http, $timeout){
    var $nCtrl = this;
    $nCtrl.form = {};
    $nCtrl.sonidos =  [
      {id:8, nombre:'Buzzer'},
      {id:20, nombre:'Honk'},
      {id:22, nombre:'Morse'},
      {id:26, nombre:'Military Trumpets'}
    ];

    $nCtrl.iconos = [
      {id:1, icono:'bell' , nombre:'Alarma'},
      {id:2, icono:'alert' , nombre:'Exclamacion'},
      {id:3, icono:'question' , nombre:'Pregunta'},
      {id:4, icono:'info' , nombre:'Información'},
      {id:5, icono:'warning' , nombre:'Peligro'},
    ];

    $nCtrl.generarNotificacion = function () {
      console.log('$nCtrl.form');
      console.log($nCtrl.form);
      $http.post('/generar-notificacion/', $nCtrl.form)
      .then(function(result){
        console.log(result);
      })
      .catch(function(e){
        console.log(e);
      });
    };

  });
})();
