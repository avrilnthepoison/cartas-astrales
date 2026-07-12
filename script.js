document.addEventListener("DOMContentLoaded", () => {

    const botonGenerar = document.getElementById("btn-generar");
    const botonBorrar = document.getElementById("btn-borrar");
    const lienzoSvg = document.getElementById("carta-astral");

    const CENTRO_X = 300;
    const CENTRO_Y = 300;
    const RADIO_RUEDA = 230;

    const nombresSignos = [
        "ARIES", "TAURO", "GÉMINIS", "CÁNCER",
        "LEO", "VIRGO", "LIBRA", "ESCORPIO",
        "SAGITARIO", "CAPRICORNIO", "ACUARIO", "PISCIS"
    ];

    // Símbolos planetarios (Unicode)
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

    // Lista de todos los cuerpos (para iterar en orden)
    const cuerpos = Object.keys(simbolos);

    function transformarADecimal(g, m) {
        return g + (m / 60);
    }

    // Función central para procesar formulario y guardar en memoria
    function procesarYGenerarCarta() {
        // --- Leer Ascendente ---
        const ascG = parseInt(document.getElementById("asc-grado").value, 10) || 0;
        const ascM = parseInt(document.getElementById("asc-minuto").value, 10) || 0;
        const ascSigno = parseInt(document.getElementById("asc-signo").value, 10);
        const valorAscDecimal = transformarADecimal(ascG, ascM);
        const gradoAscAbsoluto = (ascSigno * 30) + valorAscDecimal;

        // --- Leer Medio Cielo ---
        const mcG = parseInt(document.getElementById("mc-grado").value, 10) || 0;
        const mcM = parseInt(document.getElementById("mc-minuto").value, 10) || 0;
        const mcSigno = parseInt(document.getElementById("mc-signo").value, 10);
        const valorMcDecimal = transformarADecimal(mcG, mcM);
        const gradoMcAbsoluto = (mcSigno * 30) + valorMcDecimal;

        // --- Leer planetas ---
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
            const g = parseInt(gInput, 10) || 0;
            const m = parseInt(mInput, 10) || 0;
            const posicionDecimal = transformarADecimal(g, m);
            const posicionAbsoluta = (signoIndice * 30) + posicionDecimal;

            planetasIngresados[nombreAstro] = posicionAbsoluta;
            estructuraAGuardar.planetas[nombreAstro] = { g: gInput, m: mInput, signo: signoIndice };
        });

        localStorage.setItem("datosRadixManual", JSON.stringify(estructuraAGuardar));

        // Dibujar siempre con los datos leídos (incluso si son 0)
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
                    }
                });
            }
            // Después de restaurar, volver a dibujar
            procesarYGenerarCarta();
        } catch (e) {
            console.error("Error al restaurar los datos de sesión:", e);
            dibujarRadixManual(0, 0, {}, false);
        }
    }

    botonGenerar.addEventListener("click", procesarYGenerarCarta);
    botonBorrar.addEventListener("click", restablecerTodoACero);
    cargarValoresGuardados();

    // ================================================================
    //  FUNCIÓN PRINCIPAL DE DIBUJO (CORREGIDA)
    // ================================================================
    function dibujarRadixManual(ascendenteAbs, mcAbs, planetas, mostrarContenido) {
        // Limpieza del lienzo
        while (lienzoSvg.firstChild) {
            lienzoSvg.removeChild(lienzoSvg.firstChild);
        }

        // --- 1. Determinar el signo del Ascendente y el desfase ---
        // El signo del ASC es el índice (0-11) del signo que contiene al ASC
        const indiceSignoASC = Math.floor(ascendenteAbs / 30);
        // El grado de inicio de ese signo (0, 30, 60, ...)
        const inicioSignoASC = indiceSignoASC * 30;
        // Desfase para colocar el inicio del signo del ASC en el eje izquierdo (ángulo 180°)
        const desfaceG = 180 + inicioSignoASC;

        function ajustarAngulo(gradosOriginales) {
            return (desfaceG - gradosOriginales) * (Math.PI / 180);
        }

        // --- 2. Dibujar la rueda base ---
        // Círculo exterior
        const circuloExterior = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circuloExterior.setAttribute("cx", CENTRO_X);
        circuloExterior.setAttribute("cy", CENTRO_Y);
        circuloExterior.setAttribute("r", RADIO_RUEDA);
        circuloExterior.setAttribute("stroke", "#111111");
        circuloExterior.setAttribute("stroke-width", "1");
        circuloExterior.setAttribute("fill", "none");
        lienzoSvg.appendChild(circuloExterior);

        // Círculo interior
        const circuloInterior = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circuloInterior.setAttribute("cx", CENTRO_X);
        circuloInterior.setAttribute("cy", CENTRO_Y);
        circuloInterior.setAttribute("r", RADIO_RUEDA - 25);
        circuloInterior.setAttribute("stroke", "#111111");
        circuloInterior.setAttribute("stroke-width", "1");
        circuloInterior.setAttribute("fill", "none");
        lienzoSvg.appendChild(circuloInterior);

        // Punto central
        const puntoCentral = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        puntoCentral.setAttribute("cx", CENTRO_X);
        puntoCentral.setAttribute("cy", CENTRO_Y);
        puntoCentral.setAttribute("r", "3");
        puntoCentral.setAttribute("fill", "#111111");
        lienzoSvg.appendChild(puntoCentral);

        // Líneas divisorias (cada 30°)
        for (let i = 0; i < 12; i++) {
            const gradoLinea = i * 30;
            const radLinea = ajustarAngulo(gradoLinea);
            const x1 = Math.round(CENTRO_X + RADIO_RUEDA * Math.cos(radLinea));
            const y1 = Math.round(CENTRO_Y + RADIO_RUEDA * Math.sin(radLinea));
            const x2 = Math.round(CENTRO_X + (RADIO_RUEDA - 25) * Math.cos(radLinea));
            const y2 = Math.round(CENTRO_Y + (RADIO_RUEDA - 25) * Math.sin(radLinea));
            const lineaDivisoria = document.createElementNS("http://www.w3.org/2000/svg", "line");
            lineaDivisoria.setAttribute("x1", x1);
            lineaDivisoria.setAttribute("y1", y1);
            lineaDivisoria.setAttribute("x2", x2);
            lineaDivisoria.setAttribute("y2", y2);
            lineaDivisoria.setAttribute("stroke", "#111111");
            lineaDivisoria.setAttribute("stroke-width", "1");
            lienzoSvg.appendChild(lineaDivisoria);
        }

        // --- 3. Si hay contenido, dibujar ejes y planetas ---
        if (mostrarContenido) {
            // Eje del Ascendente
            const radAsc = ajustarAngulo(ascendenteAbs);
            const xAsc1 = Math.round(CENTRO_X + (RADIO_RUEDA - 25) * Math.cos(radAsc));
            const yAsc1 = Math.round(CENTRO_Y + (RADIO_RUEDA - 25) * Math.sin(radAsc));
            const xAsc2 = Math.round(CENTRO_X + (RADIO_RUEDA - 60) * Math.cos(radAsc));
            const yAsc2 = Math.round(CENTRO_Y + (RADIO_RUEDA - 60) * Math.sin(radAsc));
            const lineaAsc = document.createElementNS("http://www.w3.org/2000/svg", "line");
            lineaAsc.setAttribute("x1", xAsc1);
            lineaAsc.setAttribute("y1", yAsc1);
            lineaAsc.setAttribute("x2", xAsc2);
            lineaAsc.setAttribute("y2", yAsc2);
            lineaAsc.setAttribute("stroke", "#111111");
            lineaAsc.setAttribute("stroke-width", "2");
            lienzoSvg.appendChild(lineaAsc);
            const xAscTxt = Math.round(CENTRO_X + (RADIO_RUEDA - 75) * Math.cos(radAsc));
            const yAscTxt = Math.round(CENTRO_Y + (RADIO_RUEDA - 75) * Math.sin(radAsc)) + 4;
            const txtAsc = document.createElementNS("http://www.w3.org/2000/svg", "text");
            txtAsc.setAttribute("x", xAscTxt);
            txtAsc.setAttribute("y", yAscTxt);
            txtAsc.setAttribute("font-family", "'Inter', sans-serif");
            txtAsc.setAttribute("font-size", "10");
            txtAsc.setAttribute("font-weight", "600");
            txtAsc.setAttribute("text-anchor", "middle");
            txtAsc.setAttribute("fill", "#111111");
            txtAsc.textContent = "ASC";
            lienzoSvg.appendChild(txtAsc);

            // Eje del Medio Cielo
            const radMc = ajustarAngulo(mcAbs);
            const xMc1 = Math.round(CENTRO_X + (RADIO_RUEDA - 25) * Math.cos(radMc));
            const yMc1 = Math.round(CENTRO_Y + (RADIO_RUEDA - 25) * Math.sin(radMc));
            const xMc2 = Math.round(CENTRO_X + (RADIO_RUEDA - 60) * Math.cos(radMc));
            const yMc2 = Math.round(CENTRO_Y + (RADIO_RUEDA - 60) * Math.sin(radMc));
            const lineaMc = document.createElementNS("http://www.w3.org/2000/svg", "line");
            lineaMc.setAttribute("x1", xMc1);
            lineaMc.setAttribute("y1", yMc1);
            lineaMc.setAttribute("x2", xMc2);
            lineaMc.setAttribute("y2", yMc2);
            lineaMc.setAttribute("stroke", "#111111");
            lineaMc.setAttribute("stroke-width", "1.5");
            lineaMc.setAttribute("stroke-dasharray", "3,3");
            lienzoSvg.appendChild(lineaMc);
            const xMcTxt = Math.round(CENTRO_X + (RADIO_RUEDA - 75) * Math.cos(radMc));
            const yMcTxt = Math.round(CENTRO_Y + (RADIO_RUEDA - 75) * Math.sin(radMc)) + 4;
            const txtMc = document.createElementNS("http://www.w3.org/2000/svg", "text");
            txtMc.setAttribute("x", xMcTxt);
            txtMc.setAttribute("y", yMcTxt);
            txtMc.setAttribute("font-family", "'Inter', sans-serif");
            txtMc.setAttribute("font-size", "11");
            txtMc.setAttribute("font-weight", "600");
            txtMc.setAttribute("text-anchor", "middle");
            txtMc.setAttribute("fill", "#111111");
            txtMc.textContent = "M.C.";
            lienzoSvg.appendChild(txtMc);

            // Planetas: dibujar símbolo y posición
            let idx = 0;
            for (const nombre of cuerpos) {
                if (planetas.hasOwnProperty(nombre)) {
                    const gradosAbsolutos = planetas[nombre];
                    const radPlaneta = ajustarAngulo(gradosAbsolutos);
                    const radioPlanetas = RADIO_RUEDA - 45 - (idx % 3) * 8;
                    const xPlaneta = Math.round(CENTRO_X + radioPlanetas * Math.cos(radPlaneta));
                    const yPlaneta = Math.round(CENTRO_Y + radioPlanetas * Math.sin(radPlaneta));

                    // Símbolo
                    const simbolo = simbolos[nombre] || "?";
                    const txtSimbolo = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    txtSimbolo.setAttribute("x", xPlaneta);
                    txtSimbolo.setAttribute("y", yPlaneta - 4);
                    txtSimbolo.setAttribute("font-family", "'Segoe UI Symbol', 'Arial Unicode MS', sans-serif");
                    txtSimbolo.setAttribute("font-size", "14");
                    txtSimbolo.setAttribute("font-weight", "400");
                    txtSimbolo.setAttribute("text-anchor", "middle");
                    txtSimbolo.setAttribute("fill", "#111111");
                    txtSimbolo.textContent = simbolo;
                    lienzoSvg.appendChild(txtSimbolo);

                    // Posición (grado y minuto)
                    const grado = Math.floor(gradosAbsolutos);
                    const minuto = Math.round((gradosAbsolutos - grado) * 60);
                    const txtPos = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    txtPos.setAttribute("x", xPlaneta);
                    txtPos.setAttribute("y", yPlaneta + 10);
                    txtPos.setAttribute("font-family", "'Inter', sans-serif");
                    txtPos.setAttribute("font-size", "7");
                    txtPos.setAttribute("font-weight", "400");
                    txtPos.setAttribute("text-anchor", "middle");
                    txtPos.setAttribute("fill", "#666666");
                    txtPos.textContent = `${grado}°${minuto}'`;
                    lienzoSvg.appendChild(txtPos);

                    idx++;
                }
            }
        }

        // --- 4. Nombres de los signos (texto curvado) ---
        // IMPORTANTE: el sector i (0 a 11) corresponde al signo (indiceSignoASC + i) % 12
        for (let i = 0; i < 12; i++) {
            const signoIndex = (indiceSignoASC + i) % 12; // signo que va en este sector
            const gradoInicioArco = i * 30;
            const gradoFinArco = gradoInicioArco + 30;

            const radInicio = ajustarAngulo(gradoInicioArco);
            const radFin = ajustarAngulo(gradoFinArco);
            const radioTrayectoTexto = RADIO_RUEDA - 16;

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
            etiquetaTexto.setAttribute("font-size", "10");
            etiquetaTexto.setAttribute("font-weight", "600");
            etiquetaTexto.setAttribute("fill", "#111111");

            const trayectoTexto = document.createElementNS("http://www.w3.org/2000/svg", "textPath");
            trayectoTexto.setAttribute("href", `#${idTrayecto}`);
            trayectoTexto.setAttribute("startOffset", "50%");
            trayectoTexto.setAttribute("text-anchor", "middle");
            trayectoTexto.textContent = nombresSignos[signoIndex]; // nombre correcto

            etiquetaTexto.appendChild(trayectoTexto);
            lienzoSvg.appendChild(etiquetaTexto);
        }
    }
});