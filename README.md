# Incidencias LM

Frontend de registro de incidencias para Pan de Tata, basado visualmente en
`GESTION_TIENDA` y conectado a Google Sheets mediante Google Apps Script.

## Modulos actuales

- `ERROR EN SERVICIO (BARRA)`
- `CONSUMO INTERNO`
- `MALA MANIPULACION (COCINA)`
- `DESPERDICIO PERECEDERO (VEGETALES)`
- `MERMA DE PAN (COCINA)`
- `AREA CAFE`

Los modulos originales capturan `FECHA`, `PRODUCTO`, `RESPONSABLE` y `TURNO`.
`ERROR EN SERVICIO`, `CONSUMO INTERNO` y `MALA MANIPULACION` tambien capturan
`CANTIDAD`. `CONSUMO INTERNO` captura `OBSERVACIONES`.
`DESPERDICIO PERECEDERO (VEGETALES)` tambien captura `CANTIDAD` y
`OBSERVACIONES`.
`AREA CAFE` captura el peso del producto seleccionado, el peso tostado y la
merma del tueste. Los tres valores aceptan decimales y se guardan en kg.

## Archivos

- `index.html`, `styles.css`, `script.js`: interfaz web.
- `logopandetata.png`: logo mostrado en la esquina superior izquierda.
- `Code.gs`: backend para Google Apps Script.
- `appsscript.json`: manifiesto opcional de Apps Script.
- `config.js`: URL del Web App una vez desplegado.
- `api/apps-script.js`: proxy para desplegar el frontend en Vercel.

## Hojas esperadas

El backend escribe en pestañas del spreadsheet con estos nombres:

- `ERROR EN SERVICIO (BARRA)`
- `CONSUMO INTERNO`
- `MALA MANIPULACION (COCINA)`
- `DESPERDICIO PERECEDERO (VEG)`
- `MERMA DE PAN (COCINA)`
- `AREA CAFE`

La hoja `AREA CAFE` se crea con estos encabezados:

```text
FECHA | PRODUCTO | PRODUCTO SELECCIONADO | TOSTADO | MERMA DEL TUESTE | RESPONSABLE | TURNO
```

Tambien se crea `PRODUCTOS AREA CAFE`, que funciona como catalogo editable:

```text
PRODUCTO | PRESENTACION KG
```

Inicialmente contiene `GRANO VERDE MERIDA`, `GRANO VERDE TACHIRA` y
`GRANO VERDE TRUJILLO`, todos con una presentacion de `10 KG`.

Cada hoja debe tener los encabezados en este orden:

```text
FECHA | PRODUCTO | RESPONSABLE | TURNO | PRECIO UNITARIO | COSTO PERDIDA
```

La hoja `CONSUMO INTERNO` debe tener estos encabezados:

```text
FECHA | PRODUCTO | CANTIDAD | RESPONSABLE | TURNO | OBSERVACIONES | MONTO | COSTO PERDIDA
```

El formulario no usa lista de incidencias en este modulo.
El backend completa `MONTO` desde `PRECIOS PRODUCTOS` y calcula
`COSTO PERDIDA` automaticamente.

La hoja `DESPERDICIO PERECEDERO (VEG)` debe tener estos encabezados:

```text
FECHA | PRODUCTO | CANTIDAD | RESPONSABLE | TURNO | OBSERVACIONES | PRECIO POR KG | COSTO PERDIDA
```

El costo perdido se calcula multiplicando el precio por kg por la cantidad.

Las hojas `ERROR EN SERVICIO (BARRA)` y `MALA MANIPULACION (COCINA)` deben
ubicar `CANTIDAD` a la derecha de `PRODUCTO`:

```text
FECHA | PRODUCTO | CANTIDAD | RESPONSABLE | TURNO | LISTA DE INCIDENCIAS | OBSERVACIONES | PRECIO UNITARIO | COSTO PERDIDA
```

La hoja `CONSUMO INTERNO` tambien ubica `CANTIDAD` a la derecha de `PRODUCTO`:

```text
FECHA | PRODUCTO | CANTIDAD | RESPONSABLE | TURNO | OBSERVACIONES | MONTO | COSTO PERDIDA
```

El tercer nombre esta abreviado porque el archivo Excel inicial limita los
nombres de pestañas a 31 caracteres. Si las pestanas en Google Sheets fueron
renombradas, actualiza `CONFIG.sheetNames` en `Code.gs`.


## Visualizacion en Google Sheets

`Code.gs` crea y mantiene una pestana para revisar los registros:

- `VISUALIZACION REGISTROS`: consolida todos los modulos en una sola tabla.

La visualizacion incluye columnas separadas para `PRODUCTO SELECCIONADO (KG)`,
`TOSTADO (KG)` y `MERMA DEL TUESTE (KG)`.

La pestana `RESUMEN REGISTROS` ya no se usa. Si existe, se elimina al refrescar
la visualizacion o al guardar un nuevo registro.

Luego de desplegar Apps Script, abre la URL del Web App con esta accion para crear
las pestanas y encabezados:

```text
https://script.google.com/macros/s/AKfycbyT0rcYJRCamojgQdraHXYRXUpzhYYDaTSu0IDegp1vQYqJhjX7B9RlbJBLbEUq16bV/exec?action=setupSheets
```

Tambien puedes refrescar la visualizacion manualmente con:

```text
https://script.google.com/macros/s/AKfycbyT0rcYJRCamojgQdraHXYRXUpzhYYDaTSu0IDegp1vQYqJhjX7B9RlbJBLbEUq16bV/exec?action=refreshVisualization
```

Cada nuevo registro intenta actualizar automaticamente estas pestanas.

## Despliegue

1. Abre tu proyecto de Google Apps Script y reemplaza `Code.gs` con el archivo
   de este repositorio.
2. `Code.gs` ya apunta al spreadsheet `1Xdjhke-PW-XYDZho3I9AedgfYJmexBi1u6h2UWypIko`.
3. Despliega Apps Script como aplicacion web ejecutada por ti, con acceso para
   cualquier persona con el enlace.
4. Copia la URL terminada en `/exec` y pegala en `config.js`:

```js
window.APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyT0rcYJRCamojgQdraHXYRXUpzhYYDaTSu0IDegp1vQYqJhjX7B9RlbJBLbEUq16bV/exec';
```

5. Publica este frontend en Vercel para habilitar el proxy `/api/apps-script`.
   Deploy actual: `https://incidencias-lm.vercel.app/`.

El endpoint `GET ?action=getCatalogs` retorna los responsables, turnos y
productos leidos desde `PRECIOS PRODUCTOS`. El `POST` con la accion
`guardarIncidencia` valida esos catalogos y agrega una fila en la hoja del
modulo seleccionado.
