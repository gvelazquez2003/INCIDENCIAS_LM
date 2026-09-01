# Preparacion de Google Apps Script

## Configuracion requerida

`Code.gs` ya esta configurado con el ID del Google Sheet de LM:

```js
spreadsheetId: '1Xdjhke-PW-XYDZho3I9AedgfYJmexBi1u6h2UWypIko',
```

Los productos y precios se leen desde la hoja `PRECIOS PRODUCTOS`.
Los productos del modulo `AREA CAFE` se leen desde `PRODUCTOS AREA CAFE`, que
se crea automaticamente con los tres granos y su presentacion de `10 KG`.

## Prueba de envio

1. Crea el despliegue web de Apps Script y selecciona acceso mediante enlace.
2. Coloca la URL `/exec` del despliegue en `config.js`.
3. Despliega el frontend en Vercel.
4. Registra una incidencia desde cada modulo.
5. Comprueba que cada fila aparece en la pestana que corresponde.

Cada cambio de `Code.gs` requiere crear una nueva version del despliegue web en
Apps Script. Reemplaza `Code.gs` y actualiza el despliegue antes de probar
nuevamente.

Despues de desplegar esta version, abre una vez la URL `/exec` con
`?action=setupSheets`. Esto crea `AREA CAFE`, `PRODUCTOS AREA CAFE` y actualiza
los encabezados de `VISUALIZACION REGISTROS`.

La pestana `AREA CAFE` usa estos encabezados:

```text
FECHA | PRODUCTO | PRODUCTO SELECCIONADO | TOSTADO | MERMA DEL TUESTE | RESPONSABLE | TURNO
```

La pestana `CONSUMO INTERNO` debe existir con estos encabezados:

```text
FECHA | PRODUCTO | CANTIDAD | RESPONSABLE | TURNO | OBSERVACIONES | MONTO | COSTO PERDIDA
```

El formulario no usa lista de incidencias en este modulo.
`Code.gs` completa `MONTO` desde `PRECIOS PRODUCTOS` y calcula
`COSTO PERDIDA` automaticamente.

La pestana `DESPERDICIO PERECEDERO (VEG)` debe incluir cantidad:

```text
FECHA | PRODUCTO | CANTIDAD | RESPONSABLE | TURNO | OBSERVACIONES | PRECIO POR KG | COSTO PERDIDA
```

El costo perdido se calcula multiplicando el precio por kg por la cantidad.

Las pestanas `ERROR EN SERVICIO (BARRA)` y `MALA MANIPULACION (COCINA)` deben
ubicar `CANTIDAD` a la derecha de `PRODUCTO`:

```text
FECHA | PRODUCTO | CANTIDAD | RESPONSABLE | TURNO | LISTA DE INCIDENCIAS | OBSERVACIONES | PRECIO UNITARIO | COSTO PERDIDA
```

La pestana `CONSUMO INTERNO` tambien debe ubicar `CANTIDAD` a la derecha de
`PRODUCTO`:

```text
FECHA | PRODUCTO | CANTIDAD | RESPONSABLE | TURNO | OBSERVACIONES | MONTO | COSTO PERDIDA
```

Si las pestanas no mantienen los nombres de la plantilla, modifica
`CONFIG.sheetNames` en `Code.gs` para que coincida exactamente con el Google
Sheet.
