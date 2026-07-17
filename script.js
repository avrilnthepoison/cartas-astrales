document.addEventListener("DOMContentLoaded", () => {

    const botonGenerar = document.getElementById("btn-generar");
    const botonBorrar = document.getElementById("btn-borrar");
    const lienzoSvg = document.getElementById("carta-astral");

    const CENTRO_X = 300;
    const CENTRO_Y = 300;

    // Radios
    const RADIO_EXTERIOR = 295;
    const RADIO_SIGNOS_INTERIOR = 255;
    const RADIO_DECANATOS_INTERIOR = 225;
    const RADIO_PLANETAS = 200;
    const RADIO_TEXTO_SIGNOS = 270;
    const RADIO_SIMBOLOS_DECANATOS = 240;

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
    cargarValoresGuardados();

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

        // ---- CAPA 1: Círculos base ----
        const circuloExterior = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circuloExterior.setAttribute("cx", String(CENTRO_X));
        circuloExterior.setAttribute("cy", String(CENTRO_Y));
        circuloExterior.setAttribute("r", String(RADIO_EXTERIOR));
        circuloExterior.setAttribute("stroke", "#111111");
        circuloExterior.setAttribute("stroke-width", "2");
        circuloExterior.setAttribute("fill", "none");
        lienzoSvg.appendChild(circuloExterior);

        const circuloSignosInterior = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circuloSignosInterior.setAttribute("cx", String(CENTRO_X));
        circuloSignosInterior.setAttribute("cy", String(CENTRO_Y));
        circuloSignosInterior.setAttribute("r", String(RADIO_SIGNOS_INTERIOR));
        circuloSignosInterior.setAttribute("stroke", "#111111");
        circuloSignosInterior.setAttribute("stroke-width", "2");
        circuloSignosInterior.setAttribute("fill", "none");
        lienzoSvg.appendChild(circuloSignosInterior);

        const circuloDecanatosInterior = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circuloDecanatosInterior.setAttribute("cx", String(CENTRO_X));
        circuloDecanatosInterior.setAttribute("cy", String(CENTRO_Y));
        circuloDecanatosInterior.setAttribute("r", String(RADIO_DECANATOS_INTERIOR));
        circuloDecanatosInterior.setAttribute("stroke", "#111111");
        circuloDecanatosInterior.setAttribute("stroke-width", "2");
        circuloDecanatosInterior.setAttribute("fill", "none");
        lienzoSvg.appendChild(circuloDecanatosInterior);

        const puntoCentral = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        puntoCentral.setAttribute("cx", String(CENTRO_X));
        puntoCentral.setAttribute("cy", String(CENTRO_Y));
        puntoCentral.setAttribute("r", "5");
        puntoCentral.setAttribute("fill", "#111111");
        lienzoSvg.appendChild(puntoCentral);

        // ---- CAPA 2: Líneas de los SIGNOS (30°) ----
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
            linea.setAttribute("stroke", "#111111");
            linea.setAttribute("stroke-width", "2");
            lienzoSvg.appendChild(linea);
        }

        // ---- CAPA 3: Líneas de los DECANATOS (0°, 10°, 20° de cada signo) ----
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
                linea.setAttribute("stroke", "#111111");
                linea.setAttribute("stroke-width", "2");
                lienzoSvg.appendChild(linea);
            }
        }

        // ---- CAPA 4: Nombres de los signos ----
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
            etiquetaTexto.setAttribute("font-family", "'Inter', sans-serif");
            etiquetaTexto.setAttribute("font-size", "14");
            etiquetaTexto.setAttribute("font-weight", "800");
            etiquetaTexto.setAttribute("fill", "#111111");
            const trayectoTexto = document.createElementNS("http://www.w3.org/2000/svg", "textPath");
            trayectoTexto.setAttribute("href", `#${idTrayecto}`);
            trayectoTexto.setAttribute("startOffset", "50%");
            trayectoTexto.setAttribute("text-anchor", "middle");
            trayectoTexto.textContent = nombresSignos[i];
            etiquetaTexto.appendChild(trayectoTexto);
            lienzoSvg.appendChild(etiquetaTexto);
        }

        // ---- CAPA 5: Símbolos de los decanatos (usando <use>) ----
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

                const useDecanato = document.createElementNS("http://www.w3.org/2000/svg", "use");
                useDecanato.setAttribute("href", `#${nombreSVG}`);
                useDecanato.setAttribute("x", String(x - 8));
                useDecanato.setAttribute("y", String(y - 8));
                useDecanato.setAttribute("width", "16");
                useDecanato.setAttribute("height", "16");
                useDecanato.setAttribute("class", "planeta-decanato");
                lienzoSvg.appendChild(useDecanato);
            }
        }

        // ---- CAPA 6: Ejes, marcas de posición y planetas (usando <use>) ----
        if (mostrarContenido) {
            // Eje del Ascendente
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
            lineaAsc.setAttribute("stroke", "#111111");
            lineaAsc.setAttribute("stroke-width", "2.5");
            lineaAsc.setAttribute("stroke-linecap", "round");
            lienzoSvg.appendChild(lineaAsc);

            const xAscTxt = Math.round(CENTRO_X + (RADIO_DECANATOS_INTERIOR - 70) * Math.cos(radAsc));
            const yAscTxt = Math.round(CENTRO_Y + (RADIO_DECANATOS_INTERIOR - 70) * Math.sin(radAsc)) + 6;
            const txtAsc = document.createElementNS("http://www.w3.org/2000/svg", "text");
            txtAsc.setAttribute("x", String(xAscTxt));
            txtAsc.setAttribute("y", String(yAscTxt));
            txtAsc.setAttribute("font-family", "'Inter', sans-serif");
            txtAsc.setAttribute("font-size", "12");
            txtAsc.setAttribute("font-weight", "800");
            txtAsc.setAttribute("text-anchor", "middle");
            txtAsc.setAttribute("fill", "#111111");
            txtAsc.textContent = "ASC";
            lienzoSvg.appendChild(txtAsc);

            // Eje del Medio Cielo
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
            lineaMc.setAttribute("stroke", "#111111");
            lineaMc.setAttribute("stroke-width", "2.5");
            lineaMc.setAttribute("stroke-linecap", "round");
            lienzoSvg.appendChild(lineaMc);

            const xMcTxt = Math.round(CENTRO_X + (RADIO_DECANATOS_INTERIOR - 70) * Math.cos(radMc));
            const yMcTxt = Math.round(CENTRO_Y + (RADIO_DECANATOS_INTERIOR - 70) * Math.sin(radMc)) + 6;
            const txtMc = document.createElementNS("http://www.w3.org/2000/svg", "text");
            txtMc.setAttribute("x", String(xMcTxt));
            txtMc.setAttribute("y", String(yMcTxt));
            txtMc.setAttribute("font-family", "'Inter', sans-serif");
            txtMc.setAttribute("font-size", "12");
            txtMc.setAttribute("font-weight", "800");
            txtMc.setAttribute("text-anchor", "middle");
            txtMc.setAttribute("fill", "#111111");
            txtMc.textContent = "MC";
            lienzoSvg.appendChild(txtMc);

            // Obtener datos de retrogrado
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

            for (const nombre of cuerpos) {
                if (planetas.hasOwnProperty(nombre)) {
                    const gradosAbsolutos = planetas[nombre];
                    const radPlaneta = ajustarAngulo(gradosAbsolutos);
                    const xPlaneta = Math.round(CENTRO_X + radioPlaneta * Math.cos(radPlaneta));
                    const yPlaneta = Math.round(CENTRO_Y + radioPlaneta * Math.sin(radPlaneta));

                    // ---- MARCA DE POSICIÓN (línea radial) ----
                    const xInicio = Math.round(CENTRO_X + RADIO_DECANATOS_INTERIOR * Math.cos(radPlaneta));
                    const yInicio = Math.round(CENTRO_Y + RADIO_DECANATOS_INTERIOR * Math.sin(radPlaneta));
                    const radioFinMarca = RADIO_DECANATOS_INTERIOR - 10;
                    const xFin = Math.round(CENTRO_X + radioFinMarca * Math.cos(radPlaneta));
                    const yFin = Math.round(CENTRO_Y + radioFinMarca * Math.sin(radPlaneta));

                    const lineaPosicion = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    lineaPosicion.setAttribute("x1", String(xInicio));
                    lineaPosicion.setAttribute("y1", String(yInicio));
                    lineaPosicion.setAttribute("x2", String(xFin));
                    lineaPosicion.setAttribute("y2", String(yFin));
                    lineaPosicion.setAttribute("stroke", "#111111");
                    lineaPosicion.setAttribute("stroke-width", "1.5");
                    lineaPosicion.setAttribute("opacity", "1");
                    lineaPosicion.setAttribute("stroke-linecap", "round");
                    lienzoSvg.appendChild(lineaPosicion);

                    // 1. Símbolo del planeta usando <use> (en lugar de <image>)
                    const nombreSVG = nombre.toLowerCase().replace('_', '-');
                    const usePlaneta = document.createElementNS("http://www.w3.org/2000/svg", "use");
                    usePlaneta.setAttribute("href", `#${nombreSVG}`);
                    usePlaneta.setAttribute("x", String(xPlaneta - 12));
                    usePlaneta.setAttribute("y", String(yPlaneta - 12));
                    usePlaneta.setAttribute("width", "20");
                    usePlaneta.setAttribute("height", "20");
                    usePlaneta.setAttribute("class", "planeta-principal");
                    lienzoSvg.appendChild(usePlaneta);

                    // 2. Retrógrado (R)
                    const datosPlaneta = datosPlanetasForm[nombre] || { g: 0, m: 0, retrogrado: false };
                    if (datosPlaneta.retrogrado) {
                        const offsetX = 10;
                        const offsetY = 10;
                        const xR = xPlaneta + offsetX;
                        const yR = yPlaneta + offsetY;
                        const txtRetro = document.createElementNS("http://www.w3.org/2000/svg", "text");
                        txtRetro.setAttribute("x", String(xR));
                        txtRetro.setAttribute("y", String(yR));
                        txtRetro.setAttribute("font-family", "'Inter', sans-serif");
                        txtRetro.setAttribute("font-size", "10");
                        txtRetro.setAttribute("font-weight", "800");
                        txtRetro.setAttribute("text-anchor", "start");
                        txtRetro.setAttribute("dominant-baseline", "central");
                        txtRetro.setAttribute("fill", "#111111");
                        txtRetro.textContent = "R";
                        lienzoSvg.appendChild(txtRetro);
                    }
                }
            }
        }
    }
});