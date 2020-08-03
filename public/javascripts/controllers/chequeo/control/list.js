(function(){
  'use strict';

  app.controller('listControl', function($scope, $http, $timeout, $mdDialog, ToastFactoria, $filter){
    var $cCtrl = this;
    $cCtrl.pagina = 0;
    $cCtrl.idEliminar = 0;
    $cCtrl.registrosXpagina = 10;
    $cCtrl.filtros = {};




    $cCtrl.listarCentros = function () {
      $cCtrl.loading = true;
      $http.get('/chequeo/control/listar')
      .then(function(result){
        $cCtrl.registros = result.data;
        $cCtrl.registrosFiltrados = $cCtrl.registros;
        $cCtrl.paginar();
        $cCtrl.loading = false;
      })
      .catch(function(e){
        $cCtrl.loading = false;
        console.log(e);
      });
    };

    $cCtrl.categoriaAnterior = '';
    $cCtrl.validarCategoria = function (item) {
      if ($cCtrl.categoriaAnterior != item.categoria) {
        $cCtrl.categoriaAnterior = item.categoria;
        return true;
      }else {
        return false;
      }
    };


    $cCtrl.exportar = function(chequeo) {
      console.log(chequeo);
      $cCtrl.registroPdf = chequeo;
      // $http.get('/chequeo/control/obtener-para-pdf')
      let url = `/chequeo/control/operaciones-pdf/${chequeo.id}`
      $http.get(url)
      .then(function(result){
        $cCtrl.registroPdf.operaciones = result.data;
        // debugger;
        $timeout(function(){
          // generarPdf();
          generate();
        }, 500);
      })
      .catch(function(e){
        $cCtrl.loading = false;
        console.log(e);
      });

      function generarPdf() {
        var pdf = new jsPDF('p', 'pt', 'letter');
        var source = $('#customers')[0];
        var specialElementHandlers = {
            '#bypassme': function (element, renderer) {
                return true
            }
        };
        var margins = {
            top: 80,
            bottom: 60,
            left: 10,
            width: 700
        };
        pdf.fromHTML(
        source, // HTML string or DOM elem ref.
        margins.left, // x coord
        margins.top, { // y coord
            'width': margins.width, // max width of content on PDF
            'elementHandlers': specialElementHandlers
        },

        function (dispose) {
          let nombre = `Chequo-${$cCtrl.registroPdf.id}.pdf`
          pdf.save(nombre);
        }, margins);
      }

      function generate() {

        var doc = new jsPDF('p', 'pt');

        var res = doc.autoTableHtmlToJson(document.getElementById("basic-table"));
        // doc.autoTable(res.columns, res.data, {margin: {top: 150}});

        var header = function(data) {
          doc.setFontSize(12);
          doc.setTextColor(40);
          doc.setFontStyle('normal');
          //doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
          let titulo = `Orden de Producción : ${$cCtrl.registroPdf.nombre_op} Carrocería : ${$cCtrl.registroPdf.carroceria} \nChasis : ${$cCtrl.registroPdf.chasis} \nCentro de trabajo: ${$cCtrl.registroPdf.centro} \nEstado : ${$cCtrl.registroPdf.estado} \nObservacion : ${$cCtrl.registroPdf.observacion}\nAuditor : ${$cCtrl.registroPdf.auditor}`
          doc.text(titulo, data.settings.margin.left, 50);
        };

        var options = {
          beforePageContent: header,
          styles: {
              halign: 'center'
          },
          columnStyles:{
            0:{halign:'left'},
            1:{halign:'left'}
          },
          margin: {
            top: 150
          },
          // startY: doc.autoTableEndPosY() + 20

        };

        doc.autoTable(res.columns, res.data, options);

        doc.save("table.pdf");
      }

    };


    $cCtrl.filtrar = function() {
      $cCtrl.registrosFiltrados = $filter('filter')($cCtrl.registros, $cCtrl.search);
      $cCtrl.paginar();
    };


    $cCtrl.paginar = function() {
      $cCtrl.totalPaginas = Math.ceil($cCtrl.registrosFiltrados.length/$cCtrl.registrosXpagina);
    };


    $cCtrl.ordenarPor = function (campo) {
      $cCtrl.reverse = ($cCtrl.propertyName === campo) ? !$cCtrl.reverse : false;
      $cCtrl.propertyName = campo;
    }


    $cCtrl.obtenerLinea = function (linea) {
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

    $cCtrl.listarCentros();



  });
})();
