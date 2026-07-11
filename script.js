document.addEventListener("DOMContentLoaded", () => {
    
    const botonGenerar = document.getElementById("btn-generar");
    const lienzoSvg = document.getElementById("carta-astral");

    const CENTRO_X = 300;
    const CENTRO_Y = 300;
    const RADIO_RUEDA = 230; 

    // Nombres de los signos tradicionales correlacionados con sus índices (0-11)
    const nombresSignos = [
        "ARIES", "TAURO", "GÉMINIS", "CÁNCER", 
        "LEO", "VIRGO", "LIBRA", "ESCORPIO", 
        "SAGITARIO", "CAPRICORNIO", "ACUARIO", "PISCIS"
    ];

    // --- MANEJADOR DE EVENTO PRINCIPAL ---
    botonGenerar.addEventListener("click", () => {
        // 1. Recopilar datos manuales del Ascendente
        const ascGrado = parseInt(document.getElementById("asc-grado").value, 10) || 0;
        const ascSignoIndice = parseInt(document.getElementById("asc-signo").value, 10);

        // Validaciones básicas de rangos astrológicos tradicionales
        if (ascGrado < 0 || ascGrado > 29) {
            alert("Los grados de los signos deben estar comprendidos entre 0 y 29.");
            return;
        }

        // Posición absoluta del ASC en la rueda de 360°
        const gradoAscendenteAbsoluto = (ascSignoIndice * 30) + ascGrado;

        // 2. Recopilar datos de cada una de las luminarias y planetas
        const planetasIngresados = {};
        const filasPlanetas = document.querySelectorAll(".fila-planeta");

        filasPlanetas.forEach(fila => {
            const nombreAstro = fila.getAttribute("data-astro");
            const gradoInput = parseInt(fila.querySelector(".p-grado").value, 10) || 0;
            const signoIndice = parseInt(fila.querySelector(".p-signo").value, 10);

            if (gradoInput >= 0 && gradoInput <= 29) {
                // Conversión matemática exacta a coordenadas de 360°
                const posicionAbsoluta = (signoIndice * 30) + gradoInput;
                planetasIngresados[nombreAstro] = posicionAbsoluta;
            }
        });

        console.log("📊 Datos manuales procesados con éxito:", { gradoAscendenteAbsoluto, planetasIngresados });

        // 3. Renderizar el dibujo nativo sin dependencias
        dibujarRadixManual(gradoAscendenteAbsoluto, planetasIngresados);
    });

    // --- FUNCIÓN DE DIBUJO ESTRUCTURAL EN SENTIDO ANTIHORARIO ---
    function dibujarRadixManual(ascendenteAbs, planetas) {
        // Limpiamos los elementos previos del SVG
        while (lienzoSvg.firstChild) {
            lienzoSvg.removeChild(lienzoSvg.firstChild);
        }

        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        lienzoSvg.appendChild(defs);

        // Cálculo del desface estructural para fijar el Ascendente horizontalmente a la izquierda (180°)
        // Como trabajamos en Signos Enteros (Whole Signs), alineamos el inicio del signo cúspide
        const indiceSignoCuspide = Math.floor(ascendenteAbs / 30);
        const inicioSignoCuspideG = indiceSignoCuspide * 30;
        const desfaceG = 180 + inicioSignoCuspideG;

        // Función matemática para convertir grados zodiacales directos a radianes en pantalla en sentido antihorario
        function ajustarAngulo(gradosOriginales) {
            const gradosCalculados = desfaceG - gradosOriginales;
            return gradosCalculados * (Math.PI / 180);
        }

        // Círculo exterior principal del Radix
        const circuloExterior = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circuloExterior.setAttribute("cx", String(CENTRO_X));
        circuloExterior.setAttribute("cy", String(CENTRO_Y));
        circuloExterior.setAttribute("r", String(RADIO_RUEDA));
        circuloExterior.setAttribute("stroke", "#111111");
        circuloExterior.setAttribute("stroke-width", "1");
        circuloExterior.setAttribute("fill", "none");
        lienzoSvg.appendChild(circuloExterior);

        // Punto central geométrico
        const puntoCentral = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        puntoCentral.setAttribute("cx", String(CENTRO_X));
        puntoCentral.setAttribute("cy", String(CENTRO_Y));
        puntoCentral.setAttribute("r", "3");
        puntoCentral.setAttribute("fill", "#111111");
        lienzoSvg.appendChild(puntoCentral);

        // Dibujar las 12 cúspides de los Signos Enteros (Cada 30°)
        for (let i = 0; i < 12; i++) {
            const radianesLinea = ajustarAngulo(i * 30);

            const x1 = Math.round(CENTRO_X + RADIO_RUEDA * Math.cos(radianesLinea));
            const y1 = Math.round(CENTRO_Y + RADIO_RUEDA * Math.sin(radianesLinea));
            const x2 = Math.round(CENTRO_X + (RADIO_RUEDA - 12) * Math.cos(radianesLinea));
            const y2 = Math.round(CENTRO_Y + (RADIO_RUEDA - 12) * Math.sin(radianesLinea));

            const lineaDivisoria = document.createElementNS("http://www.w3.org/2000/svg", "line");
            lineaDivisoria.setAttribute("x1", String(x1));
            lineaDivisoria.setAttribute("y1", String(y1));
            lineaDivisoria.setAttribute("x2", String(x2));
            lineaDivisoria.setAttribute("y2", String(y2));
            lineaDivisoria.setAttribute("stroke", "#111111");
            lineaDivisoria.setAttribute("stroke-width", "1");
            lienzoSvg.appendChild(lineaDivisoria);

            // Generación de arcos y textos tipográficos (Cormorant Garamond) para el cinturón del zodíaco
            const rTexto = RADIO_RUEDA + 12; 
            const xStart = CENTRO_X + rTexto * Math.cos(ajustarAngulo((i + 1) * 30));
            const yStart = CENTRO_Y + rTexto * Math.sin(ajustarAngulo((i + 1) * 30));
            const xEnd = CENTRO_X + rTexto * Math.cos(ajustarAngulo(i * 30));
            const yEnd = CENTRO_Y + rTexto * Math.sin(ajustarAngulo(i * 30));

            const rutaArco = document.createElementNS("http://www.w3.org/2000/svg", "path");
            rutaArco.setAttribute("id", `arco-signo-${i}`);
            rutaArco.setAttribute("d", `M ${xStart} ${yStart} A ${rTexto} ${rTexto} 0 0 1 ${xEnd} ${yEnd}`);
            rutaArco.setAttribute("fill", "none");
            defs.appendChild(rutaArco);

            const etiquetaTexto = document.createElementNS("http://www.w3.org/2000/svg", "text");
            etiquetaTexto.setAttribute("font-family", "'Cormorant Garamond', serif");
            etiquetaTexto.setAttribute("font-size", "10");
            etiquetaTexto.setAttribute("letter-spacing", "1.5");
            etiquetaTexto.setAttribute("fill", "#111111");

            const textPath = document.createElementNS("http://www.w3.org/1999/xlink", "textPath");
            textPath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `#arco-signo-${i}`);
            textPath.setAttribute("startOffset", "50%"); 
            textPath.setAttribute("text-anchor", "middle"); 
            textPath.textContent = nombresSignos[i];

            etiquetaTexto.appendChild(textPath);
            lienzoSvg.appendChild(etiquetaTexto);
        }

        // Trazado de la flecha/línea exacta del Ascendente Manual
        const radianesAsc = ajustarAngulo(ascendenteAbs);
        const xAscInicio = Math.round(CENTRO_X + RADIO_RUEDA * Math.cos(radianesAsc));
        const yAscInicio = Math.round(CENTRO_Y + RADIO_RUEDA * Math.sin(radianesAsc));
        const xAscFin = Math.round(CENTRO_X + (RADIO_RUEDA - 35) * Math.cos(radianesAsc));
        const yAscFin = Math.round(CENTRO_Y + (RADIO_RUEDA - 35) * Math.sin(radianesAsc));

        const lineaAsc = document.createElementNS("http://www.w3.org/2000/svg", "line");
        lineaAsc.setAttribute("x1", String(xAscInicio));
        lineaAsc.setAttribute("y1", String(yAscInicio));
        lineaAsc.setAttribute("x2", String(xAscFin));
        lineaAsc.setAttribute("y2", String(yAscFin));
        lineaAsc.setAttribute("stroke", "#111111");
        lineaAsc.setAttribute("stroke-width", "1.5"); 
        lienzoSvg.appendChild(lineaAsc);

        const xAscTexto = Math.round(CENTRO_X + (RADIO_RUEDA - 48) * Math.cos(radianesAsc));
        const yAscTexto = Math.round(CENTRO_Y + (RADIO_RUEDA - 48) * Math.sin(radianesAsc)) + 4;
        
        const etiquetaAsc = document.createElementNS("http://www.w3.org/2000/svg", "text");
        etiquetaAsc.setAttribute("x", String(xAscTexto));
        etiquetaAsc.setAttribute("y", String(yAscTexto));
        etiquetaAsc.setAttribute("font-family", "'Inter', sans-serif");
        etiquetaAsc.setAttribute("font-size", "9");
        etiquetaAsc.setAttribute("font-weight", "600");
        etiquetaAsc.setAttribute("text-anchor", "middle");
        etiquetaAsc.setAttribute("fill", "#111111");
        etiquetaAsc.textContent = "ASC";
        lienzoSvg.appendChild(etiquetaAsc);

        // Posicionamiento de los Astros Clásicos en el mapa geométrico
        for (const [planeta, gradosAbsolutos] of Object.entries(planetas)) {
            const radianesPlaneta = ajustarAngulo(gradosAbsolutos);
            const radioPlanetas = RADIO_RUEDA - 60; // Espaciado elegante hacia el interior

            const xPlaneta = Math.round(CENTRO_X + radioPlanetas * Math.cos(radianesPlaneta));
            const yPlaneta = Math.round(CENTRO_Y + radioPlanetas * Math.sin(radianesPlaneta)) + 4;

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