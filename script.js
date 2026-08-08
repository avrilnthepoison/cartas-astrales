document.addEventListener("DOMContentLoaded", () => {
  const botonGenerar = document.getElementById("btn-generar");
  const botonBorrar = document.getElementById("btn-borrar");
  const botonDescargarPNG = document.getElementById("btn-descargar-png");
  const botonDescargarPNGFondo = document.getElementById("btn-descargar-png-fondo");
  const lienzoSvg = document.getElementById("carta-astral");

  const CENTRO_X = 350;
  const CENTRO_Y = 350;
  const RADIO_EXTERIOR = 340;
  const RADIO_SIGNOS_INTERIOR = 310;
  const RADIO_DECANATOS_INTERIOR = 285;
  const RADIO_TERMINOS_INTERIOR = 265;
  const RADIO_PLANETAS = 220;
  const RADIO_TEXTO_SIGNOS = 320;
  const RADIO_SIMBOLOS_DECANATOS = 297;
  const RADIO_SIMBOLOS_TERMINOS = 275;
  const RADIO_GRADOS = 255;
  const RADIO_ASPECTOS = 145;

  const nombresSignos = [
    "ARIES", "TAURO", "GÉMINIS", "CÁNCER",
    "LEO", "VIRGO", "LIBRA", "ESCORPIO",
    "SAGITARIO", "CAPRICORNIO", "ACUARIO", "PISCIS"
  ];

  const simbolos = {
    "SOL": "☉",
    "LUNA": "☽",
    "MERCURIO": "☿",
    "VENUS": "♀",
    "MARTE": "♂",
    "JUPITER": "♃",
    "SATURNO": "♄",
    "URANO": "♅",
    "NEPTUNO": "♆",
    "PLUTON": "♇",
    "QUIRON": "⚷",
    "NODO_NORTE": "☊",
    "NODO_SUR": "☋"
  };
  const cuerpos = Object.keys(simbolos);

  // ORBES
  const orbesPlanetarios = {
    "SOL": 15,
    "LUNA": 12,
    "MERCURIO": 7,
    "VENUS": 7,
    "MARTE": 7,
    "JUPITER": 9,
    "SATURNO": 9,
    "URANO": 3,
    "NEPTUNO": 3,
    "PLUTON": 3,
    "NODO_NORTE": 0,
    "NODO_SUR": 0
  };

  // DECANATOS
  const decanatos = {
    0: ['MARTE', 'SOL', 'VENUS'],
    1: ['MERCURIO', 'LUNA', 'SATURNO'],
    2: ['JUPITER', 'MARTE', 'SOL'],
    3: ['VENUS', 'MERCURIO', 'LUNA'],
    4: ['SATURNO', 'JUPITER', 'MARTE'],
    5: ['SOL', 'VENUS', 'MERCURIO'],
    6: ['LUNA', 'SATURNO', 'JUPITER'],
    7: ['MARTE', 'SOL', 'VENUS'],
    8: ['MERCURIO', 'LUNA', 'SATURNO'],
    9: ['JUPITER', 'MARTE', 'SOL'],
    10: ['VENUS', 'MERCURIO', 'LUNA'],
    11: ['SATURNO', 'JUPITER', 'MARTE']
  };

  // TÉRMINOS
  const terminosData = {
    0: [ // Aries
      { planeta: 'JUPITER', inicio: 0, fin: 6 },
      { planeta: 'VENUS', inicio: 6, fin: 12 },
      { planeta: 'MERCURIO', inicio: 12, fin: 20 },
      { planeta: 'MARTE', inicio: 20, fin: 25 },
      { planeta: 'SATURNO', inicio: 25, fin: 30 }
    ],
    1: [ // Tauro
      { planeta: 'VENUS', inicio: 0, fin: 8 },
      { planeta: 'MERCURIO', inicio: 8, fin: 14 },
      { planeta: 'JUPITER', inicio: 14, fin: 22 },
      { planeta: 'SATURNO', inicio: 22, fin: 27 },
      { planeta: 'MARTE', inicio: 27, fin: 30 }
    ],
    2: [ // Géminis
      { planeta: 'MERCURIO', inicio: 0, fin: 6 },
      { planeta: 'JUPITER', inicio: 6, fin: 12 },
      { planeta: 'VENUS', inicio: 12, fin: 17 },
      { planeta: 'MARTE', inicio: 17, fin: 24 },
      { planeta: 'SATURNO', inicio: 24, fin: 30 }
    ],
    3: [ // Cáncer
      { planeta: 'MARTE', inicio: 0, fin: 7 },
      { planeta: 'VENUS', inicio: 7, fin: 13 },
      { planeta: 'MERCURIO', inicio: 13, fin: 19 },
      { planeta: 'JUPITER', inicio: 19, fin: 26 },
      { planeta: 'SATURNO', inicio: 26, fin: 30 }
    ],
    4: [ // Leo
      { planeta: 'JUPITER', inicio: 0, fin: 6 },
      { planeta: 'VENUS', inicio: 6, fin: 11 },
      { planeta: 'SATURNO', inicio: 11, fin: 18 },
      { planeta: 'MERCURIO', inicio: 18, fin: 24 },
      { planeta: 'MARTE', inicio: 24, fin: 30 }
    ],
    5: [ // Virgo
      { planeta: 'MERCURIO', inicio: 0, fin: 7 },
      { planeta: 'VENUS', inicio: 7, fin: 17 },
      { planeta: 'JUPITER', inicio: 17, fin: 21 },
      { planeta: 'MARTE', inicio: 21, fin: 28 },
      { planeta: 'SATURNO', inicio: 28, fin: 30 }
    ],
    6: [ // Libra
      { planeta: 'SATURNO', inicio: 0, fin: 6 },
      { planeta: 'VENUS', inicio: 6, fin: 14 },
      { planeta: 'JUPITER', inicio: 14, fin: 21 },
      { planeta: 'MERCURIO', inicio: 21, fin: 28 },
      { planeta: 'MARTE', inicio: 28, fin: 30 }
    ],
    7: [ // Escorpio
      { planeta: 'MARTE', inicio: 0, fin: 7 },
      { planeta: 'VENUS', inicio: 7, fin: 11 },
      { planeta: 'MERCURIO', inicio: 11, fin: 19 },
      { planeta: 'JUPITER', inicio: 19, fin: 24 },
      { planeta: 'SATURNO', inicio: 24, fin: 30 }
    ],
    8: [ // Sagitario
      { planeta: 'JUPITER', inicio: 0, fin: 12 },
      { planeta: 'VENUS', inicio: 12, fin: 17 },
      { planeta: 'MERCURIO', inicio: 17, fin: 21 },
      { planeta: 'SATURNO', inicio: 21, fin: 26 },
      { planeta: 'MARTE', inicio: 26, fin: 30 }
    ],
    9: [ // Capricornio
      { planeta: 'MERCURIO', inicio: 0, fin: 7 },
      { planeta: 'JUPITER', inicio: 7, fin: 14 },
      { planeta: 'VENUS', inicio: 14, fin: 22 },
      { planeta: 'SATURNO', inicio: 22, fin: 26 },
      { planeta: 'MARTE', inicio: 26, fin: 30 }
    ],
    10: [ // Acuario
      { planeta: 'SATURNO', inicio: 0, fin: 7 },
      { planeta: 'MERCURIO', inicio: 7, fin: 13 },
      { planeta: 'VENUS', inicio: 13, fin: 20 },
      { planeta: 'JUPITER', inicio: 20, fin: 25 },
      { planeta: 'MARTE', inicio: 25, fin: 30 }
    ],
    11: [ // Piscis
      { planeta: 'VENUS', inicio: 0, fin: 12 },
      { planeta: 'JUPITER', inicio: 12, fin: 16 },
      { planeta: 'MERCURIO', inicio: 16, fin: 19 },
      { planeta: 'MARTE', inicio: 19, fin: 28 },
      { planeta: 'SATURNO', inicio: 28, fin: 30 }
    ]
  };

  function transformarADecimal(g, m) {
    return g + (m / 60);
  }

  function procesarYGenerarCarta() {
    const ascG = parseInt(document.getElementById("asc-grado").value, 10) || 0;
    const ascM = parseInt(document.getElementById("asc-minuto").value, 10) || 0;
    const ascSigno = parseInt(document.getElementById("asc-signo").value, 10);
    const valorAscDecimal = transformarADecimal(ascG, ascM);
    const gradoAscAbsoluto = (ascSigno * 30) + valorAscDecimal;

    const mcG = parseInt(document.getElementById("mc-grado").value, 10) || 0;
    const mcM = parseInt(document.getElementById("mc-minuto").value, 10) || 0;
    const mcSigno = parseInt(document.getElementById("mc-signo").value, 10);
    const valorMcDecimal = transformarADecimal(mcG, mcM);
    const gradoMcAbsoluto = (mcSigno * 30) + valorMcDecimal;

    const planetasIngresados = {};
    const filasPlanetas = document.querySelectorAll(".fila-planeta");
    const estructuraAGuardar = {
      ascendente: { g: document.getElementById("asc-grado").value, m: document.getElementById("asc-minuto").value, signo: ascSigno },
      medioCielo: { g: document.getElementById("mc-grado").value, m: document.getElementById("mc-minuto").value, signo: mcSigno },
      planetas: {}
    };

    filasPlanetas.forEach(fila => {
      const nombreAstro = fila.getAttribute("data-astro");
      const gInput = fila.querySelector(".p-grado").value;
      const mInput = fila.querySelector(".p-minuto").value;
      const signoIndice = parseInt(fila.querySelector(".p-signo").value, 10);
      const retroCheck = fila.querySelector(".p-retrogrado");
      const retrogrado = retroCheck ? retroCheck.checked : false;
      const g = parseInt(gInput, 10) || 0;
      const m = parseInt(mInput, 10) || 0;
      const posicionDecimal = transformarADecimal(g, m);
      const posicionAbsoluta = (signoIndice * 30) + posicionDecimal;
      planetasIngresados[nombreAstro] = posicionAbsoluta;
      estructuraAGuardar.planetas[nombreAstro] = {
        g: gInput,
        m: mInput,
        signo: signoIndice,
        retrogrado: retrogrado
      };
    });

    // ---- AÑADIR NODO SUR (opuesto al Nodo Norte) ----
    if (planetasIngresados.hasOwnProperty('NODO_NORTE')) {
      const posNorte = planetasIngresados['NODO_NORTE'];
      const posSur = (posNorte + 180) % 360;
      planetasIngresados['NODO_SUR'] = posSur;
    }

    localStorage.setItem("datosRadixManual", JSON.stringify(estructuraAGuardar));
    dibujarRadixManual(gradoAscAbsoluto, gradoMcAbsoluto, planetasIngresados, true);
  }

  function restablecerTodoACero() {
    localStorage.removeItem("datosRadixManual");
    document.getElementById("asc-grado").value = "";
    document.getElementById("asc-minuto").value = "";
    document.getElementById("asc-signo").value = "0";
    document.getElementById("mc-grado").value = "";
    document.getElementById("mc-minuto").value = "";
    document.getElementById("mc-signo").value = "0";
    const filasPlanetas = document.querySelectorAll(".fila-planeta");
    filasPlanetas.forEach(fila => {
      fila.querySelector(".p-grado").value = "";
      fila.querySelector(".p-minuto").value = "";
      fila.querySelector(".p-signo").value = "0";
      const retroCheck = fila.querySelector(".p-retrogrado");
      if (retroCheck) retroCheck.checked = false;
    });
    dibujarRadixManual(0, 0, {}, false);
  }

  function cargarValoresGuardados() {
    const datosGuardados = localStorage.getItem("datosRadixManual");
    if (!datosGuardados) {
      dibujarRadixManual(0, 0, {}, false);
      return;
    }
    try {
      const datos = JSON.parse(datosGuardados);
      if (datos.ascendente) {
        document.getElementById("asc-grado").value = datos.ascendente.g;
        document.getElementById("asc-minuto").value = datos.ascendente.m;
        document.getElementById("asc-signo").value = datos.ascendente.signo;
      }
      if (datos.medioCielo) {
        document.getElementById("mc-grado").value = datos.medioCielo.g;
        document.getElementById("mc-minuto").value = datos.medioCielo.m;
        document.getElementById("mc-signo").value = datos.medioCielo.signo;
      }
      if (datos.planetas) {
        const filasPlanetas = document.querySelectorAll(".fila-planeta");
        filasPlanetas.forEach(fila => {
          const nombreAstro = fila.getAttribute("data-astro");
          const datosAstro = datos.planetas[nombreAstro];
          if (datosAstro) {
            fila.querySelector(".p-grado").value = datosAstro.g;
            fila.querySelector(".p-minuto").value = datosAstro.m;
            fila.querySelector(".p-signo").value = datosAstro.signo;
            const retroCheck = fila.querySelector(".p-retrogrado");
            if (retroCheck) retroCheck.checked = datosAstro.retrogrado || false;
          }
        });
      }
      procesarYGenerarCarta();
    } catch (e) {
      console.error("Error al restaurar los datos de sesión:", e);
      dibujarRadixManual(0, 0, {}, false);
    }
  }

  botonGenerar.addEventListener("click", procesarYGenerarCarta);
  botonBorrar.addEventListener("click", restablecerTodoACero);
  botonDescargarPNG.addEventListener("click", () => descargarPNG(false));
  botonDescargarPNGFondo.addEventListener("click", () => descargarPNG(true));

  cargarValoresGuardados();

  // ------------------------------------------------------------
  // FUNCIÓN PARA OBTENER FUENTE DE GOOGLE FONTS Y CONVERTIRLA A BASE64
  // ------------------------------------------------------------
  async function obtenerFuenteBase64(urlCss) {
    try {
      const respuestaCss = await fetch(urlCss);
      if (!respuestaCss.ok) throw new Error(`HTTP ${respuestaCss.status}`);
      const css = await respuestaCss.text();
      const regexFontFace = /@font-face\s*\{([^}]*)\}/g;
      const fontFaces = [];
      let match;
      while ((match = regexFontFace.exec(css)) !== null) {
        const bloque = match[1];
        const urlMatch = /url\(([^)]+)\)/.exec(bloque);
        if (!urlMatch) continue;
        let url = urlMatch[1].replace(/^["']|["']$/g, '');
        if (url.startsWith('http://')) url = url.replace('http://', 'https://');
        const styleMatch = /font-style\s*:\s*([^;]+)/.exec(bloque);
        const estilo = styleMatch ? styleMatch[1].trim() : 'normal';
        fontFaces.push({ url, estilo });
      }
      if (fontFaces.length === 0) {
        console.warn("No se encontraron fuentes en el CSS de Google Fonts.");
        return null;
      }
      const fuentesBase64 = [];
      for (const ff of fontFaces) {
        try {
          const respuestaFuente = await fetch(ff.url);
          if (!respuestaFuente.ok) throw new Error(`HTTP ${respuestaFuente.status}`);
          const buffer = await respuestaFuente.arrayBuffer();
          const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
          fuentesBase64.push({ base64, estilo: ff.estilo });
        } catch (e) {
          console.warn(`Error al descargar fuente: ${ff.url}`, e);
        }
      }
      if (fuentesBase64.length === 0) return null;
      let fontFace = '';
      for (const fuente of fuentesBase64) {
        fontFace += `@font-face { font-family: 'IM Fell DW Pica'; font-display: block; `;
        fontFace += `src: url('data:font/woff2;base64,${fuente.base64}') format('woff2'); `;
        fontFace += `font-weight: 400; font-style: ${fuente.estilo}; }\n`;
      }
      return fontFace;
    } catch (error) {
      console.error("Error al obtener la fuente de Google Fonts:", error);
      return null;
    }
  }

  // ------------------------------------------------------------
  // FUNCIÓN PARA DESCARGAR PNG (CORREGIDA)
  // ------------------------------------------------------------
  async function descargarPNG(conFondo = false) {
    // Intentar cargar la fuente en el documento principal
    try {
      await document.fonts.load('1em "IM Fell DW Pica"');
    } catch (e) {
      console.warn("No se pudo cargar la fuente en el documento principal:", e);
    }

    const urlGoogleFonts = 'https://fonts.googleapis.com/css2?family=IM+Fell+DW+Pica:ital,wght@0,400;1,400&display=swap';
    let fuenteCSS = await obtenerFuenteBase64(urlGoogleFonts);
    if (!fuenteCSS) {
      console.warn("No se pudo obtener la fuente de Google Fonts. Se usará la fuente por defecto.");
      fuenteCSS = `text { font-family: serif; }`;
    }

    let estilosCSS = '';
    try {
      const resp = await fetch('styles.css');
      if (resp.ok) {
        estilosCSS = await resp.text();
      } else {
        console.warn('No se pudo cargar styles.css, se usará un estilo mínimo.');
      }
    } catch (e) {
      console.warn('Error al obtener styles.css:', e);
    }

    const ESCALA = 3;
    const ANCHO_FINAL = 700 * ESCALA;
    const ALTO_FINAL = 700 * ESCALA;

    const svgOriginal = document.getElementById("carta-astral");
    const clon = svgOriginal.cloneNode(true);

    const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    style.textContent = `
      /* Estilos del gráfico (desde styles.css) */
      ${estilosCSS}

      /* Reglas de la fuente (Base64) */
      ${fuenteCSS}

      /* Reglas adicionales para garantizar la fuente */
      text {
        font-family: 'IM Fell DW Pica', serif !important;
      }
      text[font-style="normal"] {
        font-style: normal !important;
      }
      text[font-style="italic"] {
        font-style: italic !important;
      }
    `;
    clon.insertBefore(style, clon.firstChild);

    // Convertir imágenes SVG referenciadas a dataURI
    const imagenes = clon.querySelectorAll("image");
    const cacheDataURI = new Map();

    async function obtenerDataURI(ruta) {
      if (cacheDataURI.has(ruta)) {
        return cacheDataURI.get(ruta);
      }
      try {
        const response = await fetch(ruta);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();
        const dataURI = `data:image/svg+xml;utf8,${encodeURIComponent(text)}`;
        cacheDataURI.set(ruta, dataURI);
        return dataURI;
      } catch (error) {
        console.warn(`No se pudo cargar la imagen: ${ruta}`, error);
        return null;
      }
    }

    const promesas = [];
    imagenes.forEach(img => {
      const href = img.getAttribute("href");
      if (href && href.endsWith(".svg")) {
        promesas.push(
          obtenerDataURI(href).then(dataURI => {
            if (dataURI) {
              img.setAttribute("href", dataURI);
            }
          })
        );
      }
    });
    await Promise.all(promesas);

    const svgData = new XMLSerializer().serializeToString(clon);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    const timeoutId = setTimeout(() => {
      console.warn("Timeout al cargar la imagen SVG. Se procederá con la descarga.");
    }, 15000);

    img.onload = function() {
      clearTimeout(timeoutId);
      const canvas = document.createElement("canvas");
      canvas.width = ANCHO_FINAL;
      canvas.height = ALTO_FINAL;
      const ctx = canvas.getContext("2d");

      if (conFondo) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const pngUrl = canvas.toDataURL("image/png");
      const nombreInput = document.getElementById("nombre-carta-input");
      let nombreBase = "carta astral";
      if (nombreInput && nombreInput.value.trim() !== "") {
        let nombreUsuario = nombreInput.value.trim();
        nombreUsuario = nombreUsuario.charAt(0).toUpperCase() + nombreUsuario.slice(1).toLowerCase();
        nombreBase = nombreUsuario + " carta astral";
      }
      const sufijo = conFondo ? "con fondo" : "sin fondo";
      const nombreCompleto = nombreBase + " " + sufijo + ".png";

      const link = document.createElement("a");
      link.download = nombreCompleto;
      link.href = pngUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    };

    img.onerror = function() {
      clearTimeout(timeoutId);
      console.error("Error al cargar el SVG para PNG.");
      URL.revokeObjectURL(url);
    };

    img.src = url;
  }

  // ------------------------------------------------------------
  // FUNCIÓN PRINCIPAL DE DIBUJO (con repulsión global)
  // ------------------------------------------------------------
  function dibujarRadixManual(ascendenteAbs, mcAbs, planetas, mostrarContenido) {
    // ---- Parámetros fijos de separación ----
    const ANCHO_ICONO = 20;            // 20x20 px
    const MARGEN_PLANETA_PLANETA = 10; // entre planetas
    const MARGEN_PLANETA_EJE = 5;      // entre planeta y eje
    const DIST_MIN_PLANETA = ANCHO_ICONO + MARGEN_PLANETA_PLANETA; // 30px
    const DIST_MIN_EJE = ANCHO_ICONO / 2 + MARGEN_PLANETA_EJE;     // 10+5=15px

    // Umbrales angulares en radianes (en el radio de los planetas)
    const UMBRAL_PLANETA_RAD = DIST_MIN_PLANETA / RADIO_PLANETAS; // 30/220 ≈ 0.13636
    const UMBRAL_EJE_RAD = DIST_MIN_EJE / RADIO_PLANETAS;         // 15/220 ≈ 0.06818

    while (lienzoSvg.firstChild) {
      lienzoSvg.removeChild(lienzoSvg.firstChild);
    }

    const indiceSignoCuspide = Math.floor(ascendenteAbs / 30);
    const inicioSignoCuspideG = indiceSignoCuspide * 30;
    const desfaceG = 180 + inicioSignoCuspideG;

    function ajustarAngulo(gradosOriginales) {
      return (desfaceG - gradosOriginales) * (Math.PI / 180);
    }

    // ---------- GENERACIÓN DE BLOQUES FUSIONADOS DE TÉRMINOS ----------
    const terminosAbsolutos = [];
    for (let signo = 0; signo < 12; signo++) {
      const lista = terminosData[signo];
      if (!lista) continue;
      const base = signo * 30;
      for (const term of lista) {
        terminosAbsolutos.push({
          planeta: term.planeta,
          inicio: base + term.inicio,
          fin: base + term.fin
        });
      }
    }
    const bloquesFusionados = [];
    if (terminosAbsolutos.length > 0) {
      let actual = { ...terminosAbsolutos[0] };
      for (let i = 1; i < terminosAbsolutos.length; i++) {
        const siguiente = terminosAbsolutos[i];
        if (siguiente.planeta === actual.planeta && siguiente.inicio === actual.fin) {
          actual.fin = siguiente.fin;
        } else {
          bloquesFusionados.push(actual);
          actual = { ...siguiente };
        }
      }
      bloquesFusionados.push(actual);
    }
    const limitesSet = new Set();
    for (const bloque of bloquesFusionados) {
      limitesSet.add(bloque.inicio);
      limitesSet.add(bloque.fin);
    }
    const limites = Array.from(limitesSet).sort((a, b) => a - b);

    // ========== CAPA 1: Círculos base y coronas ==========
    // ... (código igual al original, sin cambios) ...
    // No lo repito para no alargar, pero en el archivo final estará completo.
    // Aquí solo muestro la parte nueva de repulsión, que se inserta antes de dibujar los planetas.

    // [ ... todo el código de dibujo de coronas, líneas, nombres, decanatos, términos, ruedas, aspectos ... ]

    // ========== CAPA 8: Ejes, marcas de posición y planetas ==========
    if (mostrarContenido) {
      // ---- Ejes (ASC y MC) ----
      const radAsc = ajustarAngulo(ascendenteAbs);
      const radMc = ajustarAngulo(mcAbs);

      // Dibujar líneas de ejes e iconos (igual que antes)
      // ... (código original para dibujar ejes) ...

      // ---- OBTENER DATOS DE PLANETAS Y EJES ----
      let datosPlanetasForm = {};
      try {
        const raw = localStorage.getItem("datosRadixManual");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.planetas) {
            for (const [nombre, info] of Object.entries(parsed.planetas)) {
              datosPlanetasForm[nombre] = {
                g: info.g || 0,
                m: info.m || 0,
                retrogrado: info.retrogrado || false
              };
            }
          }
        }
      } catch (e) {}

      // Construir lista de puntos (planetas y ejes)
      const puntos = [];
      // Planetas
      for (const nombre of cuerpos) {
        if (planetas.hasOwnProperty(nombre)) {
          const gradosAbsolutos = planetas[nombre];
          const anguloRad = ajustarAngulo(gradosAbsolutos);
          puntos.push({
            nombre: nombre,
            tipo: 'planeta',
            anguloOriginal: anguloRad,
            anguloActual: anguloRad, // se modificará
            esMovil: true,
            datos: datosPlanetasForm[nombre] || { g: 0, m: 0, retrogrado: false }
          });
        }
      }
      // Ejes
      puntos.push({
        nombre: 'ASC',
        tipo: 'eje',
        anguloOriginal: radAsc,
        anguloActual: radAsc,
        esMovil: false,
        datos: { retrogrado: false }
      });
      puntos.push({
        nombre: 'MC',
        tipo: 'eje',
        anguloOriginal: radMc,
        anguloActual: radMc,
        esMovil: false,
        datos: { retrogrado: false }
      });

      // ---- ALGORITMO DE REPULSIÓN GLOBAL ----
      const MAX_ITER = 50;
      const FACTOR = 0.5; // factor de suavizado para evitar oscilaciones

      for (let iter = 0; iter < MAX_ITER; iter++) {
        let colisiones = false;
        const desplazamientos = new Array(puntos.length).fill(0);

        for (let i = 0; i < puntos.length; i++) {
          for (let j = i + 1; j < puntos.length; j++) {
            const p1 = puntos[i];
            const p2 = puntos[j];
            // Si ambos son ejes, no hay colisión (no se mueven)
            if (p1.tipo === 'eje' && p2.tipo === 'eje') continue;

            // Calcular distancia angular mínima
            let diff = p2.anguloActual - p1.anguloActual;
            // Normalizar a [-PI, PI]
            diff = ((diff % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
            const absDiff = Math.abs(diff);

            // Determinar umbral según tipos
            let umbral;
            if (p1.tipo === 'planeta' && p2.tipo === 'planeta') {
              umbral = UMBRAL_PLANETA_RAD;
            } else {
              umbral = UMBRAL_EJE_RAD;
            }

            if (absDiff < umbral) {
              colisiones = true;
              // Calcular corrección
              let correccion;
              if (p1.esMovil && p2.esMovil) {
                correccion = (umbral - absDiff) / 2;
              } else if (p1.esMovil) {
                correccion = (umbral - absDiff);
              } else if (p2.esMovil) {
                correccion = (umbral - absDiff);
              } else {
                continue; // ambos fijos (no debería pasar)
              }

              // Aplicar corrección con factor de suavizado
              correccion *= FACTOR;

              // Dirección: si diff > 0, p1 está a la izquierda de p2
              // entonces p1 se mueve a la izquierda (restar) y p2 a la derecha (sumar)
              if (diff > 0) {
                if (p1.esMovil) desplazamientos[i] -= correccion;
                if (p2.esMovil) desplazamientos[j] += correccion;
              } else {
                if (p1.esMovil) desplazamientos[i] += correccion;
                if (p2.esMovil) desplazamientos[j] -= correccion;
              }
            }
          }
        }

        // Aplicar desplazamientos
        for (let k = 0; k < puntos.length; k++) {
          if (puntos[k].esMovil) {
            puntos[k].anguloActual += desplazamientos[k];
            // Normalizar a [0, 2*PI)
            puntos[k].anguloActual = ((puntos[k].anguloActual % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
          }
        }

        if (!colisiones) break;
      }

      // ---- DIBUJAR PLANETAS CON ÁNGULOS ACTUALIZADOS ----
      for (const p of puntos) {
        if (p.tipo !== 'planeta') continue;
        const nombre = p.nombre;
        const anguloRad = p.anguloActual;
        const anguloOriginal = p.anguloOriginal;

        const xPlaneta = Math.round(CENTRO_X + RADIO_PLANETAS * Math.cos(anguloRad));
        const yPlaneta = Math.round(CENTRO_Y + RADIO_PLANETAS * Math.sin(anguloRad));

        // Línea de posición desde el grado original (en RADIO_GRADOS) hasta el anillo de planetas (en el ángulo original)
        // Mantenemos la línea original, no la modificamos.
        const xInicio = CENTRO_X + RADIO_GRADOS * Math.cos(anguloOriginal);
        const yInicio = CENTRO_Y + RADIO_GRADOS * Math.sin(anguloOriginal);
        const radioFinMarca = RADIO_GRADOS - 10;
        const xFin = CENTRO_X + radioFinMarca * Math.cos(anguloOriginal);
        const yFin = CENTRO_Y + radioFinMarca * Math.sin(anguloOriginal);
        const lineaPosicion = document.createElementNS("http://www.w3.org/2000/svg", "line");
        lineaPosicion.setAttribute("x1", String(xInicio));
        lineaPosicion.setAttribute("y1", String(yInicio));
        lineaPosicion.setAttribute("x2", String(xFin));
        lineaPosicion.setAttribute("y2", String(yFin));
        lineaPosicion.setAttribute("class", "linea-posicion-planeta");
        lienzoSvg.appendChild(lineaPosicion);

        // Línea desde el círculo de aspectos
        const xInicioAsp = CENTRO_X + RADIO_ASPECTOS * Math.cos(anguloOriginal);
        const yInicioAsp = CENTRO_Y + RADIO_ASPECTOS * Math.sin(anguloOriginal);
        const radioFinAsp = RADIO_ASPECTOS + 10;
        const xFinAsp = CENTRO_X + radioFinAsp * Math.cos(anguloOriginal);
        const yFinAsp = CENTRO_Y + radioFinAsp * Math.sin(anguloOriginal);
        const lineaPosicionAsp = document.createElementNS("http://www.w3.org/2000/svg", "line");
        lineaPosicionAsp.setAttribute("x1", String(xInicioAsp));
        lineaPosicionAsp.setAttribute("y1", String(yInicioAsp));
        lineaPosicionAsp.setAttribute("x2", String(xFinAsp));
        lineaPosicionAsp.setAttribute("y2", String(yFinAsp));
        lineaPosicionAsp.setAttribute("class", "linea-posicion-planeta");
        lienzoSvg.appendChild(lineaPosicionAsp);

        // Icono del planeta en la posición ajustada
        const nombreSVG = nombre.toLowerCase().replace('_', '-');
        const rutaSVG = `svg/${nombreSVG}.svg`;
        const imgPlaneta = document.createElementNS("http://www.w3.org/2000/svg", "image");
        imgPlaneta.setAttribute("x", String(xPlaneta - 10));
        imgPlaneta.setAttribute("y", String(yPlaneta - 10));
        imgPlaneta.setAttribute("class", "icono-planeta");
        imgPlaneta.setAttribute("href", rutaSVG);
        lienzoSvg.appendChild(imgPlaneta);

        // Retrógrado
        if (p.datos.retrogrado) {
          const offsetX = 10;
          const offsetY = 10;
          const xR = xPlaneta + offsetX;
          const yR = yPlaneta + offsetY;
          const txtRetro = document.createElementNS("http://www.w3.org/2000/svg", "text");
          txtRetro.setAttribute("x", String(xR));
          txtRetro.setAttribute("y", String(yR));
          txtRetro.setAttribute("text-anchor", "start");
          txtRetro.setAttribute("dominant-baseline", "central");
          txtRetro.setAttribute("class", "texto-retrogrado");
          txtRetro.textContent = "R";
          lienzoSvg.appendChild(txtRetro);
        }
      }
    }
  }
});