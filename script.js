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

    const cuerpos = Object.keys(simbolos);

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
            const retrogrado = fila.querySelector(".p-retrogrado").checked; // <-- NUEVO

            const g = parseInt(gInput, 10) || 0;
            const m = parseInt(mInput, 10) || 0;
            const posicionDecimal = transformarADecimal(g, m);
            const posicionAbsoluta = (signoIndice * 30) + posicionDecimal;

            planetasIngresados[nombreAstro] = posicionAbsoluta;
            estructuraAGuardar.planetas[nombreAstro] = {
                g: gInput,
                m: mInput,
                signo: signoIndice,
                retrogrado: retrogrado  // <-- NUEVO
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
            fila.querySelector(".p-retrogrado").checked = false; // <-- NUEVO
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
                        // Restaurar checkbox retrógrado
                        if (datosAstro.retrogrado !== undefined) {
                            fila.querySelector(".p-retrogrado").checked = datosAstro.retrogrado;
                        } else {
                            fila.querySelector(".p-retrogrado").checked = false;
                        }
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

        // ---- CAPA 1: Círculos y punto central ----
        const circuloExterior = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circuloExterior.setAttribute("cx", String(CENTRO_X));
        circuloExterior.setAttribute("cy", String(CENTRO_Y));
        circuloExterior.setAttribute("r", String(RADIO_RUEDA));
        circuloExterior.setAttribute("stroke", "#111111");
        circuloExterior.setAttribute("stroke-width", "1");
        circuloExterior.setAttribute("fill", "none");
        lienzoSvg.appendChild(circuloExterior);

        const circuloInterior = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circuloInterior.setAttribute("cx", String(CENTRO_X));
        circuloInterior.setAttribute("cy", String(CENTRO_Y));
        circuloInterior.setAttribute("r", String(RADIO_RUEDA - 25));
        circuloInterior.setAttribute("stroke", "#111111");
        circuloInterior.setAttribute("stroke-width", "1");
        circuloInterior.setAttribute("fill", "none");
        lienzoSvg.appendChild(circuloInterior);

        const puntoCentral = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        puntoCentral.setAttribute("cx", String(CENTRO_X));
        puntoCentral.setAttribute("cy", String(CENTRO_Y));
        puntoCentral.setAttribute("r", "3");
        puntoCentral.setAttribute("fill", "#111111");
        lienzoSvg.appendChild(puntoCentral);

        // ---- CAPA 2: Líneas divisorias ----
        for (let i = 0; i < 12; i++) {
            const gradoLinea = i * 30;
            const radLinea = ajustarAngulo(gradoLinea);
            const x1 = Math.round(CENTRO_X + RADIO_RUEDA * Math.cos(radLinea));
            const y1 = Math.round(CENTRO_Y + RADIO_RUEDA * Math.sin(radLinea));
            const x2 = Math.round(CENTRO_X + (RADIO_RUEDA - 25) * Math.cos(radLinea));
            const y2 = Math.round(CENTRO_Y + (RADIO_RUEDA - 25) * Math.sin(radLinea));
            const lineaDivisoria = document.createElementNS("http://www.w3.org/2000/svg", "line");
            lineaDivisoria.setAttribute("x1", String(x1));
            lineaDivisoria.setAttribute("y1", String(y1));
            lineaDivisoria.setAttribute("x2", String(x2));
            lineaDivisoria.setAttribute("y2", String(y2));
            lineaDivisoria.setAttribute("stroke", "#111111");
            lineaDivisoria.setAttribute("stroke-width", "1");
            lienzoSvg.appendChild(lineaDivisoria);
        }

        // ---- CAPA 3: Ejes y planetas ----
        if (mostrarContenido) {
            // Eje del Ascendente
            const radAsc = ajustarAngulo(ascendenteAbs);
            const xAsc1 = Math.round(CENTRO_X + (RADIO_RUEDA - 25) * Math.cos(radAsc));
            const yAsc1 = Math.round(CENTRO_Y + (RADIO_RUEDA - 25) * Math.sin(radAsc));
            const xAsc2 = Math.round(CENTRO_X + (RADIO_RUEDA - 60) * Math.cos(radAsc));
            const yAsc2 = Math.round(CENTRO_Y + (RADIO_RUEDA - 60) * Math.sin(radAsc));
            const lineaAsc = document.createElementNS("http://www.w3.org/2000/svg", "line");
            lineaAsc.setAttribute("x1", String(xAsc1));
            lineaAsc.setAttribute("y1", String(yAsc1));
            lineaAsc.setAttribute("x2", String(xAsc2));
            lineaAsc.setAttribute("y2", String(yAsc2));
            lineaAsc.setAttribute("stroke", "#111111");
            lineaAsc.setAttribute("stroke-width", "2");
            lienzoSvg.appendChild(lineaAsc);

            const xAscTxt = Math.round(CENTRO_X + (RADIO_RUEDA - 75) * Math.cos(radAsc));
            const yAscTxt = Math.round(CENTRO_Y + (RADIO_RUEDA - 75) * Math.sin(radAsc)) + 4;
            const txtAsc = document.createElementNS("http://www.w3.org/2000/svg", "text");
            txtAsc.setAttribute("x", String(xAscTxt));
            txtAsc.setAttribute("y", String(yAscTxt));
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
            lineaMc.setAttribute("x1", String(xMc1));
            lineaMc.setAttribute("y1", String(yMc1));
            lineaMc.setAttribute("x2", String(xMc2));
            lineaMc.setAttribute("y2", String(yMc2));
            lineaMc.setAttribute("stroke", "#111111");
            lineaMc.setAttribute("stroke-width", "1.5");
            lineaMc.setAttribute("stroke-dasharray", "3,3");
            lienzoSvg.appendChild(lineaMc);

            const xMcTxt = Math.round(CENTRO_X + (RADIO_RUEDA - 75) * Math.cos(radMc));
            const yMcTxt = Math.round(CENTRO_Y + (RADIO_RUEDA - 75) * Math.sin(radMc)) + 4;
            const txtMc = document.createElementNS("http://www.w3.org/2000/svg", "text");
            txtMc.setAttribute("x", String(xMcTxt));
            txtMc.setAttribute("y", String(yMcTxt));
            txtMc.setAttribute("font-family", "'Inter', sans-serif");
            txtMc.setAttribute("font-size", "11");
            txtMc.setAttribute("font-weight", "600");
            txtMc.setAttribute("text-anchor", "middle");
            txtMc.setAttribute("fill", "#111111");
            txtMc.textContent = "M.C.";
            lienzoSvg.appendChild(txtMc);

            // --- Planetas con símbolo, posición y retrógrado ---
            // Primero, necesitamos obtener los datos de retrogrado desde la estructura guardada
            // Para eso, recuperamos los datos de localStorage o de la variable global.
            // Voy a leer la estructura guardada desde el localStorage para obtener el flag.
            // Si no está disponible, asumo false.
            let datosRetro = {};
            try {
                const raw = localStorage.getItem("datosRadixManual");
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed.planetas) {
                        for (const [nombre, info] of Object.entries(parsed.planetas)) {
                            datosRetro[nombre] = info.retrogrado || false;
                        }
                    }
                }
            } catch (e) {}

            let idx = 0;
            for (const nombre of cuerpos) {
                if (planetas.hasOwnProperty(nombre)) {
                    const gradosAbsolutos = planetas[nombre];
                    const radPlaneta = ajustarAngulo(gradosAbsolutos);
                    const radioPlanetas = RADIO_RUEDA - 45 - (idx % 3) * 8;
                    const xPlaneta = Math.round(CENTRO_X + radioPlanetas * Math.cos(radPlaneta));
                    const yPlaneta = Math.round(CENTRO_Y + radioPlanetas * Math.sin(radPlaneta));

                    // Símbolo del planeta
                    const simbolo = simbolos[nombre] || "?";
                    const txtSimbolo = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    txtSimbolo.setAttribute("x", String(xPlaneta));
                    txtSimbolo.setAttribute("y", String(yPlaneta - 4));
                    txtSimbolo.setAttribute("font-family", "'Segoe UI Symbol', 'Arial Unicode MS', sans-serif");
                    txtSimbolo.setAttribute("font-size", "14");
                    txtSimbolo.setAttribute("font-weight", "400");
                    txtSimbolo.setAttribute("text-anchor", "middle");
                    txtSimbolo.setAttribute("fill", "#111111");
                    txtSimbolo.textContent = simbolo;
                    lienzoSvg.appendChild(txtSimbolo);

                    // Si está retrógrado, dibujar "R" al lado (derecha)
                    const retrogrado = datosRetro[nombre] || false;
                    if (retrogrado) {
                        const txtRetro = document.createElementNS("http://www.w3.org/2000/svg", "text");
                        txtRetro.setAttribute("x", String(xPlaneta + 10));
                        txtRetro.setAttribute("y", String(yPlaneta - 8));
                        txtRetro.setAttribute("font-family", "'Inter', sans-serif");
                        txtRetro.setAttribute("font-size", "8");
                        txtRetro.setAttribute("font-weight", "700");
                        txtRetro.setAttribute("text-anchor", "middle");
                        txtRetro.setAttribute("fill", "#c00"); // Color rojo para resaltar
                        txtRetro.textContent = "R";
                        lienzoSvg.appendChild(txtRetro);
                    }

                    // Posición en grados y minutos
                    const grado = Math.floor(gradosAbsolutos);
                    const minuto = Math.round((gradosAbsolutos - grado) * 60);
                    const txtPos = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    txtPos.setAttribute("x", String(xPlaneta));
                    txtPos.setAttribute("y", String(yPlaneta + 10));
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

        // ---- CAPA 4: Nombres de los signos (texto curvado) ----
        for (let i = 0; i < 12; i++) {
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
            trayectoTexto.textContent = nombresSignos[i];

            etiquetaTexto.appendChild(trayectoTexto);
            lienzoSvg.appendChild(etiquetaTexto);
        }
    }
});