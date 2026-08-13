'use strict';

const APPS_SCRIPT_URL = String(window.APPS_SCRIPT_URL || '').trim();
const APPS_SCRIPT_PROXY_URL = '/api/apps-script';

const MANIPULACION_EXTRA_PRODUCTS = [
  'PAN DEMI BAGUETTE CONGELADO',
  'CROISSANT SIMPLE',
  'BAGEL UND',
  'PAN DE PERRO UND',
  'PAN CACHORRO UND',
  'PAN DE HAMBURGUESA 55G UND',
  'PAN DE HAMBURGUESA 85G UND',
  'PAN DE HAMBURGUESA 95G UND',
  'PAN TIPO DELI UND',
];

const FALLBACK_CATALOGS = {
  modules: [
    {
      id: 'servicio',
      label: 'ERROR EN SERVICIO (BARRA)',
      description: 'Mala facturacion: cobro de mas o cambios mal anotados.',
      responsablesCatalog: 'responsablesBarra',
      incidenciasCatalog: 'incidenciasServicio',
      extraFields: [
        {
          name: 'cantidad',
          label: 'Cantidad *',
          type: 'number',
          placeholder: '0',
          min: '0.01',
          step: '0.01',
          required: true,
        },
        {
          name: 'listaIncidencias',
          label: 'Lista de Incidencias *',
          type: 'select',
          placeholder: 'Seleccione una incidencia...',
          optionsKey: 'incidenciasServicio',
          required: true,
        },
        {
          name: 'observaciones',
          label: 'Observaciones',
          type: 'textarea',
          placeholder: 'Breve expicacion',
          required: false,
        },
      ],
    },
    {
      id: 'consumo',
      label: 'CONSUMO INTERNO',
      description: 'Producto destinado al consumo interno del equipo.',
      responsablesCatalog: 'responsablesCocina',
      extraFields: [
        {
          name: 'cantidad',
          label: 'Cantidad *',
          type: 'number',
          placeholder: '0',
          min: '0.01',
          step: '0.01',
          required: true,
        },
        {
          name: 'observaciones',
          label: 'Observaciones',
          type: 'textarea',
          placeholder: 'Breve explicacion',
          required: false,
        },
      ],
    },
    {
      id: 'manipulacion',
      label: 'MALA MANIPULACION (COCINA)',
      description: 'Producto quemado, mal armado o error en cambios.',
      responsablesCatalog: 'responsablesCocina',
      productCatalog: 'productosManipulacion',
      incidenciasCatalog: 'incidenciasManipulacion',
      extraFields: [
        {
          name: 'cantidad',
          label: 'Cantidad *',
          type: 'number',
          placeholder: '0',
          min: '0.01',
          step: '0.01',
          required: true,
        },
        {
          name: 'listaIncidencias',
          label: 'Lista de Incidencias *',
          type: 'select',
          placeholder: 'Seleccione una incidencia...',
          optionsKey: 'incidenciasManipulacion',
          required: true,
        },
        {
          name: 'observaciones',
          label: 'Observaciones',
          type: 'textarea',
          placeholder: 'Breve expicacion',
          required: false,
        },
      ],
    },
    {
      id: 'desperdicio',
      label: 'DESPERDICIO PERECEDERO (VEGETALES)',
      description: 'Vegetales marchitos o mayugados.',
      responsablesCatalog: 'responsablesCocina',
      productCatalog: 'productosDesperdicio',
      extraFields: [
        {
          name: 'cantidad',
          label: 'Cantidad *',
          type: 'number',
          placeholder: '0',
          min: '0.01',
          step: '0.01',
          required: true,
        },
        {
          name: 'observaciones',
          label: 'Observaciones',
          type: 'textarea',
          placeholder: 'Breve explicacion',
          required: false,
        },
      ],
    },
    {
      id: 'merma_pan',
      label: 'MERMA DE PAN (COCINA)',
      description: 'Pan de cocina retirado por merma o vencimiento del paquete.',
      responsablesCatalog: 'responsablesCocina',
      productCatalog: 'productosMermaPan',
      extraFields: [
        {
          name: 'cantidad',
          label: 'Cantidad *',
          type: 'number',
          placeholder: '0',
          min: '1',
          step: '1',
          required: true,
        },
        {
          name: 'fechaVencimiento',
          label: 'Fecha de vencimiento del paquete *',
          type: 'date',
          required: true,
        },
      ],
    },
  ],
  responsablesBarra: [
    'LICETH CARRASCAL',
    'VICTOR GALAVIS',
    'KEIDER MORA',
    'EMILY VILORIA',
  ],
  responsablesCocina: [
    'SANTIAGO GUILLEN',
    'YVIANIS BOLIVAR',
    'RICARDO GOICOCHEA',
    'JOHANS BRITO',
  ],
  responsables: [
    'SANTIAGO GUILLEN',
    'YVIANIS BOLIVAR',
    'LICETH CARRASCAL',
    'KEIDER MORA',
    'RICARDO GOICOCHEA',
    'JOHANS BRITO',
    'VICTOR GALAVIS',
    'EMILY VILORIA',
  ],
  turnos: ['DIURNO', 'NOCTURNO'],
  incidenciasServicio: ['Comanda repetida, sin aviso', 'Producto equivocado, segun peticion del cliente', 'Pedido mal entregado, equivocacion de mesas o clientes', 'Cambios mal anotados', 'Se cayo al suelo', 'Cliente no satisfecho'],
  incidenciasManipulacion: ['Pasada de coccion', 'Error en cambios', 'Producto demas / duplicado', 'Mala Manipulacion del pan', 'Se cayo al suelo', 'Proteina cruda', 'Cliente no satisfecho', 'Producto frio o mal emplatado'],
  productosMermaPan: [
    'PTEM0107 BAGEL EVERYTHING 105 GR 4 UND',
    'PTEM0108 BAGELS PLAIN 105 GR 4 UND',
    'PTEM0109 BAGEL AMAPOLA 105 G 4 UND',
    'PTEM0110 BAGELS AJONJOLI 105 GR 4 UND',
    'PTEM0111 BAGEL SPICY 105 GR 4 UND',
    'PTEM0134 BAGELS INTEGRAL CON TOOPING DE AVENA',
    'PTEM0060 PAN DE HAMBURGUESA ESPECIAL 55 GR 6 UND',
    'PTEM0043 PAN DE HAMBURGUESA ESPECIAL 85 GR 6 UND A24',
    'PTEM0086 PAN DE HAMBURGUESA TIPO BRIOCHE 95 GR 6 UND WAB',
    'PTEM0072 PAN DE PERRO MINI ESPECIAL 50 GR 12 UND',
    'PTEM0002 PAN DE PERRO',
    'PTEM0004 PAN TIPO DELI',
    'PTSU0046 CROISSANT SIMPLE 120 GR 1 UND',
    'STPC007 DEMI BAGUETTE CONGELADO 180G 1 UND',
  ],
  productosDesperdicio: [
    'MDMP0024 PAPA FRESCA KG',
    'MDMP0061 AJI DULCE KG',
    'MDMP0062 AJO PELADO KG',
    'MDMP0064 ALBAHACA KG',
    'MDMP0074 CEBOLLA BLANCA KG',
    'MDMP0075 CEBOLLIN KG',
    'MDMP0076 CHAMPINON KG',
    'MDMP0077 TOMATE PERITA KG',
    'MDMP0090 ENELDO KG',
    'MDMP0116 PEREJIL KG',
    'MDMP0117 PIMENTON KG',
    'MDMP0128 REPOLLO BLANCO KG',
    'MDMP0131 RUGULA KG',
    'MDMP0142 TOMATE MANZANO KG',
    'MDMP0152 REPOLLO MORADO KG',
    'MDMP0182 CELERY KG',
    'MDMP0227 ESTRAGON FRESCO KG',
    'MDMP0228 JENGIBRE KG',
    'MDMP0231 MORAS KG',
    'MDMP0232 ZANAHORIA KG',
    'MDMP0233 COL RIZADA KALE KG',
    'MDMP0237 CEBOLLA MORADA KG',
    'MDMP0284 PEPINILLOS KG',
    'MDMP0324 CILANTRO KG',
    'MDMP0379 LECHUGA RIZADA KG',
    'PEPINILLOS ENCURTIDOS',
    'CEBOLLAS ENCURTIDAS',
    'SALSA DE PERNIL',
  ],
  productos: [
    'BAGEL INTEGRAL DE POLLO AHUMADO',
    'BAGEL DE PROSCIUTTO',
    'BAGEL DE SPREAD DE SALMON',
    'BAGEL ALASKA',
    'BAGEL DE QUESO CREMA',
    'BAGEL DE SALMON CLASICO',
    'BAGEL DE CARPACCIO',
    'BAGEL CAPRESA',
    'CROISSANT DE PAVO',
    'CRIOSSANT DE JAMON Y QUESO',
    'DONATELLA VERSACHEESE',
    'SANDUCHE DE MORTADELLA',
    'CROISSANT DE PROSCIUTTO Y QUESO MANCHEGO',
    'CROISSANT DE SALMON AHUMADO Y QUESO CREMA',
    'CROISSANT DE PAVO Y QUESO',
    'SANDUCHE DE PAVO CON QUESO',
    'SANDUCHE DE PROSCIUTTO',
    'SANDUCHE DE PERNIL',
    'SANDUCHE DE CAPRESA',
    'PAPAS FRITAS',
    'PAPAS CHIPS 1 KG',
    'PAPAS CHIPS',
    'AROS DE CEBOLLA',
    'COMBO PAPAS Y REFRESCO',
    'KALE Y POLLO',
    'CESAR CON POLLO Y TOCINETA',
    'QUESO CABRA Y CHIPS DE PROSCIUTTO',
    'RACION TOCINETA',
    'EXTRA PROVOLONE',
    'EXTRA QUESO AMERICANO',
    'HUEVOS FRITOS',
    'PAN TOSTADO',
    'HABIBI',
    'COMBO LECHERIA - DOM',
    'CACHORROS 2 UND',
    'RACION TEQUENOS 6 UND',
    'EXTRA DE POLLO CDH',
    'EXTRA DE CARNE HAMBURGUESITA',
    'LE FRANCHUTE DE SAINT LOUIS',
    'CUBANO DESPELUCADO',
    'PERRO DOS',
    'AMERICAN PATTY',
    'COMBO CHACAO - MIERCOLES',
    'COMBO SAN LUIS - MARTES',
    'THRILLY CHEESESTEAK',
    'PULLED PUNK',
    'PERRO UNO',
    'CDH POLLO',
    'CHICKEN TENDER',
    'EXTRA DE POLLO PATTY',
    'COMBO BELLO CAMPO - JUEVES',
    'COMBO LOS PALOS GRANDES - VIERNES',
    'COMBO LA CANDELARIA - LUNES',
    'CDH CARNE',
    'LA HAMBURGUESITA',
    'SMASH-MOUTH',
    'BABE BURGUER',
    'BLUE BACON',
    'BUFFALO SOULCHICK',
    'LA TUYA',
    'CHICKEN PATTY',
    'EXTRA DE POLLO PARA ENSALADA',
    'SALSA MAYO PESTO PAQ',
    'SALSA ALDALUZA MILD PAQ',
    'VINAGRETA ASIATICA PAQ',
    'MERMELADA DE JALAPENO PAQ',
    'SALSA CDH PAQ',
    'PEPINILLOS ENCURTIDOS PAQ',
    'SPREAD DE SALMON PAQ',
    'SPREAD DE TOMATES SECOS PAQ',
  ],
};

FALLBACK_CATALOGS.productosManipulacion = FALLBACK_CATALOGS.productos.concat(MANIPULACION_EXTRA_PRODUCTS);

const state = {
  activeModule: '',
  catalogs: FALLBACK_CATALOGS,
};

const elements = {
  moduleButtons: Array.from(document.querySelectorAll('[data-module]')),
  entryPanel: document.getElementById('entry-panel'),
  moduleTitle: document.getElementById('module-title'),
  moduleDescription: document.getElementById('module-description'),
  changeModule: document.getElementById('change-module'),
  form: document.getElementById('incident-form'),
  fecha: document.getElementById('fecha'),
  responsable: document.getElementById('responsable'),
  turno: document.getElementById('turno'),
  producto: document.getElementById('producto'),
  productList: document.getElementById('product-list'),
  extraFields: document.getElementById('extra-fields'),
  envWarning: document.getElementById('env-warning'),
  submitButton: document.getElementById('submit-btn'),
  toast: document.getElementById('toast'),
  standbyOverlay: document.getElementById('standby-overlay'),
};

init();

function init() {
  elements.envWarning.classList.toggle('hidden', Boolean(APPS_SCRIPT_URL));
  setToday();
  renderCatalogs();
  setupModuleSelection();
  setupForm();
  loadRemoteCatalogs();
}

function setupModuleSelection() {
  elements.moduleButtons.forEach((button) => {
    button.addEventListener('click', () => openModule(String(button.dataset.module || '')));
  });

  elements.changeModule.addEventListener('click', () => {
    state.activeModule = '';
    elements.moduleButtons.forEach((button) => button.classList.remove('active'));
    elements.entryPanel.classList.add('hidden');
    elements.form.reset();
    elements.extraFields.innerHTML = '';
    elements.extraFields.classList.add('hidden');
    setToday();
    renderProductOptions();
  });
}

function openModule(moduleId) {
  const module = getActiveModule(moduleId);
  if (!module) return;

  state.activeModule = moduleId;
  elements.moduleButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.module === moduleId);
  });
  elements.moduleTitle.textContent = module.label;
  elements.moduleDescription.textContent = module.description;
  elements.entryPanel.classList.remove('hidden');
  elements.form.reset();
  setToday();
  renderResponsibleOptions(module);
  renderProductOptions(module);
  renderExtraFields(module);
  elements.entryPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderExtraFields(module) {
  const fields = Array.isArray(module.extraFields) ? module.extraFields : [];
  elements.extraFields.innerHTML = fields.map(renderExtraField).join('');
  elements.extraFields.classList.toggle('hidden', fields.length === 0);
}

function renderExtraField(field) {
  const required = field.required ? ' required' : '';
  const label = `${escapeHtml(field.label || field.name)}${field.required && !String(field.label || '').includes('*') ? ' *' : ''}`;
  const placeholder = field.placeholder ? ` placeholder="${escapeHtml(field.placeholder)}"` : '';

  if (field.type === 'select') {
    const values = Array.isArray(state.catalogs[field.optionsKey]) ? state.catalogs[field.optionsKey] : [];
    const options = [`<option value="">${escapeHtml(field.placeholder || 'Seleccione una opcion...')}</option>`]
      .concat(values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`))
      .join('');
    return `<label><span>${label}</span><select name="${escapeHtml(field.name)}"${required}>${options}</select></label>`;
  }

  if (field.type === 'textarea') {
    return `<label class="extra-fields__wide"><span>${label}</span><textarea name="${escapeHtml(field.name)}" rows="3"${placeholder}${required}></textarea></label>`;
  }

  const min = field.min ? ` min="${escapeHtml(field.min)}"` : '';
  const step = field.step ? ` step="${escapeHtml(field.step)}"` : '';
  return `<label><span>${label}</span><input name="${escapeHtml(field.name)}" type="${escapeHtml(field.type || 'text')}"${placeholder}${min}${step}${required} /></label>`;
}

function renderCatalogs() {
  renderResponsibleOptions(getActiveModule());
  renderSelect(elements.turno, state.catalogs.turnos, 'Seleccione un turno...');
  renderProductOptions(getActiveModule());
}

function renderResponsibleOptions(module) {
  renderSelect(elements.responsable, getResponsibleCatalog(module), 'Seleccione un responsable...');
}

function renderProductOptions(module) {
  const products = getProductCatalog(module);
  elements.productList.innerHTML = products
    .map((producto) => `<option value="${escapeHtml(producto)}"></option>`)
    .join('');
}

function renderSelect(select, values, placeholder) {
  const selected = select.value;
  const options = [`<option value="">${escapeHtml(placeholder)}</option>`];
  values.forEach((value) => {
    options.push(`<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`);
  });
  select.innerHTML = options.join('');
  if (values.includes(selected)) select.value = selected;
}

function setupForm() {
  elements.form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const module = getActiveModule();
    if (!module) {
      showToast('Selecciona un modulo antes de guardar.', 'error');
      return;
    }

    const formData = new FormData(elements.form);
    const payload = {
      tipoIncidencia: state.activeModule,
      fecha: String(formData.get('fecha') || '').trim(),
      producto: String(formData.get('producto') || '').trim(),
      responsable: String(formData.get('responsable') || '').trim(),
      turno: String(formData.get('turno') || '').trim(),
      ...readExtraPayload(formData, module),
    };
    if (!payload.fecha || !payload.producto || !payload.responsable || !payload.turno) {
      showToast('Completa todos los campos obligatorios.', 'error');
      return;
    }

    if (!validateExtraFields(payload, module)) return;

    if (!hasCatalogValue(getProductCatalog(module), payload.producto)) {
      showToast('Selecciona un producto valido de la lista.', 'error');
      return;
    }

    if (!hasCatalogValue(getResponsibleCatalog(module), payload.responsable)) {
      showToast('Selecciona un responsable valido de la lista.', 'error');
      return;
    }

    if (!APPS_SCRIPT_URL) {
      showToast('Configura la URL del Apps Script para enviar el registro.', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await saveIncident(payload);
      if (!response.success) throw new Error(response.message || 'No se pudo guardar el registro.');
      showToast('Incidencia guardada correctamente.', 'success');
      elements.form.reset();
      setToday();
    } catch (error) {
      showToast(error.message || 'No se pudo guardar el registro.', 'error');
    } finally {
      setLoading(false);
    }
  });
}

function readExtraPayload(formData, module) {
  const fields = Array.isArray(module.extraFields) ? module.extraFields : [];
  return fields.reduce((payload, field) => {
    payload[field.name] = String(formData.get(field.name) || '').trim();
    return payload;
  }, {});
}

function validateExtraFields(payload, module) {
  const fields = Array.isArray(module.extraFields) ? module.extraFields : [];
  const missing = fields.find((field) => field.required && !payload[field.name]);
  if (missing) {
    showToast('Completa todos los campos obligatorios.', 'error');
    return false;
  }

  if (payload.listaIncidencias) {
    const values = state.catalogs[module.incidenciasCatalog] || [];
    if (values.length && !hasCatalogValue(values, payload.listaIncidencias)) {
      showToast('Selecciona una incidencia valida de la lista.', 'error');
      return false;
    }
  }

  if (payload.cantidad) {
    const quantity = Number(payload.cantidad);
    const quantityMustBeInteger = module.id === 'merma_pan';
    if (!Number.isFinite(quantity) || quantity <= 0 || (quantityMustBeInteger && !Number.isInteger(quantity))) {
      showToast(quantityMustBeInteger ? 'La cantidad debe ser un numero entero mayor a cero.' : 'La cantidad debe ser un numero mayor a cero.', 'error');
      return false;
    }
  }

  return true;
}

async function loadRemoteCatalogs() {
  if (!APPS_SCRIPT_URL) return;

  try {
    const url = `${APPS_SCRIPT_PROXY_URL}?target=${encodeURIComponent(APPS_SCRIPT_URL)}&action=getCatalogs`;
    const response = await fetch(url, { cache: 'no-store' });
    const result = await parseResponse(response);
    if (!result.success || !result.data) return;
    state.catalogs = {
      ...FALLBACK_CATALOGS,
      ...result.data,
      incidenciasServicio: mergeCatalogValues(FALLBACK_CATALOGS.incidenciasServicio, result.data.incidenciasServicio),
      modules: mergeModules(FALLBACK_CATALOGS.modules, result.data.modules),
    };
    renderCatalogs();
    if (state.activeModule) renderExtraFields(getActiveModule());
  } catch (error) {
    showToast('Se usara el catalogo local mientras se conecta Apps Script.', 'error');
  }
}

async function saveIncident(payload) {
  const response = await fetch(`${APPS_SCRIPT_PROXY_URL}?target=${encodeURIComponent(APPS_SCRIPT_URL)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'guardarIncidencia', payload }),
  });
  return parseResponse(response);
}

async function parseResponse(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error('Apps Script devolvio una respuesta no valida.');
  }
}

function setToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  elements.fecha.value = `${year}-${month}-${day}`;
}

function setLoading(loading) {
  elements.submitButton.disabled = loading;
  elements.submitButton.textContent = loading ? 'Guardando...' : 'Guardar Registro';
  elements.standbyOverlay.classList.toggle('hidden', !loading);
}

function mergeModules(localModules, remoteModules) {
  if (!Array.isArray(remoteModules)) return localModules;
  const remoteById = new Map(remoteModules.map((module) => [module.id, module]));
  const merged = localModules.map((module) => ({
    ...module,
    ...(remoteById.get(module.id) || {}),
  }));

  remoteModules.forEach((module) => {
    if (!merged.some((item) => item.id === module.id)) merged.push(module);
  });

  return merged;
}

function mergeCatalogValues(localValues, remoteValues) {
  const merged = [];
  const addValue = (value) => {
    if (!hasCatalogValue(merged, value)) merged.push(value);
  };

  (Array.isArray(remoteValues) ? remoteValues : []).forEach(addValue);
  (Array.isArray(localValues) ? localValues : []).forEach(addValue);
  return merged;
}

function getActiveModule(moduleId = state.activeModule) {
  return state.catalogs.modules.find((item) => item.id === moduleId) || null;
}

function getProductCatalog(module) {
  const catalogName = module && module.productCatalog ? module.productCatalog : 'productos';
  return Array.isArray(state.catalogs[catalogName]) ? state.catalogs[catalogName] : [];
}

function getResponsibleCatalog(module) {
  const catalogName = module && module.responsablesCatalog ? module.responsablesCatalog : 'responsables';
  return Array.isArray(state.catalogs[catalogName]) ? state.catalogs[catalogName] : [];
}

function hasCatalogValue(values, rawValue) {
  const value = normalizeText(rawValue);
  return values.some((item) => normalizeText(item) === value);
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

function showToast(message, type) {
  elements.toast.textContent = message;
  elements.toast.className = `toast toast--show toast--${type || 'info'}`;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    elements.toast.className = 'toast';
  }, 3500);
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
