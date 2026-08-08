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
  // FUNCIÓN PRINCIPAL DE DIBUJO (con umbral fijo y separación automática)
  // ------------------------------------------------------------
  function dibujarRadixManual(ascendenteAbs, mcAbs, planetas, mostrarContenido) {
    // ---- Parámetros fijos para la separación ----
    const ANCHO_ICONO = 20;          // Tamaño de los iconos (20x20)
    const MARGEN_MINIMO = 10;        // Espacio mínimo entre bordes
    const SEPARACION_FIJA = ANCHO_ICONO + MARGEN_MINIMO; // Distancia entre centros (30px)

    // Umbral fijo (en grados) que corresponde a la separación mínima en el radio de los planetas.
    // En el radio RADIO_PLANETAS (220px), 30px equivalen a ~7.8°, redondeamos a 8°.
    const UMBRAL_FIJO = 8;

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
    const circuloExterior = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circuloExterior.setAttribute("cx", String(CENTRO_X));
    circuloExterior.setAttribute("cy", String(CENTRO_Y));
    circuloExterior.setAttribute("r", String(RADIO_EXTERIOR));
    circuloExterior.setAttribute("class", "circulo-base");
    lienzoSvg.appendChild(circuloExterior);

    const pathCoronaSignos = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const dCoronaSignos = `
      M ${CENTRO_X - RADIO_EXTERIOR} ${CENTRO_Y}
      A ${RADIO_EXTERIOR} ${RADIO_EXTERIOR} 0 1,1 ${CENTRO_X + RADIO_EXTERIOR} ${CENTRO_Y}
      A ${RADIO_EXTERIOR} ${RADIO_EXTERIOR} 0 1,1 ${CENTRO_X - RADIO_EXTERIOR} ${CENTRO_Y} Z
      M ${CENTRO_X - RADIO_SIGNOS_INTERIOR} ${CENTRO_Y}
      A ${RADIO_SIGNOS_INTERIOR} ${RADIO_SIGNOS_INTERIOR} 0 1,0 ${CENTRO_X + RADIO_SIGNOS_INTERIOR} ${CENTRO_Y}
      A ${RADIO_SIGNOS_INTERIOR} ${RADIO_SIGNOS_INTERIOR} 0 1,0 ${CENTRO_X - RADIO_SIGNOS_INTERIOR} ${CENTRO_Y} Z
    `;
    pathCoronaSignos.setAttribute("d", dCoronaSignos);
    pathCoronaSignos.setAttribute("fill-rule", "evenodd");
    pathCoronaSignos.setAttribute("class", "corona-signos");
    lienzoSvg.appendChild(pathCoronaSignos);

    const circuloSignosInterior = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circuloSignosInterior.setAttribute("cx", String(CENTRO_X));
    circuloSignosInterior.setAttribute("cy", String(CENTRO_Y));
    circuloSignosInterior.setAttribute("r", String(RADIO_SIGNOS_INTERIOR));
    circuloSignosInterior.setAttribute("class", "circulo-base");
    lienzoSvg.appendChild(circuloSignosInterior);

    const pathCoronaDecanatos = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const dCoronaDecanatos = `
      M ${CENTRO_X - RADIO_SIGNOS_INTERIOR} ${CENTRO_Y}
      A ${RADIO_SIGNOS_INTERIOR} ${RADIO_SIGNOS_INTERIOR} 0 1,1 ${CENTRO_X + RADIO_SIGNOS_INTERIOR} ${CENTRO_Y}
      A ${RADIO_SIGNOS_INTERIOR} ${RADIO_SIGNOS_INTERIOR} 0 1,1 ${CENTRO_X - RADIO_SIGNOS_INTERIOR} ${CENTRO_Y} Z
      M ${CENTRO_X - RADIO_DECANATOS_INTERIOR} ${CENTRO_Y}
      A ${RADIO_DECANATOS_INTERIOR} ${RADIO_DECANATOS_INTERIOR} 0 1,0 ${CENTRO_X + RADIO_DECANATOS_INTERIOR} ${CENTRO_Y}
      A ${RADIO_DECANATOS_INTERIOR} ${RADIO_DECANATOS_INTERIOR} 0 1,0 ${CENTRO_X - RADIO_DECANATOS_INTERIOR} ${CENTRO_Y} Z
    `;
    pathCoronaDecanatos.setAttribute("d", dCoronaDecanatos);
    pathCoronaDecanatos.setAttribute("fill-rule", "evenodd");
    pathCoronaDecanatos.setAttribute("class", "corona-decanatos");
    lienzoSvg.appendChild(pathCoronaDecanatos);

    const circuloDecanatosInterior = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circuloDecanatosInterior.setAttribute("cx", String(CENTRO_X));
    circuloDecanatosInterior.setAttribute("cy", String(CENTRO_Y));
    circuloDecanatosInterior.setAttribute("r", String(RADIO_DECANATOS_INTERIOR));
    circuloDecanatosInterior.setAttribute("class", "circulo-base");
    lienzoSvg.appendChild(circuloDecanatosInterior);

    const pathCoronaTerminos = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const dCoronaTerminos = `
      M ${CENTRO_X - RADIO_DECANATOS_INTERIOR} ${CENTRO_Y}
      A ${RADIO_DECANATOS_INTERIOR} ${RADIO_DECANATOS_INTERIOR} 0 1,1 ${CENTRO_X + RADIO_DECANATOS_INTERIOR} ${CENTRO_Y}
      A ${RADIO_DECANATOS_INTERIOR} ${RADIO_DECANATOS_INTERIOR} 0 1,1 ${CENTRO_X - RADIO_DECANATOS_INTERIOR} ${CENTRO_Y} Z
      M ${CENTRO_X - RADIO_TERMINOS_INTERIOR} ${CENTRO_Y}
      A ${RADIO_TERMINOS_INTERIOR} ${RADIO_TERMINOS_INTERIOR} 0 1,0 ${CENTRO_X + RADIO_TERMINOS_INTERIOR} ${CENTRO_Y}
      A ${RADIO_TERMINOS_INTERIOR} ${RADIO_TERMINOS_INTERIOR} 0 1,0 ${CENTRO_X - RADIO_TERMINOS_INTERIOR} ${CENTRO_Y} Z
    `;
    pathCoronaTerminos.setAttribute("d", dCoronaTerminos);
    pathCoronaTerminos.setAttribute("fill-rule", "evenodd");
    pathCoronaTerminos.setAttribute("class", "corona-terminos");
    lienzoSvg.appendChild(pathCoronaTerminos);

    const circuloTerminosInterior = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circuloTerminosInterior.setAttribute("cx", String(CENTRO_X));
    circuloTerminosInterior.setAttribute("cy", String(CENTRO_Y));
    circuloTerminosInterior.setAttribute("r", String(RADIO_TERMINOS_INTERIOR));
    circuloTerminosInterior.setAttribute("class", "circulo-base");
    lienzoSvg.appendChild(circuloTerminosInterior);

    // ========== CAPA 2: Líneas de los signos (30°) ==========
    for (let i = 0; i < 12; i++) {
      const gradoLinea = i * 30;
      const radLinea = ajustarAngulo(gradoLinea);
      const x1 = Math.round(CENTRO_X + RADIO_EXTERIOR * Math.cos(radLinea));
      const y1 = Math.round(CENTRO_Y + RADIO_EXTERIOR * Math.sin(radLinea));
      const x2 = Math.round(CENTRO_X + RADIO_SIGNOS_INTERIOR * Math.cos(radLinea));
      const y2 = Math.round(CENTRO_Y + RADIO_SIGNOS_INTERIOR * Math.sin(radLinea));
      const linea = document.createElementNS("http://www.w3.org/2000/svg", "line");
      linea.setAttribute("x1", String(x1));
      linea.setAttribute("y1", String(y1));
      linea.setAttribute("x2", String(x2));
      linea.setAttribute("y2", String(y2));
      linea.setAttribute("class", "linea-signo");
      lienzoSvg.appendChild(linea);
    }

    // ========== CAPA 3: Líneas de los decanatos (0°, 10°, 20° de cada signo) ==========
    for (let i = 0; i < 12; i++) {
      for (let d = 0; d < 3; d++) {
        const gradoLinea = i * 30 + d * 10;
        const radLinea = ajustarAngulo(gradoLinea);
        const x1 = Math.round(CENTRO_X + RADIO_SIGNOS_INTERIOR * Math.cos(radLinea));
        const y1 = Math.round(CENTRO_Y + RADIO_SIGNOS_INTERIOR * Math.sin(radLinea));
        const x2 = Math.round(CENTRO_X + RADIO_DECANATOS_INTERIOR * Math.cos(radLinea));
        const y2 = Math.round(CENTRO_Y + RADIO_DECANATOS_INTERIOR * Math.sin(radLinea));
        const linea = document.createElementNS("http://www.w3.org/2000/svg", "line");
        linea.setAttribute("x1", String(x1));
        linea.setAttribute("y1", String(y1));
        linea.setAttribute("x2", String(x2));
        linea.setAttribute("y2", String(y2));
        linea.setAttribute("class", "linea-decanato");
        lienzoSvg.appendChild(linea);
      }
    }

    // ========== CAPA 3b: Líneas de los términos (según límites de bloques fusionados) ==========
    for (const grado of limites) {
      if (grado === 360) continue;
      const radLinea = ajustarAngulo(grado);
      const x1 = CENTRO_X + RADIO_DECANATOS_INTERIOR * Math.cos(radLinea);
      const y1 = CENTRO_Y + RADIO_DECANATOS_INTERIOR * Math.sin(radLinea);
      const x2 = CENTRO_X + RADIO_TERMINOS_INTERIOR * Math.cos(radLinea);
      const y2 = CENTRO_Y + RADIO_TERMINOS_INTERIOR * Math.sin(radLinea);
      const linea = document.createElementNS("http://www.w3.org/2000/svg", "line");
      linea.setAttribute("x1", String(x1));
      linea.setAttribute("y1", String(y1));
      linea.setAttribute("x2", String(x2));
      linea.setAttribute("y2", String(y2));
      linea.setAttribute("class", "linea-termino");
      lienzoSvg.appendChild(linea);
    }

    // ========== CAPA 4: Nombres de los signos ==========
    for (let i = 0; i < 12; i++) {
      const gradoInicioArco = i * 30;
      const gradoFinArco = gradoInicioArco + 30;
      const radInicio = ajustarAngulo(gradoInicioArco);
      const radFin = ajustarAngulo(gradoFinArco);
      const radioTrayectoTexto = RADIO_TEXTO_SIGNOS;
      const sx = (CENTRO_X + radioTrayectoTexto * Math.cos(radInicio)).toFixed(2);
      const sy = (CENTRO_Y + radioTrayectoTexto * Math.sin(radInicio)).toFixed(2);
      const ex = (CENTRO_X + radioTrayectoTexto * Math.cos(radFin)).toFixed(2);
      const ey = (CENTRO_Y + radioTrayectoTexto * Math.sin(radFin)).toFixed(2);
      const idTrayecto = `trayecto-signo-${i}`;
      const d = `M ${ex},${ey} A ${radioTrayectoTexto},${radioTrayectoTexto} 0 0,1 ${sx},${sy}`;
      const rutaDefinicion = document.createElementNS("http://www.w3.org/2000/svg", "path");
      rutaDefinicion.setAttribute("id", idTrayecto);
      rutaDefinicion.setAttribute("d", d);
      rutaDefinicion.setAttribute("fill", "none");
      rutaDefinicion.setAttribute("stroke", "none");
      lienzoSvg.appendChild(rutaDefinicion);

      const etiquetaTexto = document.createElementNS("http://www.w3.org/2000/svg", "text");
      etiquetaTexto.setAttribute("class", "texto-signo");
      const trayectoTexto = document.createElementNS("http://www.w3.org/2000/svg", "textPath");
      trayectoTexto.setAttribute("href", `#${idTrayecto}`);
      trayectoTexto.setAttribute("startOffset", "50%");
      trayectoTexto.setAttribute("text-anchor", "middle");
      trayectoTexto.textContent = nombresSignos[i];
      etiquetaTexto.appendChild(trayectoTexto);
      lienzoSvg.appendChild(etiquetaTexto);
    }

    // ========== CAPA 5: Símbolos de los decanatos ==========
    for (let i = 0; i < 12; i++) {
      const decanatosSigno = decanatos[i];
      if (!decanatosSigno) continue;
      for (let d = 0; d < 3; d++) {
        const gradoCentral = i * 30 + d * 10 + 5;
        const rad = ajustarAngulo(gradoCentral);
        const x = CENTRO_X + RADIO_SIMBOLOS_DECANATOS * Math.cos(rad);
        const y = CENTRO_Y + RADIO_SIMBOLOS_DECANATOS * Math.sin(rad);
        const nombrePlaneta = decanatosSigno[d];
        const nombreSVG = nombrePlaneta.toLowerCase().replace('_', '-');
        const rutaSVG = `svg/${nombreSVG}.svg`;
        const imgDecanato = document.createElementNS("http://www.w3.org/2000/svg", "image");
        imgDecanato.setAttribute("x", String(x - 7));
        imgDecanato.setAttribute("y", String(y - 7));
        imgDecanato.setAttribute("class", "icono-decanato");
        imgDecanato.setAttribute("href", rutaSVG);
        lienzoSvg.appendChild(imgDecanato);
      }
    }

    // ========== CAPA 5b: Símbolos de los términos (bloques fusionados) ==========
    for (const bloque of bloquesFusionados) {
      const gradoCentral = (bloque.inicio + bloque.fin) / 2;
      const rad = ajustarAngulo(gradoCentral);
      const x = CENTRO_X + RADIO_SIMBOLOS_TERMINOS * Math.cos(rad);
      const y = CENTRO_Y + RADIO_SIMBOLOS_TERMINOS * Math.sin(rad);
      const nombreSVG = bloque.planeta.toLowerCase().replace('_', '-');
      const rutaSVG = `svg/${nombreSVG}.svg`;
      const imgTermino = document.createElementNS("http://www.w3.org/2000/svg", "image");
      imgTermino.setAttribute("x", String(x - 5));
      imgTermino.setAttribute("y", String(y - 5));
      imgTermino.setAttribute("class", "icono-termino");
      imgTermino.setAttribute("href", rutaSVG);
      lienzoSvg.appendChild(imgTermino);
    }

    // ========== CAPA 6: Rueda de 360° (marcas de grados) ==========
    const circuloGradosExterno = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circuloGradosExterno.setAttribute("cx", String(CENTRO_X));
    circuloGradosExterno.setAttribute("cy", String(CENTRO_Y));
    circuloGradosExterno.setAttribute("r", String(RADIO_GRADOS));
    circuloGradosExterno.setAttribute("class", "circulo-grados");
    lienzoSvg.appendChild(circuloGradosExterno);

    for (let g = 0; g < 360; g += 10) {
      const rad = ajustarAngulo(g);
      const x = Math.round(CENTRO_X + RADIO_GRADOS * Math.cos(rad));
      const y = Math.round(CENTRO_Y + RADIO_GRADOS * Math.sin(rad));
      const punto = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      punto.setAttribute("cx", String(x));
      punto.setAttribute("cy", String(y));
      punto.setAttribute("r", "1");
      punto.setAttribute("class", "punto-grado");
      lienzoSvg.appendChild(punto);
    }
    for (let g = 0; g < 360; g += 30) {
      const rad = ajustarAngulo(g);
      const x = Math.round(CENTRO_X + RADIO_GRADOS * Math.cos(rad));
      const y = Math.round(CENTRO_Y + RADIO_GRADOS * Math.sin(rad));
      const punto = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      punto.setAttribute("cx", String(x));
      punto.setAttribute("cy", String(y));
      punto.setAttribute("r", "1.5");
      punto.setAttribute("class", "punto-grado");
      lienzoSvg.appendChild(punto);
    }

    const circuloGradosInterno = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circuloGradosInterno.setAttribute("cx", String(CENTRO_X));
    circuloGradosInterno.setAttribute("cy", String(CENTRO_Y));
    circuloGradosInterno.setAttribute("r", String(RADIO_ASPECTOS));
    circuloGradosInterno.setAttribute("class", "circulo-grados");
    lienzoSvg.appendChild(circuloGradosInterno);

    for (let g = 0; g < 360; g += 10) {
      const rad = ajustarAngulo(g);
      const x = Math.round(CENTRO_X + RADIO_ASPECTOS * Math.cos(rad));
      const y = Math.round(CENTRO_Y + RADIO_ASPECTOS * Math.sin(rad));
      const punto = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      punto.setAttribute("cx", String(x));
      punto.setAttribute("cy", String(y));
      punto.setAttribute("r", "1");
      punto.setAttribute("class", "punto-grado");
      lienzoSvg.appendChild(punto);
    }
    for (let g = 0; g < 360; g += 30) {
      const rad = ajustarAngulo(g);
      const x = Math.round(CENTRO_X + RADIO_ASPECTOS * Math.cos(rad));
      const y = Math.round(CENTRO_Y + RADIO_ASPECTOS * Math.sin(rad));
      const punto = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      punto.setAttribute("cx", String(x));
      punto.setAttribute("cy", String(y));
      punto.setAttribute("r", "1.5");
      punto.setAttribute("class", "punto-grado");
      lienzoSvg.appendChild(punto);
    }

    // ========== CAPA 7: Aspectos planetarios (con Nodo Sur) ==========
    const circuloAspectos = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circuloAspectos.setAttribute("cx", String(CENTRO_X));
    circuloAspectos.setAttribute("cy", String(CENTRO_Y));
    circuloAspectos.setAttribute("r", String(RADIO_ASPECTOS));
    circuloAspectos.setAttribute("fill", "none");
    circuloAspectos.setAttribute("stroke", "none");
    lienzoSvg.appendChild(circuloAspectos);

    const planetasValidos = {};
    for (const [nombre, pos] of Object.entries(planetas)) {
      if (pos !== 0) {
        planetasValidos[nombre] = pos;
      }
    }
    const nombres = Object.keys(planetasValidos);
    if (nombres.length >= 2) {
      for (let i = 0; i < nombres.length; i++) {
        for (let j = i + 1; j < nombres.length; j++) {
          const p1 = nombres[i];
          const p2 = nombres[j];

          // No dibujar aspecto entre Nodo Norte y Nodo Sur
          if ((p1 === 'NODO_NORTE' && p2 === 'NODO_SUR') ||
              (p1 === 'NODO_SUR' && p2 === 'NODO_NORTE')) {
            continue;
          }

          if (p1 === 'QUIRON' || p2 === 'QUIRON') continue;
          const pos1 = planetasValidos[p1];
          const pos2 = planetasValidos[p2];
          let diff = Math.abs(pos1 - pos2) % 360;
          if (diff > 180) diff = 360 - diff;

          let orb = 0;
          // Para Nodo Norte y Nodo Sur, usar el orbe del otro planeta
          if (p1 === 'NODO_NORTE' || p1 === 'NODO_SUR') {
            orb = orbesPlanetarios[p2] || 0;
          } else if (p2 === 'NODO_NORTE' || p2 === 'NODO_SUR') {
            orb = orbesPlanetarios[p1] || 0;
          } else {
            orb = Math.max(orbesPlanetarios[p1] || 0, orbesPlanetarios[p2] || 0);
          }
          if (orb === 0) continue;

          const aspectos = [
            { tipo: 'conjuncion', angulo: 0 },
            { tipo: 'sextil', angulo: 60 },
            { tipo: 'cuadratura', angulo: 90 },
            { tipo: 'trigono', angulo: 120 },
            { tipo: 'oposicion', angulo: 180 }
          ];
          for (const asp of aspectos) {
            if (Math.abs(diff - asp.angulo) <= orb) {
              const rad1 = ajustarAngulo(pos1);
              const rad2 = ajustarAngulo(pos2);
              const x1 = Math.round(CENTRO_X + RADIO_ASPECTOS * Math.cos(rad1));
              const y1 = Math.round(CENTRO_Y + RADIO_ASPECTOS * Math.sin(rad1));
              const x2 = Math.round(CENTRO_X + RADIO_ASPECTOS * Math.cos(rad2));
              const y2 = Math.round(CENTRO_Y + RADIO_ASPECTOS * Math.sin(rad2));
              const lineaAspecto = document.createElementNS("http://www.w3.org/2000/svg", "line");
              lineaAspecto.setAttribute("x1", String(x1));
              lineaAspecto.setAttribute("y1", String(y1));
              lineaAspecto.setAttribute("x2", String(x2));
              lineaAspecto.setAttribute("y2", String(y2));
              lineaAspecto.setAttribute("class", `aspecto aspecto-${asp.tipo}`);
              lienzoSvg.appendChild(lineaAspecto);
              break;
            }
          }
        }
      }
    }

    // ========== CAPA 8: Ejes, marcas de posición y planetas ==========
    if (mostrarContenido) {
      // Eje ASC
      const radAsc = ajustarAngulo(ascendenteAbs);
      const xAsc1 = CENTRO_X + RADIO_TERMINOS_INTERIOR * Math.cos(radAsc);
      const yAsc1 = CENTRO_Y + RADIO_TERMINOS_INTERIOR * Math.sin(radAsc);
      const xAsc2 = CENTRO_X + (RADIO_TERMINOS_INTERIOR - 60) * Math.cos(radAsc);
      const yAsc2 = CENTRO_Y + (RADIO_TERMINOS_INTERIOR - 60) * Math.sin(radAsc);
      const lineaAsc = document.createElementNS("http://www.w3.org/2000/svg", "line");
      lineaAsc.setAttribute("x1", String(xAsc1));
      lineaAsc.setAttribute("y1", String(yAsc1));
      lineaAsc.setAttribute("x2", String(xAsc2));
      lineaAsc.setAttribute("y2", String(yAsc2));
      lineaAsc.setAttribute("class", "linea-eje");
      lienzoSvg.appendChild(lineaAsc);

      const xAscIcono = CENTRO_X + (RADIO_TERMINOS_INTERIOR - 80) * Math.cos(radAsc);
      const yAscIcono = CENTRO_Y + (RADIO_TERMINOS_INTERIOR - 80) * Math.sin(radAsc);
      const imgAsc = document.createElementNS("http://www.w3.org/2000/svg", "image");
      imgAsc.setAttribute("x", String(xAscIcono - 10));
      imgAsc.setAttribute("y", String(yAscIcono - 10));
      imgAsc.setAttribute("class", "icono-eje");
      imgAsc.setAttribute("href", "svg/asc.svg");
      lienzoSvg.appendChild(imgAsc);

      // Eje MC
      const radMc = ajustarAngulo(mcAbs);
      const xMc1 = CENTRO_X + RADIO_TERMINOS_INTERIOR * Math.cos(radMc);
      const yMc1 = CENTRO_Y + RADIO_TERMINOS_INTERIOR * Math.sin(radMc);
      const xMc2 = CENTRO_X + (RADIO_TERMINOS_INTERIOR - 60) * Math.cos(radMc);
      const yMc2 = CENTRO_Y + (RADIO_TERMINOS_INTERIOR - 60) * Math.sin(radMc);
      const lineaMc = document.createElementNS("http://www.w3.org/2000/svg", "line");
      lineaMc.setAttribute("x1", String(xMc1));
      lineaMc.setAttribute("y1", String(yMc1));
      lineaMc.setAttribute("x2", String(xMc2));
      lineaMc.setAttribute("y2", String(yMc2));
      lineaMc.setAttribute("class", "linea-eje");
      lienzoSvg.appendChild(lineaMc);

      const xMcIcono = CENTRO_X + (RADIO_TERMINOS_INTERIOR - 80) * Math.cos(radMc);
      const yMcIcono = CENTRO_Y + (RADIO_TERMINOS_INTERIOR - 80) * Math.sin(radMc);
      const imgMc = document.createElementNS("http://www.w3.org/2000/svg", "image");
      imgMc.setAttribute("x", String(xMcIcono - 10));
      imgMc.setAttribute("y", String(yMcIcono - 10));
      imgMc.setAttribute("class", "icono-eje");
      imgMc.setAttribute("href", "svg/mc.svg");
      lienzoSvg.appendChild(imgMc);

      // ---------- OBTENER DATOS DE PLANETAS Y EJES PARA LA SEPARACIÓN ----------
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

      const radioPlaneta = RADIO_PLANETAS;
      const planetasData = [];
      for (const nombre of cuerpos) {
        if (planetas.hasOwnProperty(nombre)) {
          const gradosAbsolutos = planetas[nombre];
          const radPlaneta = ajustarAngulo(gradosAbsolutos);
          const xPlaneta = Math.round(CENTRO_X + radioPlaneta * Math.cos(radPlaneta));
          const yPlaneta = Math.round(CENTRO_Y + radioPlaneta * Math.sin(radPlaneta));
          const datosPlaneta = datosPlanetasForm[nombre] || { g: 0, m: 0, retrogrado: false };
          planetasData.push({
            nombre,
            tipo: 'planeta',
            gradosAbsolutos,
            radPlaneta,
            xPlaneta,
            yPlaneta,
            datosPlaneta
          });
        }
      }

      const ejesData = [
        {
          nombre: 'ASC',
          tipo: 'eje',
          gradosAbsolutos: ascendenteAbs,
          radPlaneta: radAsc,
          xPlaneta: xAsc2,
          yPlaneta: yAsc2,
          datosPlaneta: { retrogrado: false }
        },
        {
          nombre: 'MC',
          tipo: 'eje',
          gradosAbsolutos: mcAbs,
          radPlaneta: radMc,
          xPlaneta: xMc2,
          yPlaneta: yMc2,
          datosPlaneta: { retrogrado: false }
        }
      ];

      const todosLosPuntos = [...planetasData, ...ejesData];
      todosLosPuntos.sort((a, b) => a.gradosAbsolutos - b.gradosAbsolutos);

      // ---- AGRUPACIÓN Y CÁLCULO DE DESPLAZAMIENTOS (con umbral fijo) ----
      const grupos = [];
      let grupoActual = [];
      for (let i = 0; i < todosLosPuntos.length; i++) {
        if (grupoActual.length === 0) {
          grupoActual.push(todosLosPuntos[i]);
        } else {
          const ultimo = grupoActual[grupoActual.length - 1];
          const diff = todosLosPuntos[i].gradosAbsolutos - ultimo.gradosAbsolutos;
          if (diff <= UMBRAL_FIJO) {
            grupoActual.push(todosLosPuntos[i]);
          } else {
            grupos.push(grupoActual);
            grupoActual = [todosLosPuntos[i]];
          }
        }
      }
      if (grupoActual.length > 0) grupos.push(grupoActual);

      const desplazamientos = {};

      for (const grupo of grupos) {
        const n = grupo.length;
        if (n === 1) {
          desplazamientos[grupo[0].nombre] = { dx: 0, dy: 0 };
          continue;
        }

        // Usamos la separación fija (distancia entre centros)
        const separacion = SEPARACION_FIJA;

        // Ángulo de referencia (el del primer elemento del grupo)
        const radRef = grupo[0].radPlaneta;
        const tangenteX = -Math.sin(radRef);
        const tangenteY = Math.cos(radRef);

        // Fórmula original: offset = ((n-1)/2 - i) * separacion
        for (let i = 0; i < n; i++) {
          const offset = ((n - 1) / 2 - i) * separacion;
          const dx = Math.round(offset * tangenteX);
          const dy = Math.round(offset * tangenteY);
          desplazamientos[grupo[i].nombre] = { dx, dy };
        }

        // Los ejes (ASC, MC) no se desplazan
        for (const punto of grupo) {
          if (punto.tipo === 'eje') {
            desplazamientos[punto.nombre] = { dx: 0, dy: 0 };
          }
        }
      }

      // Dibujar planetas
      for (const p of planetasData) {
        const nombre = p.nombre;
        const radPlaneta = p.radPlaneta;
        const xPlaneta = p.xPlaneta;
        const yPlaneta = p.yPlaneta;
        const datosPlaneta = p.datosPlaneta;

        const xInicio = CENTRO_X + RADIO_GRADOS * Math.cos(radPlaneta);
        const yInicio = CENTRO_Y + RADIO_GRADOS * Math.sin(radPlaneta);
        const radioFinMarca = RADIO_GRADOS - 10;
        const xFin = CENTRO_X + radioFinMarca * Math.cos(radPlaneta);
        const yFin = CENTRO_Y + radioFinMarca * Math.sin(radPlaneta);
        const lineaPosicion = document.createElementNS("http://www.w3.org/2000/svg", "line");
        lineaPosicion.setAttribute("x1", String(xInicio));
        lineaPosicion.setAttribute("y1", String(yInicio));
        lineaPosicion.setAttribute("x2", String(xFin));
        lineaPosicion.setAttribute("y2", String(yFin));
        lineaPosicion.setAttribute("class", "linea-posicion-planeta");
        lienzoSvg.appendChild(lineaPosicion);

        const xInicioAsp = CENTRO_X + RADIO_ASPECTOS * Math.cos(radPlaneta);
        const yInicioAsp = CENTRO_Y + RADIO_ASPECTOS * Math.sin(radPlaneta);
        const radioFinAsp = RADIO_ASPECTOS + 10;
        const xFinAsp = CENTRO_X + radioFinAsp * Math.cos(radPlaneta);
        const yFinAsp = CENTRO_Y + radioFinAsp * Math.sin(radPlaneta);
        const lineaPosicionAsp = document.createElementNS("http://www.w3.org/2000/svg", "line");
        lineaPosicionAsp.setAttribute("x1", String(xInicioAsp));
        lineaPosicionAsp.setAttribute("y1", String(yInicioAsp));
        lineaPosicionAsp.setAttribute("x2", String(xFinAsp));
        lineaPosicionAsp.setAttribute("y2", String(yFinAsp));
        lineaPosicionAsp.setAttribute("class", "linea-posicion-planeta");
        lienzoSvg.appendChild(lineaPosicionAsp);

        const desp = desplazamientos[nombre] || { dx: 0, dy: 0 };
        const xIcono = xPlaneta + desp.dx;
        const yIcono = yPlaneta + desp.dy;

        const nombreSVG = nombre.toLowerCase().replace('_', '-');
        const rutaSVG = `svg/${nombreSVG}.svg`;
        const imgPlaneta = document.createElementNS("http://www.w3.org/2000/svg", "image");
        imgPlaneta.setAttribute("x", String(xIcono - 10));
        imgPlaneta.setAttribute("y", String(yIcono - 10));
        imgPlaneta.setAttribute("class", "icono-planeta");
        imgPlaneta.setAttribute("href", rutaSVG);
        lienzoSvg.appendChild(imgPlaneta);

        if (datosPlaneta.retrogrado) {
          const offsetX = 10;
          const offsetY = 10;
          const xR = xIcono + offsetX;
          const yR = yIcono + offsetY;
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