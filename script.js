// 1. Esperamos a que la página cargue por completo
document.addEventListener("DOMContentLoaded", () => {
    
    const botonGenerar = document.getElementById("btn-generar");
    const lienzoSvg = document.getElementById("carta-astral");

    const CENTRO_X = 300;
    const CENTRO_Y = 300;
    const RADIO_RUEDA = 230; 

    botonGenerar.addEventListener("click", () => {
        const fechaInput = document.getElementById("fecha").value;
        const horaInput = document.getElementById("hora").value;
        const ciudadInput = document.getElementById("ciudad").value;

        generarMatematicaAstral(fechaInput, horaInput);
    });

    // 4. Función que procesará los grados astronómicos
    function generarMatematicaAstral(fecha, hora) {
        // DATOS DE PRUEBA: Simulemos un Ascendente en ACUARIO (a los 312.5° absolutos)
        // En Whole Sign, esto significa que la Casa 1 completa debe ser ACUARIO.
        const posicionesEjemplo = {
            "☉ SOL": 57.2,    // 27.2° de Tauro
            "☽ LUNA": 325.1,  // 25.1° de Acuario
        };
        
        const gradoAscendente = 312.5; // Ascendente a los 12.5° de Acuario

        dibujarRadixWholeSign(gradoAscendente, posicionesEjemplo);
    }

    // 5. Función de dibujo optimizada para el Sistema de Signos Enteros
    function dibujarRadixWholeSign(ascendenteG, planetas) {
        // Limpiamos el contenedor
        while (lienzoSvg.firstChild) {
            lienzoSvg.removeChild(lienzoSvg.firstChild);
        }

        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        lienzoSvg.appendChild(defs);

        const nombresSignos = [
            "ARIES", "TAURO", "GÉMINIS", "CÁNCER", 
            "LEO", "VIRGO", "LIBRA", "ESCORPIO", 
            "SAGITARIO", "CAPRICORNIO", "ACUARIO", "PISCIS"
        ];

        // --- CÁLCULO DEL GIRO DINÁMICO ---
        // Buscamos el inicio del signo del Ascendente (Cada signo son 30°)
        const indiceSignoAsc = Math.floor(ascendenteG / 30); 
        const inicioSignoAscG = indiceSignoAsc * 30; // Grado donde empieza Acuario (300°)
        
        // Queremos que el inicio de este signo se alinee a la izquierda (180° en la pantalla)
        // El desfase nos dice cuántos grados debemos sumarle a todo para girar la rueda
        const desfaceG = 180 - inicioSignoAscG;

        // Función interna para ajustar cualquier grado según el giro de la carta
        function ajustarAngulo(gradosOriginales) {
            return (gradosOriginales + desfaceG) * (Math.PI / 180);
        }

        // 1. Círculo exterior principal
        const circuloExterior = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circuloExterior.setAttribute("cx", String(CENTRO_X));
        circuloExterior.setAttribute("cy", String(CENTRO_Y));
        circuloExterior.setAttribute("r", String(RADIO_RUEDA));
        circuloExterior.setAttribute("stroke", "#111111");
        circuloExterior.setAttribute("stroke-width", "1");
        circuloExterior.setAttribute("fill", "none");
        lienzoSvg.appendChild(circuloExterior);

        // 2. Punto central
        const puntoCentral = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        puntoCentral.setAttribute("cx", String(CENTRO_X));
        puntoCentral.setAttribute("cy", String(CENTRO_Y));
        puntoCentral.setAttribute("r", "3");
        puntoCentral.setAttribute("fill", "#111111");
        lienzoSvg.appendChild(puntoCentral);

        // 3. Dibujamos las divisiones de los Signos (Cúspides de Casas en Whole Sign)
        for (let i = 0; i < 12; i++) {
            // Aplicamos el ajuste de ángulo para que las líneas giren dinámicamente
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

            // Textos curvos de los signos con rotación dinámica
            const rTexto = RADIO_RUEDA + 12; 
            const xStart = CENTRO_X + rTexto * Math.cos(ajustarAngulo(i * 30));
            const yStart = CENTRO_Y + rTexto * Math.sin(ajustarAngulo(i * 30));
            const xEnd = CENTRO_X + rTexto * Math.cos(ajustarAngulo((i + 1) * 30));
            const yEnd = CENTRO_Y + rTexto * Math.sin(ajustarAngulo((i + 1) * 30));

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

            const textPath = document.createElementNS("http://www.w3.org/2000/svg", "textPath");
            textPath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `#arco-signo-${i}`);
            textPath.setAttribute("startOffset", "50%"); 
            textPath.setAttribute("text-anchor", "middle"); 
            textPath.textContent = nombresSignos[i];

            etiquetaTexto.appendChild(textPath);
            lienzoSvg.appendChild(etiquetaTexto);
        }

        // --- 4. DIBUJAR LA LÍNEA DEL ASCENDENTE (Flecha/Marca en su grado exacto) ---
        const radianesAsc = ajustarAngulo(ascendenteG);
        // La marca irá desde el borde exterior metiéndose un poco hacia el centro
        const xAscInicio = Math.round(CENTRO_X + RADIO_RUEDA * Math.cos(radianesAsc));
        const yAscInicio = Math.round(CENTRO_Y + RADIO_RUEDA * Math.sin(radianesAsc));
        const xAscFin = Math.round(CENTRO_X + (RADIO_RUEDA - 35) * Math.cos(radianesAsc));
        const yAscFin = Math.round(CENTRO_Y + (RADIO_RUEDA - 35) * Math.sin(radianesAsc));

        // Creamos la línea visual del Ascendente
        const lineaAsc = document.createElementNS("http://www.w3.org/2000/svg", "line");
        lineaAsc.setAttribute("x1", String(xAscInicio));
        lineaAsc.setAttribute("y1", String(yAscInicio));
        lineaAsc.setAttribute("x2", String(xAscFin));
        lineaAsc.setAttribute("y2", String(yAscFin));
        lineaAsc.setAttribute("stroke", "#111111");
        lineaAsc.setAttribute("stroke-width", "2"); // Un poquito más gruesa para destacar que es el Ascendente
        lienzoSvg.appendChild(lineaAsc);

        // Texto al lado de la línea del Ascendente
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

        // --- 5. DIBUJAR LOS PLANETAS CON EL NUEVO ÁNGULO GIRADO ---
        for (const [planeta, grados] of Object.entries(planetas)) {
            const radianesPlaneta = ajustarAngulo(grados);
            const radioPlanetas = RADIO_RUEDA - 60;

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