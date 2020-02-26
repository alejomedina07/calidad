var MENU = {
  produccion: {
    nombre: "Producción",
    enlace: null,
    icono: "trending_up",
    permiso: 'produccion',
    tipo: 'get',
    submenu: {
      procesos: {
        nombre: "Procesos",
        enlace: "inicio.migasDePan.proceso",
        icono: "person_pin_circle",
        permiso: 'produccion.proceso',
        tipo: 'get',
        submenu: {
          crear: {
            nombre: "Crear proceso",
            enlace: "inicio.migasDePan.proceso.crear",
            icono: "add",
            evento: null,
            permiso: 'produccion.proceso.crear',
            tipo: 'get',
          },
          listado: {
            nombre: "Listado de procesos",
            enlace: "inicio.migasDePan.proceso",
            icono: "format_list_bulleted",
            evento: null,
            permiso: 'produccion.proceso.listar',
            tipo: 'get',
          }
        }
      },
      gestionarProduccion: {
        nombre: "Gestionar producción",
        enlace: "inicio.migasDePan.gestionarProduccion",
        enlaceCorte: "inicio.migasDePan.gestionarProduccion.crearCorte",
        icono: "add_box",
        permiso: 'produccion.gestionarProduccion',
        tipo: 'get',
        submenu: {
          crear: {
            nombre: "Crear gestión de producción",
            enlace: "inicio.migasDePan.gestionarProduccion.crear",
            icono: "add",
            evento: null,
            permiso: 'produccion.gestionarProduccion.crear',
            tipo: 'get',
          },
          listado: {
            nombre: "Listado de gestión de producción",
            enlace: "inicio.migasDePan.gestionarProduccion",
            icono: "format_list_bulleted",
            evento: null,
            permiso: 'produccion.gestionarProduccion.listar',
            tipo: 'get',
          }
        }
      },
      pronosticos: {
        nombre: "Historicos de venta",
        enlace: "inicio.migasDePan.pronostico",
        icono: "pie_chart_outlined",
        permiso: 'produccion.pronostico',
        tipo: 'get',
        submenu: {
          crear: {
            nombre: "Crear histórico de venta",
            enlace: "inicio.migasDePan.pronostico.crear",
            icono: "add",
            evento: null,
            permiso: 'produccion.pronostico.crear',
            tipo: 'get',
          },
          listado: {
            nombre: "Listado de histórico de venta",
            enlace: "inicio.migasDePan.pronostico",
            icono: "format_list_bulleted",
            evento: null,
            permiso: 'produccion.pronostico.listar',
            tipo: 'get',
          }
        }
      },
      ordenDeCompra: {
        nombre: "Ordenes De Compra",
        enlace: "inicio.migasDePan.ordenDeCompra",
        icono: "assignment",
        permiso: 'produccion.ordenDeCompra',
        tipo: 'get',
        submenu: {
          crear: {
            nombre: "Crear Orden de Compra",
            enlace: "inicio.migasDePan.ordenDeCompra.crear",
            icono: "add",
            evento: null,
            permiso: 'produccion.ordenDeCompra.crear',
            tipo: 'get',
          },
          listado: {
            nombre: "Listado de ordenes de compra",
            enlace: "inicio.migasDePan.ordenDeCompra",
            icono: "format_list_bulleted",
            evento: null,
            permiso: 'produccion.ordenDeCompra.listar',
            tipo: 'get',
          }
        }
      },
      lineasDeProduccion: {
        nombre: "Líneas de producción",
        enlace: "inicio.migasDePan.lineaDeProduccion",
        icono: "timeline",
        permiso: 'produccion.lineasDeProduccion',
        tipo: 'get',
        submenu: {
          crear: {
            nombre: "Crear línea de producción",
            enlace: "inicio.migasDePan.lineaDeProduccion.crear",
            icono: "add",
            evento: null,
            permiso: 'produccion.lineasDeProduccion.crear',
            tipo: 'get',
          },
          listado: {
            nombre: "Listado de líneas de producción",
            enlace: "inicio.migasDePan.lineaDeProduccion",
            icono: "format_list_bulleted",
            evento: null,
            permiso: 'produccion.lineasDeProduccion.listar',
            tipo: 'get',
          }
        }
      },
      materiaPrima: {
        nombre: "Materia prima",
        enlace: "inicio.migasDePan.materiaPrima",
        icono: "format_color_fill",
        permiso: 'produccion.materiaPrima',
        tipo: 'get',
        submenu: {
          crear: {
            nombre: "Crear materia prima",
            enlace: "inicio.migasDePan.materiaPrima.crear",
            icono: "add",
            evento: null,
            permiso: 'produccion.materiaPrima.crear',
            tipo: 'get',
          },
          listado: {
            nombre: "Listado de materias primas",
            enlace: "inicio.migasDePan.materiaPrima",
            icono: "format_list_bulleted",
            evento: null,
            permiso: 'produccion.materiaPrima.listar',
            tipo: 'get',
          }
        }
      },
      items: {
        nombre: "Items",
        enlace: "inicio.migasDePan.item",
        icono: "extension",
        permiso: 'produccion.Items',
        tipo: 'get',
        submenu: {
          crear: {
            nombre: "Crear item",
            enlace: "inicio.migasDePan.item.crear",
            icono: "add",
            evento: null,
            permiso: 'produccion.Items.crear',
            tipo: 'get',
          },
          listado: {
            nombre: "Listado de items",
            enlace: "inicio.migasDePan.item",
            icono: "format_list_bulleted",
            evento: null,
            permiso: 'produccion.Items.listar',
            tipo: 'get',
          }
        }
      },
      tarea: {
        nombre: "Tareas",
        enlace: "inicio.migasDePan.tarea",
        icono: "transfer_within_a_station",
        permiso: 'produccion.tareas',
        tipo: 'get',
        submenu: {
          gestion: {
            nombre: "Crear tarea",
            enlace: "inicio.migasDePan.tarea",
            icono: "add",
            evento: null,
            permiso: 'produccion.tareas.crear',
            tipo: 'get',
          },
          listado: {
            nombre: "Listado de tareas",
            enlace: "inicio.migasDePan.tarea",
            icono: "format_list_bulleted",
            evento: null,
            permiso: 'produccion.tareas.listar',
            tipo: 'get',
          }
        }
      },
    }
  },
  mantenimientoYDesarrollo: {
    nombre: "Mantenimiento y Desarrollo",
    enlace: null,
    icono: "widgets",
    permiso: 'mantenimientoYDesarrollo',
    tipo: 'get',
    submenu: {
      maquinas: {
        nombre: "Máquinas",
        enlace: "inicio.migasDePan.maquina",
        icono: "settings",
        permiso: 'mantenimientoYDesarrollo.maquina',
        tipo: 'get',
        submenu: {
          crear: {
            nombre: "Crear máquina",
            enlace: "inicio.migasDePan.maquina.crear",
            icono: "add",
            evento: null,
            permiso: 'mantenimientoYDesarrollo.maquina.crear',
            tipo: 'get',
          },
          listado: {
            nombre: "Listado de máquinas",
            enlace: "inicio.migasDePan.maquina",
            icono: "format_list_bulleted",
            evento: null,
            permiso: 'mantenimientoYDesarrollo.maquina.listar',
            tipo: 'get',
          }
        }
      },
      mantenimientos: {
        nombre: "Mantenimientos",
        enlace: "inicio.migasDePan.mantenimiento",
        icono: "build",
        permiso: 'mantenimientoYDesarrollo.mantenimientos',
        tipo: 'get',
        submenu: {
          gestion: {
            nombre: "Crear mantenimiento",
            enlace: "inicio.migasDePan.mantenimiento",
            icono: "add",
            evento: "gestionMantenimiento",
            permiso: 'mantenimientoYDesarrollo.mantenimientos.crear',
            tipo: 'get',
          },
          listado: {
            nombre: "Listado de mantenimientos",
            enlace: "inicio.migasDePan.mantenimiento",
            icono: "format_list_bulleted",
            evento: null,
            permiso: 'mantenimientoYDesarrollo.mantenimientos.listar',
            tipo: 'get',
          }
        }
      },
      control: {
        nombre: "Control",
        enlace: "inicio.migasDePan.maquina.control",
        icono: "list",
        permiso: 'mantenimientoYDesarrollo.puestaEnMarcha.control',
        tipo: 'get',
        submenu: {
          gestion: {
            nombre: "Crear control",
            enlace: "inicio.migasDePan.maquina.control.crear",
            icono: "add",
            evento: null,
            permiso: 'mantenimientoYDesarrollo.puestaEnMarcha.control.crear',
            tipo: 'get',
          },
          listado: {
            nombre: "Listado de control",
            enlace: "inicio.migasDePan.maquina.control",
            icono: "format_list_bulleted",
            evento: null,
            permiso: 'mantenimientoYDesarrollo.puestaEnMarcha.control.listar',
            tipo: 'get',
          }
        }
      },
      puestaEnMarcha: {
        nombre: "Puesta en marcha",
        enlace: "inicio.migasDePan.maquina.puestaEnMarcha",
        icono: "whatshot",
        permiso: 'mantenimientoYDesarrollo.puestaEnMarcha',
        tipo: 'get',
        submenu: {
          gestion: {
            nombre: "Crear puesta en marcha",
            enlace: "inicio.migasDePan.maquina.puestaEnMarcha.crear",
            icono: "add",
            evento: null,
            permiso: 'mantenimientoYDesarrollo.puestaEnMarcha.crear',
            tipo: 'get',
          },
          listado: {
            nombre: "Listado de puesta en marcha",
            enlace: "inicio.migasDePan.maquina.puestaEnMarcha",
            icono: "format_list_bulleted",
            evento: null,
            permiso: 'mantenimientoYDesarrollo.puestaEnMarcha.listar',
            tipo: 'get',
          }
        }
      },
    }
  },
  gestionHumana: {
    nombre: "Gestión Humana",
    enlace: null,
    icono: "supervisor_account",
    permiso: 'gestionHumana',
    tipo: 'get',
    submenu: {
      usuarios: {
        nombre: "Usuarios",
        enlace: "inicio.migasDePan.usuario",
        icono: "person",
        permiso: 'gestionHumana.usuarios',
        tipo: 'get',
        submenu: {
          crear: {
            nombre: "Crear usuario",
            enlace: "inicio.migasDePan.usuario.crear",
            icono: "add",
            evento: null,
            permiso: 'gestionHumana.usuarios.crear',
            tipo: 'get',
          },
          listado: {
            nombre: "Listado de usuarios",
            enlace: "inicio.migasDePan.usuario",
            icono: "format_list_bulleted",
            evento: null,
            permiso: 'gestionHumana.usuarios.listar',
            tipo: 'get',
          }
        }
      },
      notificaciones: {
        nombre: "Notificaciones",
        enlace: "inicio.migasDePan.notificacion",
        icono: "add_alert",
        permiso: 'gestionHumana.notificaciones',
        tipo: 'get',
        submenu: {
          gestion: {
            nombre: "Crear notificación",
            enlace: "inicio.migasDePan.notificacion",
            icono: "add",
            evento: "gestionNotificacion",
            permiso: 'gestionHumana.notificaciones.crear',
            tipo: 'get',
          },
          listado: {
            nombre: "Listado de notificaciones",
            enlace: "inicio.migasDePan.notificacion",
            icono: "format_list_bulleted",
            evento: null,
            permiso: 'gestionHumana.notificaciones.listar',
            tipo: 'get',
          }
        }
      },
      seguimiento: {
        nombre: "Seguimiento",
        enlace: "inicio.migasDePan.seguimiento",
        icono: "remove_red_eye",
        permiso: 'gestionHumana.seguimiento',
        tipo: 'get',
        submenu: {
          listado: {
            nombre: "Listado de seguimientos",
            enlace: "inicio.migasDePan.seguimiento",
            icono: "format_list_bulleted",
            evento: null,
            permiso: 'gestionHumana.seguimiento.listar',
            tipo: 'get',
          }
        }
      },
    }
  },
  clientes: {
    nombre: "Seguimiento de clientes",
    enlace: null,
    icono: "work",
    permiso: 'clientes',
    tipo: 'get',
    submenu: {
      clientes: {
        nombre: "Clientes",
        enlace: "inicio.migasDePan.cliente",
        icono: "person",
        permiso: 'clientes.clientes',
        tipo: 'get',
        submenu: {
          crear: {
            nombre: "Crear cliente",
            enlace: "inicio.migasDePan.cliente.crear",
            icono: "add",
            evento: null,
            permiso: 'clientes.clientes.crear',
            tipo: 'get',
          },
          listado: {
            nombre: "Listado de clientes",
            enlace: "inicio.migasDePan.cliente",
            icono: "format_list_bulleted",
            evento: null,
            permiso: 'clientes.clientes.listar',
            tipo: 'get',
          }
        }
      },
      clienteSeguimiento: {
        nombre: "Seguimientos",
        enlace: "inicio.migasDePan.cliente.seguimientoCliente",
        icono: "contact_phone",
        permiso: 'seguimiento.cliente',
        tipo: 'get',
        submenu: {
          crear: {
            nombre: "Crear seguimiento",
            enlace: "inicio.migasDePan.cliente.seguimientoCliente.crear",
            icono: "add",
            evento: null,
            permiso: 'seguimiento.cliente.crear',
            tipo: 'get',
          },
          listado: {
            nombre: "Listado de seguimientos de clientes",
            enlace: "inicio.migasDePan.cliente.seguimientoCliente",
            icono: "format_list_bulleted",
            evento: null,
            permiso: 'seguimiento.cliente.listar',
            tipo: 'get',
          }
        }
      },
      pedido: {
        nombre: "Orden de venta",
        enlace: "inicio.migasDePan.pedido",
        icono: "library_books",
        permiso: 'pedido',
        tipo: 'get',
        submenu: {
          crear: {
            nombre: "Crear Orden de venta",
            enlace: "inicio.migasDePan.pedido.crear",
            icono: "add",
            evento: null,
            permiso: 'pedido.crear',
            tipo: 'get',
          },
          listado: {
            nombre: "Listado de Ordenes de venta",
            enlace: "inicio.migasDePan.pedido",
            icono: "format_list_bulleted",
            evento: null,
            permiso: 'pedido.listar',
            tipo: 'get',
          }
        }
      },
    }
  },
  configuracion: {
    nombre: "Configuración",
    enlace: null,
    icono: "new_releases",
    permiso: 'configuracion',
    tipo: 'get',
    submenu: {
      // operacion: {
      //   nombre: "Operaciones",
      //   enlace: "inicio.migasDePan.configuracion.permiso.crear",
      //   parametros: {
      //     opcion: 'operacion'
      //   },
      //   permiso: 'configuracion.operacion.listar',
      //   icono: "panorama_fish_eye",
      //   tipo: 'get',
      // },
      // tarea: {
      //   nombre: "Tareas",
      //   enlace: "inicio.migasDePan.configuracion.permiso.crear",
      //   parametros: {
      //     opcion: 'tarea'
      //   },
      //   permiso: 'configuracion.tarea.listar',
      //   icono: "group_work",
      //   tipo: 'get',
      // },
      permisos: {
        nombre: "Permisos",
        enlace: "inicio.migasDePan.configuracion.permiso.crear",
        parametros: {
          opcion: 'perfil'
        },
        icono: "group",
        permiso: 'configuracion.perfil.listar',
        tipo: 'get',
      },
      menu: {
        nombre: "Menus",
        enlace: "inicio.migasDePan.menu",
        icono: "reorder",
        permiso: 'configuracion.menu',
        tipo: 'get',
        submenu: {
          crear: {
            nombre: "Crear menu",
            enlace: "inicio.migasDePan.menu.crear",
            icono: "add",
            evento: null,
            permiso: 'configuracion.menu.crear',
            tipo: 'get',
          },
          listado: {
            nombre: "Listado de menus",
            enlace: "inicio.migasDePan.menu",
            icono: "format_list_bulleted",
            evento: null,
            permiso: 'configuracion.menu.listar',
            tipo: 'get',
          }
        }
      },
      calendario: {
        nombre: "Calendario",
        enlace: "inicio.migasDePan.calendario",
        icono: "event",
        permiso: 'configuracion.calendario',
        tipo: 'get',
      },
      plantilla: {
        nombre: "Plantillas",
        enlace: "inicio.migasDePan.plantilla",
        icono: "filter_none",
        permiso: 'configuracion.plantillas',
        tipo: 'get',
        submenu: {
          gestion: {
            nombre: "Crear plantilla",
            enlace: "inicio.migasDePan.plantilla",
            icono: "add",
            evento: "gestionPlantilla",
            permiso: 'configuracion.plantillas.crear',
            tipo: 'get',
          },
          listado: {
            nombre: "Listado de plantillas",
            enlace: "inicio.migasDePan.plantilla",
            icono: "format_list_bulleted",
            evento: null,
            permiso: 'gestionHumana.plantillas.listar',
            tipo: 'get',
          }
        }
      },
      categorias: {
        nombre: "Categorias",
        enlace: "inicio.migasDePan.categoria",
        icono: "attachment",
        permiso: 'configuracion.categorias',
        tipo: 'get',
        submenu: {
          crear: {
            nombre: "Crear categoria",
            enlace: "inicio.migasDePan.categoria",
            icono: "add",
            evento: "gestionCategoria",
            permiso: 'configuracion.categorias.crear',
            tipo: 'get',
          },
          listado: {
            nombre: "Listado de categorias",
            enlace: "inicio.migasDePan.categoria",
            icono: "format_list_bulleted",
            evento: null,
            permiso: 'gestionHumana.categorias.listar',
            tipo: 'get',
          }
        }
      },
    }
  }
};

(function(){
  'use strict';

  app.controller('header', ['$scope', '$rootScope', '$mdSidenav', '$mdDialog', function($scope, $rootScope, $mdSidenav, $mdDialog){
    var $cCtr = this;
    $cCtr.MENU = MENU;



    $cCtr.actualizar = function() {
     // $state.reload();
    };

    $cCtr.abrirMenuIzquierda = function() {
     $mdSidenav('left').toggle();
    };

    $cCtr.abrirMenuDerecha = function() {
     $mdSidenav('right').toggle();
    };


    $cCtr.$onInit = function() {
      // if (InicioDeSesionFactoria.usuarioConectado()) {
      //   $cCtr.usuarioConectado = InicioDeSesionFactoria.obtenerUsuarioConectado();
      //   $cCtr.estructuraMenu = MenuFactoria.cargarOpcionesEstructuradas($cCtr.usuarioConectado.atributos.menu);
      // }
    };

    // $cCtr.cerrarSesion = function() {
    //  InicioDeSesionFactoria.cerrarSesion();
    // };

    // $cCtr.enLinea = $rootScope.enLinea;
    // var dialogoMostrado = false;
    // $rootScope.$watch('enLinea', function(nuevoEstado, viejoEstado) {
    //   if(nuevoEstado == viejoEstado)
    //     return;
    //   $cCtr.enLinea = nuevoEstado;
    //   if(nuevoEstado){
    //     DialogoFactoria.cerrar();
    //     dialogoMostrado = false;
    //   }else{
    //     if (!dialogoMostrado) {
    //       DialogoFactoria.rojo({
    //         titulo: "Internet fuera de línea",
    //         contenido: "<div layout='row' layout-sm='column' layout-xs='column' layout-align='center center'> <div flex='30' flex-sm='100' flex-xs='100'> <center> <i class='material-icons color-rojo md-60'>error</i> </center> </div> <div flex='70' flex-sm='100' flex-xs='100'> <h4>Verifica tu conexión para continuar</h4> </div> </div>",
    //         cerrarConEscape: false,
    //         cerrarConClickAfuera: false,
    //         botonSuperiorCerrar: false,
    //         controller: function($timeout) {
    //           var $rCtr = this;
    //         },
    //         controllerAs: '$rCtr',
    //         botones: []
    //       });
    //     }
    //     dialogoMostrado = true;
    //   }
    // });
    //
    // var cantidadDeNotificaciones = 0, cantidadDeTareas = 0, cantidadDeClientesSeguimiento = 0, cantidadDeMantenimientos = 0;
    // // $rootScope.cantidades = {notificaciones: 0, tareas: 0, mantenimientos: 0, seguimientoClientes: 0};
    //
    // $rootScope.$on('cantidadDeNotificaciones', function($event, data) {
    //   // $rootScope.cantidades.notificaciones = data || 0;
    //   cantidadDeNotificaciones = data || 0;
    // });
    // $rootScope.$on('cantidadDeTareas', function($event, data) {
    //   // $rootScope.cantidades.tareas = data || 0;
    //   cantidadDeTareas = data || 0;
    // });
    // $rootScope.$on('cantidadDeClientesSeguimiento', function($event, data) {
    //   // $rootScope.cantidades.seguimientoClientes = data || 0;
    //   cantidadDeClientesSeguimiento = data || 0;
    // });
    // $rootScope.$on('cantidadDeMantenimientos', function($event, data) {
    //   // $rootScope.cantidades.mantenimientos = data || 0;
    //   cantidadDeMantenimientos = data || 0;
    // });

    // $rootScope.$watch('cantidades', function(nuevasCantidades, viejasCantidades) {
    //   console.log("entra");
    //   // if(nuevasCantidades == viejasCantidades)
    //   //   return;
    //   // $cCtr.cantidadDeNotificacionesGenerales = Object.values(nuevasCantidades).reduce(function(valorAnterior, valorActual){
    //   //   return valorAnterior + valorActual;
    //   // });
    // });

    // calcularCantidadDeNotificaciones();
    // $rootScope.$on('actualizarNotificaciones', function($event) {
    //   calcularCantidadDeNotificaciones();
    // });
    //
    // function calcularCantidadDeNotificaciones(){
    //   $timeout(function(){
    //     try {
    //       var resultado = Number(cantidadDeNotificaciones) + Number(cantidadDeTareas) + Number(cantidadDeMantenimientos) + Number(cantidadDeClientesSeguimiento);
    //       if (resultado >= 0)
    //         $cCtr.cantidadDeNotificacionesGenerales = resultado;
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }, 3000);
    // }
    //
    //
    // $rootScope.direccionarScroll = function(elemento) {
    //   $location.hash(elemento);
    //   $anchorScroll();
    // };


  }]);
})();
