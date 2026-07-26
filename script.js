document.addEventListener("DOMContentLoaded", () => {
  const botonGenerar = document.getElementById("btn-generar");
  const botonBorrar = document.getElementById("btn-borrar");
  const botonDescargarPNG = document.getElementById("btn-descargar-png");
  const lienzoSvg = document.getElementById("carta-astral");

  const CENTRO_X = 300;
  const CENTRO_Y = 300;

  const RADIO_EXTERIOR = 295;
  const RADIO_SIGNOS_INTERIOR = 265;
  const RADIO_DECANATOS_INTERIOR = 240;
  const RADIO_PLANETAS = 190;
  const RADIO_TEXTO_SIGNOS = 275;
  const RADIO_SIMBOLOS_DECANATOS = 253;
  const RADIO_GRADOS = 230;
  const RADIO_ASPECTOS = 135;

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
    "NODO_NORTE": "☊"
  };

  const cuerpos = Object.keys(simbolos);

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
  botonDescargarPNG.addEventListener("click", descargarPNG);

  cargarValoresGuardados();

  // ------------------------------------------------------------
  //  FUNCIÓN PARA DESCARGAR PNG CON IMÁGENES INCRUSTADAS
  // ------------------------------------------------------------
  async function descargarPNG() {
    const svgOriginal = document.getElementById("carta-astral");
    const clon = svgOriginal.cloneNode(true);

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
    img.onload = function() {
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 600;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "carta_astral.png";
      link.href = pngUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };
    img.onerror = function() {
      console.error("Error al cargar el SVG con imágenes incrustadas.");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  // ------------------------------------------------------------
  //  FUNCIÓN PRINCIPAL DE DIBUJO (CON DOS CORONAS)
  // ------------------------------------------------------------
  function dibujarRadixManual(ascendenteAbs, mcAbs, planetas, mostrarContenido) {
    while (lienzoSvg.firstChild) {
      lienzoSvg.removeChild(lienzoSvg.firstChild);
    }

    const indiceSignoCuspide = Math.floor(ascendenteAbs / 30);
    const inicioSignoCuspideG = indiceSignoCuspide * 30;
    const desfaceG = 180 + inicioSignoCuspideG;

    function ajustarAngulo(gradosOriginales) {
      return (desfaceG - gradosOriginales) * (Math.PI / 180);
    }

    // --- CAPA 1: Círculos base y fondo de la franja de signos ---
    const circuloExterior = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circuloExterior.setAttribute("cx", String(CENTRO_X));
    circuloExterior.setAttribute("cy", String(CENTRO_Y));
    circuloExterior.setAttribute("r", String(RADIO_EXTERIOR));
    circuloExterior.setAttribute("stroke", "#1038a2");
    circuloExterior.setAttribute("stroke-width", "1.5");
    circuloExterior.setAttribute("fill", "none");
    lienzoSvg.appendChild(circuloExterior);

    // PRIMERA CORONA (exterior, entre RADIO_EXTERIOR y RADIO_SIGNOS_INTERIOR)
    const pathCoronaExterior = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const dCoronaExterior = `
      M ${CENTRO_X - RADIO_EXTERIOR} ${CENTRO_Y}
      A ${RADIO_EXTERIOR} ${RADIO_EXTERIOR} 0 1,1 ${CENTRO_X + RADIO_EXTERIOR} ${CENTRO_Y}
      A ${RADIO_EXTERIOR} ${RADIO_EXTERIOR} 0 1,1 ${CENTRO_X - RADIO_EXTERIOR} ${CENTRO_Y} Z
      M ${CENTRO_X - RADIO_SIGNOS_INTERIOR} ${CENTRO_Y}
      A ${RADIO_SIGNOS_INTERIOR} ${RADIO_SIGNOS_INTERIOR} 0 1,0 ${CENTRO_X + RADIO_SIGNOS_INTERIOR} ${CENTRO_Y}
      A ${RADIO_SIGNOS_INTERIOR} ${RADIO_SIGNOS_INTERIOR} 0 1,0 ${CENTRO_X - RADIO_SIGNOS_INTERIOR} ${CENTRO_Y} Z
    `;
    pathCoronaExterior.setAttribute("d", dCoronaExterior);
    pathCoronaExterior.setAttribute("fill-rule", "evenodd");
    pathCoronaExterior.setAttribute("fill", "#1038a2");
    pathCoronaExterior.setAttribute("stroke", "none");
    pathCoronaExterior.setAttribute("opacity", "0.8");
    lienzoSvg.appendChild(pathCoronaExterior);

    const circuloSignosInterior = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circuloSignosInterior.setAttribute("cx", String(CENTRO_X));
    circuloSignosInterior.setAttribute("cy", String(CENTRO_Y));
    circuloSignosInterior.setAttribute("r", String(RADIO_SIGNOS_INTERIOR));
    circuloSignosInterior.setAttribute("stroke", "#1038a2");
    circuloSignosInterior.setAttribute("stroke-width", "1.5");
    circuloSignosInterior.setAttribute("fill", "none");
    lienzoSvg.appendChild(circuloSignosInterior);

    // SEGUNDA CORONA (interior, entre RADIO_SIGNOS_INTERIOR y RADIO_DECANATOS_INTERIOR)
    const pathCoronaInterior = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const dCoronaInterior = `
      M ${CENTRO_X - RADIO_SIGNOS_INTERIOR} ${CENTRO_Y}
      A ${RADIO_SIGNOS_INTERIOR} ${RADIO_SIGNOS_INTERIOR} 0 1,1 ${CENTRO_X + RADIO_SIGNOS_INTERIOR} ${CENTRO_Y}
      A ${RADIO_SIGNOS_INTERIOR} ${RADIO_SIGNOS_INTERIOR} 0 1,1 ${CENTRO_X - RADIO_SIGNOS_INTERIOR} ${CENTRO_Y} Z
      M ${CENTRO_X - RADIO_DECANATOS_INTERIOR} ${CENTRO_Y}
      A ${RADIO_DECANATOS_INTERIOR} ${RADIO_DECANATOS_INTERIOR} 0 1,0 ${CENTRO_X + RADIO_DECANATOS_INTERIOR} ${CENTRO_Y}
      A ${RADIO_DECANATOS_INTERIOR} ${RADIO_DECANATOS_INTERIOR} 0 1,0 ${CENTRO_X - RADIO_DECANATOS_INTERIOR} ${CENTRO_Y} Z
    `;
    pathCoronaInterior.setAttribute("d", dCoronaInterior);
    pathCoronaInterior.setAttribute("fill-rule", "evenodd");
    pathCoronaInterior.setAttribute("fill", "#1038a2");
    pathCoronaInterior.setAttribute("stroke", "none");
    pathCoronaInterior.setAttribute("opacity", "0.6");
    lienzoSvg.appendChild(pathCoronaInterior);

    const circuloDecanatosInterior = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circuloDecanatosInterior.setAttribute("cx", String(CENTRO_X));
    circuloDecanatosInterior.setAttribute("cy", String(CENTRO_Y));
    circuloDecanatosInterior.setAttribute("r", String(RADIO_DECANATOS_INTERIOR));
    circuloDecanatosInterior.setAttribute("stroke", "#1038a2");
    circuloDecanatosInterior.setAttribute("stroke-width", "1.5");
    circuloDecanatosInterior.setAttribute("fill", "none");
    lienzoSvg.appendChild(circuloDecanatosInterior);

    // --- CAPA 2: Líneas de los SIGNOS (30°) ---
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
      linea.setAttribute("stroke", "#1038a2");
      linea.setAttribute("stroke-width", "1.5");
      lienzoSvg.appendChild(linea);
    }

    // --- CAPA 3: Líneas de los DECANATOS (0°, 10°, 20° de cada signo) ---
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
        linea.setAttribute("stroke", "#1038a2");
        linea.setAttribute("stroke-width", "1.5");
        lienzoSvg.appendChild(linea);
      }
    }

    // --- CAPA 4: Nombres de los signos ---
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
      etiquetaTexto.setAttribute("font-family", "'IM Fell DW Pica', serif");
      etiquetaTexto.setAttribute("font-size", "14");
      etiquetaTexto.setAttribute("font-weight", "400");
      etiquetaTexto.setAttribute("fill", "#ffffff");
      const trayectoTexto = document.createElementNS("http://www.w3.org/2000/svg", "textPath");
      trayectoTexto.setAttribute("href", `#${idTrayecto}`);
      trayectoTexto.setAttribute("startOffset", "50%");
      trayectoTexto.setAttribute("text-anchor", "middle");
      trayectoTexto.textContent = nombresSignos[i];
      etiquetaTexto.appendChild(trayectoTexto);
      lienzoSvg.appendChild(etiquetaTexto);
    }

    // --- CAPA 5: Símbolos de los decanatos ---
    for (let i = 0; i < 12; i++) {
      const decanatosSigno = decanatos[i];
      if (!decanatosSigno) continue;
      for (let d = 0; d < 3; d++) {
        const gradoCentral = i * 30 + d * 10 + 5;
        const rad = ajustarAngulo(gradoCentral);
        const x = Math.round(CENTRO_X + RADIO_SIMBOLOS_DECANATOS * Math.cos(rad));
        const y = Math.round(CENTRO_Y + RADIO_SIMBOLOS_DECANATOS * Math.sin(rad));
        const nombrePlaneta = decanatosSigno[d];
        const nombreSVG = nombrePlaneta.toLowerCase().replace('_', '-');
        const rutaSVG = `svg/${nombreSVG}.svg`;
        const imgDecanato = document.createElementNS("http://www.w3.org/2000/svg", "image");
        imgDecanato.setAttribute("x", String(x - 7));
        imgDecanato.setAttribute("y", String(y - 7));
        imgDecanato.setAttribute("width", "14");
        imgDecanato.setAttribute("height", "14");
        imgDecanato.setAttribute("href", rutaSVG);
        lienzoSvg.appendChild(imgDecanato);
      }
    }

    // --- CAPA 6: Rueda de 360° (marcas de grados) ---
    const circuloGradosExterno = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circuloGradosExterno.setAttribute("cx", String(CENTRO_X));
    circuloGradosExterno.setAttribute("cy", String(CENTRO_Y));
    circuloGradosExterno.setAttribute("r", String(RADIO_GRADOS));
    circuloGradosExterno.setAttribute("stroke", "#1038a2");
    circuloGradosExterno.setAttribute("stroke-width", "0.5");
    circuloGradosExterno.setAttribute("stroke-dasharray", "2,2");
    circuloGradosExterno.setAttribute("fill", "none");
    lienzoSvg.appendChild(circuloGradosExterno);

    for (let g = 0; g < 360; g += 10) {
      const rad = ajustarAngulo(g);
      const x = Math.round(CENTRO_X + RADIO_GRADOS * Math.cos(rad));
      const y = Math.round(CENTRO_Y + RADIO_GRADOS * Math.sin(rad));
      const punto = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      punto.setAttribute("cx", String(x));
      punto.setAttribute("cy", String(y));
      punto.setAttribute("r", "1");
      punto.setAttribute("fill", "#1038a2");
      punto.setAttribute("opacity", "1");
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
      punto.setAttribute("fill", "#1038a2");
      punto.setAttribute("opacity", "1");
      lienzoSvg.appendChild(punto);
    }

    const circuloGradosInterno = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circuloGradosInterno.setAttribute("cx", String(CENTRO_X));
    circuloGradosInterno.setAttribute("cy", String(CENTRO_Y));
    circuloGradosInterno.setAttribute("r", String(RADIO_ASPECTOS));
    circuloGradosInterno.setAttribute("stroke", "#1038a2");
    circuloGradosInterno.setAttribute("stroke-width", "0.5");
    circuloGradosInterno.setAttribute("stroke-dasharray", "2,2");
    circuloGradosInterno.setAttribute("fill", "none");
    lienzoSvg.appendChild(circuloGradosInterno);

    for (let g = 0; g < 360; g += 10) {
      const rad = ajustarAngulo(g);
      const x = Math.round(CENTRO_X + RADIO_ASPECTOS * Math.cos(rad));
      const y = Math.round(CENTRO_Y + RADIO_ASPECTOS * Math.sin(rad));
      const punto = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      punto.setAttribute("cx", String(x));
      punto.setAttribute("cy", String(y));
      punto.setAttribute("r", "1");
      punto.setAttribute("fill", "#1038a2");
      punto.setAttribute("opacity", "1");
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
      punto.setAttribute("fill", "#1038a2");
      punto.setAttribute("opacity", "1");
      lienzoSvg.appendChild(punto);
    }

    // --- CAPA 7: Aspectos planetarios ---
    const circuloAspectos = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circuloAspectos.setAttribute("cx", String(CENTRO_X));
    circuloAspectos.setAttribute("cy", String(CENTRO_Y));
    circuloAspectos.setAttribute("r", String(RADIO_ASPECTOS));
    circuloAspectos.setAttribute("stroke", "none");
    circuloAspectos.setAttribute("stroke-width", "0");
    circuloAspectos.setAttribute("fill", "none");
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
          const pos1 = planetasValidos[p1];
          const pos2 = planetasValidos[p2];
          let diff = Math.abs(pos1 - pos2) % 360;
          if (diff > 180) diff = 360 - diff;
          const orbe = (p1 === 'LUNA' || p2 === 'LUNA') ? 13 : 3;
          const aspectos = [
            { tipo: 'conjuncion', angulo: 0, strokeWidth: 1.5, dasharray: null, opacity: 0.8 },
            { tipo: 'sextil', angulo: 60, strokeWidth: 1.5, dasharray: '2,5', opacity: 0.6 },
            { tipo: 'cuadratura', angulo: 90, strokeWidth: 1.5, dasharray: null, opacity: 0.6 },
            { tipo: 'trígono', angulo: 120, strokeWidth: 1.5, dasharray: '5,10', opacity: 0.8 },
            { tipo: 'oposicion', angulo: 180, strokeWidth: 1.5, dasharray: null, opacity: 0.8 }
          ];
          for (const asp of aspectos) {
            if (Math.abs(diff - asp.angulo) <= orbe) {
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
              lineaAspecto.setAttribute("stroke", "#1038a2");
              lineaAspecto.setAttribute("stroke-linecap", "round");
              lineaAspecto.setAttribute("stroke-linejoin", "round");
              lineaAspecto.setAttribute("stroke-width", String(asp.strokeWidth));
              if (asp.dasharray) {
                lineaAspecto.setAttribute("stroke-dasharray", asp.dasharray);
              }
              lineaAspecto.setAttribute("opacity", String(asp.opacity));
              lienzoSvg.appendChild(lineaAspecto);
              break;
            }
          }
        }
      }
    }

    // --- CAPA 8: Ejes, marcas de posición y planetas ---
    if (mostrarContenido) {
      // Eje ASC
      const radAsc = ajustarAngulo(ascendenteAbs);
      const xAsc1 = Math.round(CENTRO_X + RADIO_DECANATOS_INTERIOR * Math.cos(radAsc));
      const yAsc1 = Math.round(CENTRO_Y + RADIO_DECANATOS_INTERIOR * Math.sin(radAsc));
      const xAsc2 = Math.round(CENTRO_X + (RADIO_DECANATOS_INTERIOR - 50) * Math.cos(radAsc));
      const yAsc2 = Math.round(CENTRO_Y + (RADIO_DECANATOS_INTERIOR - 50) * Math.sin(radAsc));
      const lineaAsc = document.createElementNS("http://www.w3.org/2000/svg", "line");
      lineaAsc.setAttribute("x1", String(xAsc1));
      lineaAsc.setAttribute("y1", String(yAsc1));
      lineaAsc.setAttribute("x2", String(xAsc2));
      lineaAsc.setAttribute("y2", String(yAsc2));
      lineaAsc.setAttribute("stroke", "#1038a2");
      lineaAsc.setAttribute("opacity", "0.8");
      lineaAsc.setAttribute("stroke-width", "2");
      lineaAsc.setAttribute("stroke-linecap", "round");
      lienzoSvg.appendChild(lineaAsc);

      const xAscTxt = Math.round(CENTRO_X + (RADIO_DECANATOS_INTERIOR - 70) * Math.cos(radAsc));
      const yAscTxt = Math.round(CENTRO_Y + (RADIO_DECANATOS_INTERIOR - 70) * Math.sin(radAsc)) + 6;
      const txtAsc = document.createElementNS("http://www.w3.org/2000/svg", "text");
      txtAsc.setAttribute("x", String(xAscTxt));
      txtAsc.setAttribute("y", String(yAscTxt));
      txtAsc.setAttribute("font-family", "'IM Fell DW Pica', serif");
      txtAsc.setAttribute("font-size", "12");
      txtAsc.setAttribute("font-weight", "400");
      txtAsc.setAttribute("text-anchor", "middle");
      txtAsc.setAttribute("fill", "#1038a2");
      txtAsc.textContent = "ASC";
      lienzoSvg.appendChild(txtAsc);

      // Eje MC
      const radMc = ajustarAngulo(mcAbs);
      const xMc1 = Math.round(CENTRO_X + RADIO_DECANATOS_INTERIOR * Math.cos(radMc));
      const yMc1 = Math.round(CENTRO_Y + RADIO_DECANATOS_INTERIOR * Math.sin(radMc));
      const xMc2 = Math.round(CENTRO_X + (RADIO_DECANATOS_INTERIOR - 50) * Math.cos(radMc));
      const yMc2 = Math.round(CENTRO_Y + (RADIO_DECANATOS_INTERIOR - 50) * Math.sin(radMc));
      const lineaMc = document.createElementNS("http://www.w3.org/2000/svg", "line");
      lineaMc.setAttribute("x1", String(xMc1));
      lineaMc.setAttribute("y1", String(yMc1));
      lineaMc.setAttribute("x2", String(xMc2));
      lineaMc.setAttribute("y2", String(yMc2));
      lineaMc.setAttribute("stroke", "#1038a2");
      lineaMc.setAttribute("opacity", "0.8");
      lineaMc.setAttribute("stroke-width", "2");
      lineaMc.setAttribute("stroke-linecap", "round");
      lienzoSvg.appendChild(lineaMc);

      const xMcTxt = Math.round(CENTRO_X + (RADIO_DECANATOS_INTERIOR - 70) * Math.cos(radMc));
      const yMcTxt = Math.round(CENTRO_Y + (RADIO_DECANATOS_INTERIOR - 70) * Math.sin(radMc)) + 6;
      const txtMc = document.createElementNS("http://www.w3.org/2000/svg", "text");
      txtMc.setAttribute("x", String(xMcTxt));
      txtMc.setAttribute("y", String(yMcTxt));
      txtMc.setAttribute("font-family", "'IM Fell DW Pica', serif");
      txtMc.setAttribute("font-size", "12");
      txtMc.setAttribute("font-weight", "400");
      txtMc.setAttribute("text-anchor", "middle");
      txtMc.setAttribute("fill", "#1038a2");
      txtMc.textContent = "MC";
      lienzoSvg.appendChild(txtMc);

      // Obtener datos de retrógrado
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
            gradosAbsolutos,
            radPlaneta,
            xPlaneta,
            yPlaneta,
            datosPlaneta
          });
        }
      }

      // Ordenar por posición angular
      planetasData.sort((a, b) => a.gradosAbsolutos - b.gradosAbsolutos);

      // Separación entre planetas
      const umbral = 12;
      const grupos = [];
      let grupoActual = [];
      for (let i = 0; i < planetasData.length; i++) {
        if (grupoActual.length === 0) {
          grupoActual.push(planetasData[i]);
        } else {
          const ultimo = grupoActual[grupoActual.length - 1];
          const diff = planetasData[i].gradosAbsolutos - ultimo.gradosAbsolutos;
          if (diff <= umbral) {
            grupoActual.push(planetasData[i]);
          } else {
            grupos.push(grupoActual);
            grupoActual = [planetasData[i]];
          }
        }
      }
      if (grupoActual.length > 0) grupos.push(grupoActual);

      const separacionGrupo = 25;
      const desplazamientos = {};
      for (const grupo of grupos) {
        const n = grupo.length;
        if (n === 1) {
          desplazamientos[grupo[0].nombre] = { dx: 0, dy: 0 };
        } else {
          const radRef = grupo[0].radPlaneta;
          const tangenteX = -Math.sin(radRef);
          const tangenteY = Math.cos(radRef);
          for (let i = 0; i < n; i++) {
            const offset = ((n - 1) / 2 - i) * separacionGrupo;
            const dx = Math.round(offset * tangenteX);
            const dy = Math.round(offset * tangenteY);
            desplazamientos[grupo[i].nombre] = { dx, dy };
          }
        }
      }

      // Dibujar marcas de posición y planetas
      for (const p of planetasData) {
        const nombre = p.nombre;
        const radPlaneta = p.radPlaneta;
        const xPlaneta = p.xPlaneta;
        const yPlaneta = p.yPlaneta;
        const datosPlaneta = p.datosPlaneta;

        // Marca desde rueda de grados
        const xInicio = Math.round(CENTRO_X + RADIO_GRADOS * Math.cos(radPlaneta));
        const yInicio = Math.round(CENTRO_Y + RADIO_GRADOS * Math.sin(radPlaneta));
        const radioFinMarca = RADIO_GRADOS - 10;
        const xFin = Math.round(CENTRO_X + radioFinMarca * Math.cos(radPlaneta));
        const yFin = Math.round(CENTRO_Y + radioFinMarca * Math.sin(radPlaneta));
        const lineaPosicion = document.createElementNS("http://www.w3.org/2000/svg", "line");
        lineaPosicion.setAttribute("x1", String(xInicio));
        lineaPosicion.setAttribute("y1", String(yInicio));
        lineaPosicion.setAttribute("x2", String(xFin));
        lineaPosicion.setAttribute("y2", String(yFin));
        lineaPosicion.setAttribute("stroke", "#1038a2");
        lineaPosicion.setAttribute("stroke-width", "1.5");
        lineaPosicion.setAttribute("opacity", "0.8");
        lineaPosicion.setAttribute("stroke-linecap", "round");
        lienzoSvg.appendChild(lineaPosicion);

        // Marca desde rueda de aspectos
        const xInicioAsp = Math.round(CENTRO_X + RADIO_ASPECTOS * Math.cos(radPlaneta));
        const yInicioAsp = Math.round(CENTRO_Y + RADIO_ASPECTOS * Math.sin(radPlaneta));
        const radioFinAsp = RADIO_ASPECTOS + 10;
        const xFinAsp = Math.round(CENTRO_X + radioFinAsp * Math.cos(radPlaneta));
        const yFinAsp = Math.round(CENTRO_Y + radioFinAsp * Math.sin(radPlaneta));
        const lineaPosicionAsp = document.createElementNS("http://www.w3.org/2000/svg", "line");
        lineaPosicionAsp.setAttribute("x1", String(xInicioAsp));
        lineaPosicionAsp.setAttribute("y1", String(yInicioAsp));
        lineaPosicionAsp.setAttribute("x2", String(xFinAsp));
        lineaPosicionAsp.setAttribute("y2", String(yFinAsp));
        lineaPosicionAsp.setAttribute("stroke", "#1038a2");
        lineaPosicionAsp.setAttribute("stroke-width", "1.5");
        lineaPosicionAsp.setAttribute("opacity", "0.8");
        lineaPosicionAsp.setAttribute("stroke-linecap", "round");
        lienzoSvg.appendChild(lineaPosicionAsp);

        // Desplazamiento para icono
        const desp = desplazamientos[nombre] || { dx: 0, dy: 0 };
        const xIcono = xPlaneta + desp.dx;
        const yIcono = yPlaneta + desp.dy;

        // Símbolo del planeta (SVG)
        const nombreSVG = nombre.toLowerCase().replace('_', '-');
        const rutaSVG = `svg/${nombreSVG}.svg`;
        const imgPlaneta = document.createElementNS("http://www.w3.org/2000/svg", "image");
        imgPlaneta.setAttribute("x", String(xIcono - 10));
        imgPlaneta.setAttribute("y", String(yIcono - 10));
        imgPlaneta.setAttribute("width", "20");
        imgPlaneta.setAttribute("height", "20");
        imgPlaneta.setAttribute("href", rutaSVG);
        lienzoSvg.appendChild(imgPlaneta);

        // Retrógrado
        if (datosPlaneta.retrogrado) {
          const offsetX = 10;
          const offsetY = 10;
          const xR = xIcono + offsetX;
          const yR = yIcono + offsetY;
          const txtRetro = document.createElementNS("http://www.w3.org/2000/svg", "text");
          txtRetro.setAttribute("x", String(xR));
          txtRetro.setAttribute("y", String(yR));
          txtRetro.setAttribute("font-family", "'IM Fell DW Pica', serif");
          txtRetro.setAttribute("font-style", "italic");
          txtRetro.setAttribute("font-size", "12");
          txtRetro.setAttribute("font-weight", "400");
          txtRetro.setAttribute("text-anchor", "start");
          txtRetro.setAttribute("dominant-baseline", "central");
          txtRetro.setAttribute("fill", "#1038a2");
          txtRetro.setAttribute("opacity", "0.6");
          txtRetro.textContent = "R";
          lienzoSvg.appendChild(txtRetro);
        }
      }
    }
  }
});