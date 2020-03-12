(function(){
  'use strict';

  app.controller('listaNotificacion', function($http, $timeout, $mdDialog, $filter, ToastFactoria){
    var $lCtrl = this;
    $lCtrl.pagina = 0;
    $lCtrl.idEliminar = 0;
    $lCtrl.registrosXpagina = 10;
    $lCtrl.filtros = {};
    $lCtrl.form = {};
    $lCtrl.excel = function () {
      fnExcelReport();
    }

    function fnExcelReport()
    {
        var tab_text="<table border='2px'><tr bgcolor='#87AFC6'>";
        var textRange; var j=0,
        tab = document.getElementById('headerTable'); // id of table

        for(j = 0 ; j < tab.rows.length ; j++)
        {
            tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
            //tab_text=tab_text+"</tr>";
        }

        tab_text=tab_text+"</table>";
        tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
        tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
        tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
        {
            txtArea1.document.open("txt/html","replace");
            txtArea1.document.write(tab_text);
            txtArea1.document.close();
            txtArea1.focus();
            sa=txtArea1.document.execCommand("SaveAs",true,"Say Thanks to Sumit.xls");
        }
        else                 //other browser not tested on IE 11
            sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));

        return (sa);
    }

    $lCtrl.listarNotificaciones = function () {
      $http.get('/notificaciones/listar')
      .then(function(result){
        $lCtrl.notificaciones = result.data;
        $lCtrl.notificacionesFiltrados = $lCtrl.notificaciones;
        $lCtrl.paginar();
      })
      .catch(function(e){
        console.log(e);
      });
    };

    $lCtrl.cerrarNotificacion = function () {
      $lCtrl.errores = validate($lCtrl.form, _validar);
      if (!$lCtrl.errores) {
        $lCtrl.form.id = $lCtrl.detalleNotificacion.id;
        $http.post('/notificaciones/cerrar-notificacion/', $lCtrl.form)
        .then(function(result){
          ToastFactoria.verde({contenido: 'Notificación cerrada exitosamente'});
          $lCtrl.cerrar();
          $lCtrl.listarNotificaciones();
        })
        .catch(function(e){
          ToastFactoria.rojo({contenido: 'No se pudo cerrar la notificación, intentelo mas tarde.'});
          $lCtrl.cerrar();
        });
      }else ToastFactoria.rojo({contenido: 'Revise los campos.'});
    };



    $lCtrl.marcarAsistencia = function (id) {
      let url = `/notificaciones/marcar-asistencia/${$lCtrl.detalleNotificacion.id}/${id}`
      $http.get(url)
      .then(function(result){
        ToastFactoria.verde({contenido: 'Asistencia marcada exitosamente'});
        $lCtrl.detalleNotificacion.asistentes = result.data;
      })
      .catch(function(e){
        console.log('e');
        console.log(e);
        ToastFactoria.rojo({contenido: 'No se pudo eliminar el usuario, intentelo mas tarde.'});
        // $lCtrl.cerrar();
      });
    };


    $lCtrl.detalle = function(ev, item) {
      $lCtrl.detalleNotificacion = item;
      $http.get('/notificaciones/obtener-asistencias/' + item.id)
      .then(value => {
        $lCtrl.detalleNotificacion.asistentes = value.data;
        $mdDialog.show({
          contentElement: '#myDialog',
          parent: angular.element(document.body),
          targetEvent: ev, clickOutsideToClose: false
        });

      })
      .catch(error => {
        console.log('error');
        console.log(error);
      });
    };

    $lCtrl.cerrar = function() {
      $lCtrl.detalleNotificacion = null;
      $mdDialog.hide();
    };


    $lCtrl.filtrar = function() {
      $lCtrl.notificacionesFiltrados = $filter('filter')($lCtrl.notificaciones, $lCtrl.search);
      $lCtrl.paginar();
    };


    $lCtrl.paginar = function() {
      $lCtrl.totalPaginas = Math.ceil($lCtrl.notificacionesFiltrados.length/$lCtrl.registrosXpagina);
    };


    $lCtrl.ordenarPor = function (campo) {
      $lCtrl.reverse = ($lCtrl.propertyName === campo) ? !$lCtrl.reverse : false;
      $lCtrl.propertyName = campo;
    }


    var _validar = {
      causa: {
        presence: {message: "^El campo 'Causa' es requerido"},
      },
      descripcion: {
        presence: {message: "^El campo 'Descripción' es requerido"},
      }
    };

    $lCtrl.listarNotificaciones();
  });
})();
