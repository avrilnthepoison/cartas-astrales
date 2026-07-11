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

    function transformarADecimal(g, m) {
        return g + (m / 60);
    }

    // FUNCIÓN CENTRAL PARA PROCESAR FORMULARIO Y GUARDAR
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

            const g = parseInt(gInput, 10) || 0;
            const m = parseInt(mInput, 10) || 0;

            const posicionDecimal = transformarADecimal(g, m);
            const posicionAbsoluta = (signoIndice * 30) + posicionDecimal;
            
            planetasIngresados[nombreAstro] = posicionAbsoluta;
            estructuraAGuardar.planetas[nombreAstro] = { g: gInput, m: mInput, signo: signoIndice };
        });

        // Guardar instantánea del usuario en memoria del navegador
        localStorage.setItem("datosRadixManual", JSON.stringify(estructuraAGuardar));

        // Dibujar gráfico
        dibujarRadixManual(gradoAscAbsoluto, gradoMcAbsoluto, planetasIngresados);
    }

    // FUNCIÓN PARA REESTABLECER Y LIMPIAR TODO
    function restablecerTodoACero() {
        // Eliminar del almacenamiento local
        localStorage.removeItem("datosRadixManual");

        // Vaciar inputs de los ejes
        document.getElementById("asc-grado").value = "";
        document.getElementById("asc-minuto").value = "";
        document.getElementById("asc-signo").value = "0";

        document.getElementById("mc-grado").value = "";
        document.getElementById("mc-minuto").value = "";
        document.getElementById("mc-signo").value = "0";

        // Vaciar inputs de los planetas
        const filasPlanetas = document.querySelectorAll(".fila-planeta");
        filasPlanetas.forEach(fila => {
            fila.querySelector(".p-grado").value = "";
            fila.querySelector(".p-minuto").value = "";
            fila.querySelector(".p-signo").value = "0";
        });

        // Limpiar el gráfico SVG por completo
        while (lienzoSvg.firstChild) {
            lienzoSvg.removeChild(lienzoSvg.firstChild);
        }
    }

    // FUNCIÓN PARA RESTAURAR VALORES GUARDADOS AL DAR REFRESH (F5)
    function cargarValoresGuardados() {
        const datosGuardados = localStorage.getItem("datosRadixManual");
        if (!datosGuardados) return; // Si no hay historial, se queda vacío y limpio

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
            
            // Re-dibujar automáticamente lo que recuperó
            procesarYGenerarCarta();

        } catch (e) {
            console.error("Error al restaurar los datos:", e);
        }
    }

    // Eventos
    botonGenerar.addEventListener("click", procesarYGenerarCarta);
    botonBorrar.addEventListener("click", restablecerTodoACero);

    // Cargar historial al iniciar
    cargarValoresGuardados();


    function dibujarRadixManual(ascendenteAbs, mcAbs, planetas) {
        while (lienzoSvg.firstChild) {
            lienzoSvg.removeChild(lienzoSvg.firstChild);
        }

        const indiceSignoCuspide = Math.floor(ascendenteAbs / 30);
        const inicioSignoCuspideG = indiceSignoCuspide * 30;
        const desfaceG = 180 + inicioSignoCuspideG;

        function ajustarAngulo(gradosOriginales) {
            return (desfaceG - gradosOriginales) * (Math.PI / 180);
        }

        // Círculo base externo
        const circuloExterior = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circuloExterior.setAttribute("cx", String(CENTRO_X));
        circuloExterior.setAttribute("cy", String(CENTRO_Y));
        circuloExterior.setAttribute("r", String(RADIO_RUEDA));
        circuloExterior.setAttribute("stroke", "#111111");
        circuloExterior.setAttribute("stroke-width", "1");
        circuloExterior.setAttribute("fill", "none");
        lienzoSvg.appendChild(circuloExterior);

        // Círculo interior
        const circuloInterior = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circuloInterior.setAttribute("cx", String(CENTRO_X));
        circuloInterior.setAttribute("cy", String(CENTRO_Y));
        circuloInterior.setAttribute("r", String(RADIO_RUEDA - 25));
        circuloInterior.setAttribute("stroke", "#111111");
        circuloInterior.setAttribute("stroke-width", "1");
        circuloInterior.setAttribute("fill", "none");
        lienzoSvg.appendChild(circuloInterior);

        // Centro
        const puntoCentral = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        puntoCentral.setAttribute("cx", String(CENTRO_X));
        puntoCentral.setAttribute("cy", String(CENTRO_Y));
        puntoCentral.setAttribute("r", "3");
        puntoCentral.setAttribute("fill", "#111111");
        lienzoSvg.appendChild(puntoCentral);

        // --- CINTURÓN ZODIACAL ---
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

            // Trayecto de texto curvo
            const gradoInicioArco = gradoLinea;
            const gradoFinArco = gradoLinea + 30;
            
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
            const trayectoTexto = document.createElementNS("http://www.w3.org/1999/xlink", "textPath");
            trayectoTexto.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `#${idTrayecto}`);
            trayectoTexto.setAttribute("startOffset", "50%");      
            trayectoTexto.setAttribute("text-anchor", "middle");    
            trayectoTexto.textContent = nombresSignos[i];
            
            etiquetaTexto.appendChild(trayectoTexto);
            lienzoSvg.appendChild(etiquetaTexto);
        }

        // --- EJE DEL ASCENDENTE ---
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

        // --- EJE DEL MEDIO CIELO (M.C.) ---
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

        // --- PLANETAS ---
        for (const [planeta, gradosAbsolutos] of Object.entries(planetas)) {
            const radPlaneta = ajustarAngulo(gradosAbsolutos);
            const radioPlanetas = RADIO_RUEDA - 50; 

            const xPlaneta = Math.round(CENTRO_X + radioPlanetas * Math.cos(radPlaneta));
            const yPlaneta = Math.round(CENTRO_Y + radioPlanetas * Math.sin(radPlaneta)) + 4;

            const etiquetaPlaneta = document.createElementNS("http://www.w3.org/2000/svg", "text");
            etiquetaPlaneta.setAttribute("x", String(xPlaneta));
            etiquetaPlaneta.setAttribute("y", String(yPlaneta));
            etiquetaPlaneta.setAttribute("font-family", "'Inter', sans-serif");
            etiquetaPlaneta.setAttribute("font-size", "10");
            etiquetaPlaneta.setAttribute("font-weight", "300");
            etiquetaPlaneta.setAttribute("text-anchor", "middle");
            etiquetaPlaneta.setAttribute("fill", "#111111");
            etiquetaPlaneta.textContent = planeta;

            lienzoSvg.appendChild(etiquetaPlaneta);
        }
    }
});