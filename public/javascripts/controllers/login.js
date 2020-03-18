(function(){
  'use strict';

  app.controller('login', ['$scope', '$rootScope', '$http', 'md5', 'ToastFactoria', function($scope, $rootScope, $http, md5, ToastFactoria){
    var $lCtrl = this;



    $lCtrl.login = function() {
      // if ($lCtrl.form.contrasena) {
      //   $lCtrl.form.contrasena = md5.createHash($lCtrl.form.contrasena);
      // };
      $http.post('/login', $lCtrl.form)
      .then(result => {
        localStorage.setItem("operaciones", result.data.usuario.operaciones);
        window.location.href = "/notificaciones/formulario";
      })
      .catch(error => {
        ToastFactoria.rojo({contenido:error.data.mensaje})
      });
    };

    var current = null;
    document.querySelector('#user').addEventListener('focus', function(e) {
      if (current) current.pause();
      current = anime({
        targets: 'path',
        strokeDashoffset: { value: 0, duration: 700, easing: 'easeOutQuart' },
        strokeDasharray: { value: '240 1386', duration: 700, easing: 'easeOutQuart' }
      });
    });
    document.querySelector('#password').addEventListener('focus', function(e) {
      if (current) current.pause();
      current = anime({
        targets: 'path',
        strokeDashoffset: { value: -336, duration: 700, easing: 'easeOutQuart' },
        strokeDasharray: { value: '240 1386', duration: 700, easing: 'easeOutQuart' }
      });
    });
    document.querySelector('#submit').addEventListener('focus', function(e) {
      if (current) current.pause();
      current = anime({
        targets: 'path',
        strokeDashoffset: { value: -730, duration: 700, easing: 'easeOutQuart' },
        strokeDasharray: { value: '530 1386', duration: 700, easing: 'easeOutQuart' }
      });
    });

  }]);
})();
