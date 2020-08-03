(function(){
  'use strict';

  app.controller('indicadorCentro', function($scope, $http, $timeout, $mdDialog, ToastFactoria, $filter){
    var $iCtrl = this;

    $iCtrl.init = function() {

      obtenerCentros();
    };

    function obtenerCentros() {
      $http.get('/chequeo/control/obtener-centros')
      .then(function(result){
        $iCtrl.centros = result.data;
        console.log($iCtrl.centros);
        if (!$iCtrl.centros || !$iCtrl.centros.length) {
          ToastFactoria.rojo({contenido: 'No hay centros de trabajo conofigurados.'});
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

    $iCtrl.graficaOperacion = function(defecto, index) {
      var id = 'grafica' + index;
      let fechaInicio = moment($iCtrl.fechaInicio).format('YYYY-MM-DD') , fechaFin = moment($iCtrl.fechaFin).format('YYYY-MM-DD') ;
      let url = `/chequeo/control/obtener-grafica-defectos/${defecto.id}?centro=${$iCtrl.centro}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
      $http.get(url)
      .then(function(result){
        graficar(result.data, id);
      })
      .catch(function(e){
        console.log(e);
      });
    };


    $iCtrl.buscar = function(ev) {
        ev.stopPropagation();
    };



    $iCtrl.obtenerDatos = function() {
      let fechaInicio = moment($iCtrl.fechaInicio).format('YYYY-MM-DD') , fechaFin = moment($iCtrl.fechaFin).format('YYYY-MM-DD') ;
      let url = `/chequeo/control/obtener-grafica?centro=${$iCtrl.centro}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
      $http.get(url)
      .then(function(result){
        $iCtrl.defectos = result.data[0];
        $iCtrl.cantidadVehiculos = result.data[3][0].vehiculos;
        $iCtrl.cantidadDefectos = result.data[4][0].defectos;
        $iCtrl.totales =  result.data[1];
        result.data[2].forEach((item, i) => {
          $iCtrl.totales[i].vehiculos = item.vehiculos;
          $iCtrl.totales[i].promedio = $iCtrl.totales[i].defectos/$iCtrl.totales[i].vehiculos;
          // $iCtrl.totales[i].semana = moment().day("Monday").week($iCtrl.totales[i].semana).format('YYYY-MM-DD');
          $iCtrl.totales[i].semana = "Semana " + $iCtrl.totales[i].semana;
        });
        debugger;
        graficar($iCtrl.defectos, "chartdiv");
        graficarTotales($iCtrl.totales, "chartdivTotal");
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

    function graficarTotales(data, divId) {

      am4core.ready(function() {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create(divId, am4charts.XYChart);

        // Add data
        // chart.data = [
        //   {
        //     "date": "2013-01-16",
        //     "market1": 71,
        //     "market2": 75,
        //     "sales1": 5,
        //     "sales2": 8
        //   }, {
        //     "date": "2013-01-17",
        //     "market1": 74,
        //     "market2": 78,
        //     "sales1": 4,
        //     "sales2": 6
        //   }, {
        //     "date": "2013-01-18",
        //     "market1": 78,
        //     "market2": 88,
        //     "sales1": 5,
        //     "sales2": 2
        //   }, {
        //     "date": "2013-01-19",
        //     "market1": 85,
        //     "market2": 89,
        //     "sales1": 8,
        //     "sales2": 9
        //   }, {
        //     "date": "2013-01-20",
        //     "market1": 82,
        //     "market2": 89,
        //     "sales1": 9,
        //     "sales2": 6
        //   }, {
        //     "date": "2013-01-21",
        //     "market1": 83,
        //     "market2": 85,
        //     "sales1": 3,
        //     "sales2": 5
        //   }, {
        //     "date": "2013-01-22",
        //     "market1": 88,
        //     "market2": 92,
        //     "sales1": 5,
        //     "sales2": 7
        //   }, {
        //     "date": "2013-01-23",
        //     "market1": 85,
        //     "market2": 90,
        //     "sales1": 7,
        //     "sales2": 6
        //   }, {
        //     "date": "2013-01-24",
        //     "market1": 85,
        //     "market2": 91,
        //     "sales1": 9,
        //     "sales2": 5
        //   }, {
        //     "date": "2013-01-25",
        //     "market1": 80,
        //     "market2": 84,
        //     "sales1": 5,
        //     "sales2": 8
        //   }, {
        //     "date": "2013-01-26",
        //     "market1": 87,
        //     "market2": 92,
        //     "sales1": 4,
        //     "sales2": 8
        //   }, {
        //     "date": "2013-01-27",
        //     "market1": 84,
        //     "market2": 87,
        //     "sales1": 3,
        //     "sales2": 4
        //   }, {
        //     "date": "2013-01-28",
        //     "market1": 83,
        //     "market2": 88,
        //     "sales1": 5,
        //     "sales2": 7
        //   }, {
        //     "date": "2013-01-29",
        //     "market1": 84,
        //     "market2": 87,
        //     "sales1": 5,
        //     "sales2": 8
        //   }, {
        //     "date": "2013-01-30",
        //     "market1": 81,
        //     "market2": 85,
        //     "sales1": 4,
        //     "sales2": 7
        //   }
        // ];
        chart.data = data;
        // Create axes
        // var dateAxis = chart.xAxes.push(new am4charts.DateAxis());

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "semana";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.labels.template.horizontalCenter = "right";
        categoryAxis.renderer.labels.template.verticalCenter = "middle";
        // categoryAxis.renderer.labels.template.rotation = 270;
        categoryAxis.tooltip.disabled = true;
        categoryAxis.renderer.minHeight = 110;

        //dateAxis.renderer.grid.template.location = 0;
        //dateAxis.renderer.minGridDistance = 30;

        var valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis1.title.text = "Defectos";

        var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis2.title.text = "Promedio";
        valueAxis2.renderer.opposite = true;
        valueAxis2.renderer.grid.template.disabled = true;

        // Create series
        var series1 = chart.series.push(new am4charts.ColumnSeries());
        series1.dataFields.valueY = "defectos";
        series1.dataFields.categoryX = "semana";
        series1.yAxis = valueAxis1;
        series1.name = "Defectos";
        series1.tooltipText = "{name}\n[bold font-size: 20]{valueY}[/]";
        series1.fill = chart.colors.getIndex(0);
        series1.strokeWidth = 0;
        series1.clustered = false;
        series1.columns.template.width = am4core.percent(40);

        var series2 = chart.series.push(new am4charts.ColumnSeries());
        series2.dataFields.valueY = "vehiculos";
        series2.dataFields.categoryX = "semana";
        series2.yAxis = valueAxis1;
        series2.name = "Vehiculos";
        series2.tooltipText = "{name}\n[bold font-size: 20]{valueY}[/]";
        series2.fill = chart.colors.getIndex(0).lighten(0.5);
        series2.strokeWidth = 0;
        series2.clustered = false;
        series2.toBack();

        var series3 = chart.series.push(new am4charts.LineSeries());
        series3.dataFields.valueY = "promedio";
        series3.dataFields.categoryX = "semana";
        series3.name = "Promedio";
        series3.strokeWidth = 2;
        series3.tensionX = 1;
        series3.yAxis = valueAxis2;
        series3.tooltipText = "{name}\n[bold font-size: 20]{valueY}[/]";

        var bullet3 = series3.bullets.push(new am4charts.CircleBullet());
        bullet3.circle.radius = 3;
        bullet3.circle.strokeWidth = 2;
        bullet3.circle.fill = am4core.color("#fff");


        // Add cursor
        chart.cursor = new am4charts.XYCursor();

        // Add legend
        chart.legend = new am4charts.Legend();
        chart.legend.position = "top";

        // Add scrollbar
        chart.scrollbarX = new am4charts.XYChartScrollbar();
        chart.scrollbarX.series.push(series1);
        chart.scrollbarX.series.push(series3);
        chart.scrollbarX.parent = chart.bottomAxesContainer;

      }); // end am4core.ready()
    }


    $iCtrl.init();

  });
})();
