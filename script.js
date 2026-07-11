document.addEventListener("DOMContentLoaded", () => {
    
    const botonGenerar = document.getElementById("btn-generar");
    const lienzoSvg = document.getElementById("carta-astral");

    const CENTRO_X = 300;
    const CENTRO_Y = 300;
    const RADIO_RUEDA = 230; 

    const nombresSignos = [
        "ARIES", "TAURO", "GÉMINIS", "CÁNCER", 
        "LEO", "VIRGO", "LIBRA", "ESCORPIO", 
        "SAGITARIO", "CAPRICORNIO", "ACUARIO", "PISCIS"
    ];

    // Función auxiliar para convertir Grados, Minutos y Segundos a un valor puramente decimal
    function transformarADecimal(g, m, s) {
        return g + (m / 60) + (s / 3600);
    }

    botonGenerar.addEventListener("click", () => {
        // --- 1. PROCESAR ASCENDENTE ---
        const ascG = parseInt(document.getElementById("asc-grado").value, 10) || 0;
        const ascM = parseInt(document.getElementById("asc-minuto").value, 10) || 0;
        const ascS = parseInt(document.getElementById("asc-segundo").value, 10) || 0;
        const ascSigno = parseInt(document.getElementById("asc-signo").value, 10);
        
        const valorAscDecimal = transformarADecimal(ascG, ascM, ascS);
        const gradoAscAbsoluto = (ascSigno * 30) + valorAscDecimal;

        // --- 2. PROCESAR MEDIO CIELO (M.C.) ---
        const mcG = parseInt(document.getElementById("mc-grado").value, 10) || 0;
        const mcM = parseInt(document.getElementById("mc-minuto").value, 10) || 0;
        const mcS = parseInt(document.getElementById("mc-segundo").value, 10) || 0;
        const mcSigno = parseInt(document.getElementById("mc-signo").value, 10);
        
        const valorMcDecimal = transformarADecimal(mcG, mcM, mcS);
        const gradoMcAbsoluto = (mcSigno * 30) + valorMcDecimal;

        // --- 3. PROCESAR PLANETAS ---
        const planetasIngresados = {};
        const filasPlanetas = document.querySelectorAll(".fila-planeta");

        filasPlanetas.forEach(fila => {
            const nombreAstro = fila.getAttribute("data-astro");
            const g = parseInt(fila.querySelector(".p-grado").value, 10) || 0;
            const m = parseInt(fila.querySelector(".p-minuto").value, 10) || 0;
            const s = parseInt(fila.querySelector(".p-segundo").value, 10) || 0;
            const signoIndice = parseInt(fila.querySelector(".p-signo").value, 10);

            const posicionDecimal = transformarADecimal(g, m, s);
            const posicionAbsoluta = (signoIndice * 30) + posicionDecimal;
            
            planetasIngresados[nombreAstro] = posicionAbsoluta;
        });

        // Dibujar el Radix con toda la data matemática unificada
        dibujarRadixManual(gradoAscAbsoluto, gradoMcAbsoluto, planetasIngresados);
    });

    function dibujarRadixManual(ascendenteAbs, mcAbs, planetas) {
        // Limpiar el contenedor gráfico
        while (lienzoSvg.firstChild) {
            lienzoSvg.removeChild(lienzoSvg.firstChild);
        }

        // Sistema de Signos Enteros: calculamos el desfase respecto al horizonte izquierdo (180°)
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

        // Círculo interior para delimitar el cinturón zodiacal
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

        // --- DIBUJAR DIVISIONES Y NOMBRES DE LOS SIGNOS ---
        for (let i = 0; i < 12; i++) {
            const gradoLinea = i * 30;
            const radLinea = ajustarAngulo(gradoLinea);

            // Líneas divisorias del cinturón
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

            // Posicionamiento de los nombres justo en el punto medio de cada sector de 30°
            const gradoCentroSigno = gradoLinea + 15;
            const radTexto = ajustarAngulo(gradoCentroSigno);
            const radioTextoSigno = RADIO_RUEDA - 12.5; // Centrado exacto en el anillo de ancho 25

            const xTexto = Math.round(CENTRO_X + radioTextoSigno * Math.cos(radTexto));
            const yTexto = Math.round(CENTRO_Y + radioTextoSigno * Math.sin(radTexto)) + 4; // Ajuste vertical menor

            const etiquetaTexto = document.createElementNS("http://www.w3.org/2000/svg", "text");
            etiquetaTexto.setAttribute("x", String(xTexto));
            etiquetaTexto.setAttribute("y", String(yTexto));
            etiquetaTexto.setAttribute("font-family", "'Cormorant Garamond', serif");
            etiquetaTexto.setAttribute("font-size", "10");
            etiquetaTexto.setAttribute("font-weight", "400");
            etiquetaTexto.setAttribute("text-anchor", "middle");
            etiquetaTexto.setAttribute("fill", "#111111");
            etiquetaTexto.textContent = nombresSignos[i];
            lienzoSvg.appendChild(etiquetaTexto);
        }

        // --- TRAZAR EJE DEL ASCENDENTE (Línea más gruesa) ---
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

        // --- TRAZAR EJE DEL MEDIO CIELO (M.C.) ---
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
        lineaMc.setAttribute("stroke-dasharray", "3,3"); // Línea discontinua elegante para diferenciar del ASC
        lienzoSvg.appendChild(lineaMc);

        const xMcTxt = Math.round(CENTRO_X + (RADIO_RUEDA - 75) * Math.cos(radMc));
        const yMcTxt = Math.round(CENTRO_Y + (RADIO_RUEDA - 75) * Math.sin(radMc)) + 4;

        const txtMc = document.createElementNS("http://www.w3.org/2000/svg", "text");
        txtMc.setAttribute("x", String(xMcTxt));
        txtMc.setAttribute("y", String(yMcTxt));
        txtMc.setAttribute("font-family", "'Cormorant Garamond', serif");
        txtMc.setAttribute("font-size", "11");
        txtMc.setAttribute("font-weight", "600");
        txtMc.setAttribute("text-anchor", "middle");
        txtMc.setAttribute("fill", "#111111");
        txtMc.textContent = "M.C.";
        lienzoSvg.appendChild(txtMc);

        // --- RENDERIZAR PLANETAS ---
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