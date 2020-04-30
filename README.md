# Sistema de notificaciones

## Descripción

Esta Aplicación sirve realizar notificaciones cuando haya un motivo para citar a ciertos usuarios a un puesto de trabajo,
se realizó con el fin de poder alertar al personal sobre una incidencia y que dicha alerta llegue al celular o a un dispositivo
en el cual el usuario regularmente lleve con él, la idea es llevar un control sobre quienes asistieron a la llamada de alerta y en que tiempo,
pudiendo con estos datos realizar reportes de las acciones que lleven a una notificación, las causas y el tiempo de las respuestas que cada persona
tiene.

**Versiónes**

*[Express js ^4.16.1](https://expressjs.com/es/)
---
*[Node js v12.16.1](https://nodejs.org/en/)
---
*[Angular js ^1.7.9](https://code.angularjs.org/1.7.9/docs/api)
---


**Resumen**

La Aplicación permitira alertar correctamente y de manera eficiente al personal en caso de ser necesario.


## Instalación de dependencias.

Para instalar todos las librerías que se requieren para el correcto funcionamiento de la Aplicación, es necesario que despues de descargar el repositorio en Git, en un terminal o CMD se ejecute el siguiente comando dentro de la carpeta contenedora del proyecto:

```
$ npm install
```

## API

### Los web services disponibles son:


1. Usuarios

---
<dl>
  <dt>http://pcalidad.busscar.com.co:3000/usuarios</dt>
  <dd>Llevara a la vista que permite visualizar todos los usuarios creados.</dd>

  <dt>http://pcalidad.busscar.com.co:3000/usuarios/formulario</dt>
    <dd>Llevara a la vista que permite crear un nuevo usuario</dd>
</dl>


2. Centros de trabajo

---
<dl>
  <dt>http://pcalidad.busscar.com.co:3000/centros</dt>
  <dd>Llevara a la vista que permite visualizar todos los centros de trabajo creados.</dd>

  <dt>http://pcalidad.busscar.com.co:3000/centros/formulario</dt>
    <dd>Llevara a la vista que permite crear un nuevo centro de trabajo</dd>
</dl>

3. Notificaciones

---
<dl>
  <dt>http://pcalidad.busscar.com.co:3000/notificaciones</dt>
  <dd>Llevara a la vista que permite visualizar todas las notificaciones creadas.</dd>

  <dt>http://pcalidad.busscar.com.co:3000/notificaciones/formulario</dt>
    <dd>Llevara a la vista que permite crear una nueva notificación</dd>
</dl>


## Technologies
Project is created with:
* Lorem version: 12.3
* Ipsum version: 2.33
* Ament library version: 999


## Contributing

This project welcomes contributions from the community. Contributions are
accepted using GitHub pull requests; for more information, see
[GitHub documentation - Creating a pull request](https://help.github.com/articles/creating-a-pull-request/).

For a good pull request, we ask you provide the following:

1. Include a clear description of your pull request in the description
   with the basic "what" and "why"s for the request.
2. The tests should pass as best as you can. GitHub will automatically run
   the tests as well, to act as a safety net.
3. The pull request should include tests for the change. A new feature should
   have tests for the new feature and bug fixes should include a test that fails
   without the corresponding code change and passes after they are applied.
   The command `npm run test-cov` will generate a `coverage/` folder that
   contains HTML pages of the code coverage, to better understand if everything
   you're adding is being tested.
4. If the pull request is a new feature, please include appropriate documentation
   in the `README.md` file as well.
5. To help ensure that your code is similar in style to the existing code,
   run the command `npm run lint` and fix any displayed issues.

## Contributors

Names of module "owners" (lead developers) and other developers who
have contributed.

## License

Link to the license, with a short description of what it is,
e.g. "MIT" or whatever.  
