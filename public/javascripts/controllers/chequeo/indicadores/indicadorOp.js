(function(){
  'use strict';

  app.controller('indicadorOp', function($scope, $http, $timeout, $mdDialog, ToastFactoria, $filter){
    var $iCtrl = this;

    $iCtrl.init = function() {
      obtenerOps();
    };

    function obtenerOps() {
      $http.get('/chequeo/control/obtener-ops')
      .then(function(result){
        $iCtrl.ops = result.data;
        console.log($iCtrl.ops);
        if (!$iCtrl.ops || !$iCtrl.ops.length) {
          ToastFactoria.rojo({contenido: 'No hay ops conofigurados.'});
        }
      })
      .catch(function(e){
        console.log(e);
      });
    }


    $iCtrl.focoParaBuscar = function() {
      $timeout(function(){
        var campo = angular.element('.campo-busqueda');
        campo.focus();
      }, 500);
    };


    $iCtrl.buscar = function(ev) {
        ev.stopPropagation();
    };



    $iCtrl.obtenerDatos = function() {
      let fechaInicio = moment($iCtrl.fechaInicio).format('YYYY-MM-DD') , fechaFin = moment($iCtrl.fechaFin).format('YYYY-MM-DD') ;
      let url = `/chequeo/control/obtener-grafica?op=${$iCtrl.op}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
      $http.get(url)
      .then(function(result){
        $iCtrl.defectos = result.data[0];
        graficar($iCtrl.defectos, "chartdiv");
      })
      .catch(function(e){
        console.log(e);
      });
    };



    $iCtrl.graficaOperacion = function(defecto, index) {
      var id = 'grafica' + index;
      let fechaInicio = moment($iCtrl.fechaInicio).format('YYYY-MM-DD') , fechaFin = moment($iCtrl.fechaFin).format('YYYY-MM-DD') ;
      let url = `/chequeo/control/obtener-grafica-defectos/${defecto.id}?op=${$iCtrl.op}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
      $http.get(url)
      .then(function(result){
        graficar(result.data, id);
      })
      .catch(function(e){
        console.log(e);
      });
    };



    function graficar(data, divId) {
      am4core.ready(function() {

      // Themes begin
      am4core.useTheme(am4themes_dataviz);
      am4core.useTheme(am4themes_animated);
      // Themes end

      // Create chart instance
      var chart = am4core.create(divId, am4charts.XYChart);
      chart.scrollbarX = new am4core.Scrollbar();

      chart.data = data;
      // Create axes
      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "nombre";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 30;
      categoryAxis.renderer.labels.template.horizontalCenter = "right";
      categoryAxis.renderer.labels.template.verticalCenter = "middle";
      categoryAxis.renderer.labels.template.rotation = 270;
      categoryAxis.tooltip.disabled = true;
      categoryAxis.renderer.minHeight = 110;

      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.minWidth = 50;

      // Create series
      var series = chart.series.push(new am4charts.ColumnSeries());
      series.sequencedInterpolation = true;
      series.dataFields.valueY = "defectos";
      series.dataFields.categoryX = "nombre";
      series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
      series.columns.template.strokeWidth = 0;

      series.tooltip.pointerOrientation = "vertical";

      series.columns.template.column.cornerRadiusTopLeft = 10;
      series.columns.template.column.cornerRadiusTopRight = 10;
      series.columns.template.column.fillOpacity = 0.8;

      var labelBullet = series.bullets.push(new am4charts.LabelBullet());
      labelBullet.label.verticalCenter = "bottom";
      labelBullet.label.dy = -10;
      labelBullet.label.text = "{values.valueY.workingValue.formatNumber('#.')}";
      // on hover, make corner radiuses bigger
      var hoverState = series.columns.template.column.states.create("hover");
      hoverState.properties.cornerRadiusTopLeft = 0;
      hoverState.properties.cornerRadiusTopRight = 0;
      hoverState.properties.fillOpacity = 1;



      series.columns.template.adapter.add("fill", function(fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
      });

      // Cursor
      chart.cursor = new am4charts.XYCursor();

      }); // end am4core.ready()
    };

    $iCtrl.init();


  });
})();
