var app = angular.module('calidad', [
  'ngMaterial',
  'ngMessages',
  'ngAnimate',
  'ngAria',
  'ngMaterialSidemenu'
]);



app.config(function() {
  moment.locale('es_co', {
    months : 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
    monthsShort : 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
    monthsParseExact : true,
    weekdays : 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
    weekdaysShort : 'Dom_Lun_Mar_Mie_Jue_Vie_Sab'.split('_'),
    weekdaysMin : 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
      LT : 'hh:mm a',
      LTS : 'HH:mm:ss',
      L : 'DD/MM/YYYY',
      LL : 'D MMMM YYYY',
      ll : 'ddd D, MMM',
      LLL : 'D MMMM YYYY HH:mm',
      LLLL : 'dddd D MMMM YYYY, LT',
      LLLA : 'D MMMM YYYY HH:mm A',
    },
    calendar : {
      sameDay : '[Aujourd’hui à] LT',
      nextDay : '[Demain à] LT',
      nextWeek : 'dddd [à] LT',
      lastDay : '[Hier à] LT',
      lastWeek : 'dddd [dernier à] LT',
      sameElse : 'L'
    },
    relativeTime : {
      future : 'dans %s',
      past : 'il y a %s',
      s : 'quelques secondes',
      m : 'une minute',
      mm : '%d minutes',
      h : 'une heure',
      hh : '%d heures',
      d : 'un jour',
      dd : '%d jours',
      M : 'un mois',
      MM : '%d mois',
      y : 'un an',
      yy : '%d ans'
    },
    dayOfMonthOrdinalParse : /\d{1,2}(er|e)/,
    ordinal : function (number) {
      return number + (number === 1 ? 'er' : 'e');
    },
    meridiemParse : /AM|PM/,
    isPM : function (input) {
      return input.charAt(0) === 'M';
    },
    // In case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example).
    // meridiemHour : function (hour, meridiem) {
      //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
      // },
      meridiem : function (hours, minutes, isLower) {
        return hours < 12 ? 'AM' : 'PM';
      },
      week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
      }
    });
});
