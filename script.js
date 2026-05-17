// 1. Esperamos a que la página cargue por completo
document.addEventListener("DOMContentLoaded", () => {
    
    // 2. Mapeamos los elementos visuales de la pantalla
    const botonGenerar = document.getElementById("btn-generar");
    const lienzoSvg = document.getElementById("carta-astral");

    // Centro del lienzo y dimensiones fijas
    const CENTRO_X = 300;
    const CENTRO_Y = 300;
    const RADIO_RUEDA = 230; // Ajustamos un pelo el radio para balancear el espaciado exterior

    // 3. Escuchamos el clic del botón
    botonGenerar.addEventListener("click", () => {
        const fechaInput = document.getElementById("fecha").value;
        const horaInput = document.getElementById("hora").value;
        const ciudadInput = document.getElementById("ciudad").value;

        console.log(`Calculando para: ${fechaInput} a las ${horaInput} en ${ciudadInput}`);

        // Ejecutamos la función de simulación
        generarMatematicaAstral(fechaInput, horaInput);
    });

    // 4. Función que procesará los grados astronómicos
    function generarMatematicaAstral(fecha, hora) {
        // Posiciones simuladas de prueba
        const posicionesEjemplo = {
            Ascendente: 312.5,
            Sol: 57.2,
            Luna: 315.1
        };

        dibujarEstructuraRadix(posicionesEjemplo);
    }

    // 5. Función de dibujo con curvas de texto perfectas
    function dibujarEstructuraRadix(datos) {
        // Limpiamos el contenedor por completo
        while (lienzoSvg.firstChild) {
            lienzoSvg.removeChild(lienzoSvg.firstChild);
        }

        // Definimos una sección interna <defs> para guardar las rutas invisibles del texto
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        lienzoSvg.appendChild(defs);

        const nombresSignos = [
            "ARIES", "TAURO", "GÉMINIS", "CÁNCER", 
            "LEO", "VIRGO", "LIBRA", "ESCORPIO", 
            "SAGITARIO", "CAPRICORNIO", "ACUARIO", "PISCIS"
        ];

        // 1. Dibujamos el círculo exterior principal
        const circuloExterior = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circuloExterior.setAttribute("cx", String(CENTRO_X));
        circuloExterior.setAttribute("cy", String(CENTRO_Y));
        circuloExterior.setAttribute("r", String(RADIO_RUEDA));
        circuloExterior.setAttribute("stroke", "#111111");
        circuloExterior.setAttribute("stroke-width", "1");
        circuloExterior.setAttribute("fill", "none");
        lienzoSvg.appendChild(circuloExterior);

        // 2. Dibujamos el punto central
        const puntoCentral = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        puntoCentral.setAttribute("cx", String(CENTRO_X));
        puntoCentral.setAttribute("cy", String(CENTRO_Y));
        puntoCentral.setAttribute("r", "3");
        puntoCentral.setAttribute("fill", "#111111");
        lienzoSvg.appendChild(puntoCentral);

        // 3. Dibujamos las 12 divisiones y los textos curvos
        for (let i = 0; i < 12; i++) {
            
            // --- PARTE A: LAS LÍNEAS DIVISORIAS ---
            const gradosLinea = i * 30;
            const radianesLinea = gradosLinea * (Math.PI / 180);

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

            // --- PARTE B: LAS GUÍAS CURVAS INVISIBLES ---
            // Definimos el inicio y fin del arco para cada signo individual
            const startAngle = i * 30;
            const endAngle = (i + 1) * 30;
            const rTexto = RADIO_RUEDA + 12; // Radio donde flotará el texto

            // Fórmulas matemáticas para trazar un arco perfecto en formato SVG
            const radStart = startAngle * (Math.PI / 180);
            const radEnd = endAngle * (Math.PI / 180);
            
            const xStart = CENTRO_X + rTexto * Math.cos(radStart);
            const yStart = CENTRO_Y + rTexto * Math.sin(radStart);
            const xEnd = CENTRO_X + rTexto * Math.cos(radEnd);
            const yEnd = CENTRO_Y + rTexto * Math.sin(radEnd);

            // Creamos la ruta (path) del arco
            const rutaArco = document.createElementNS("http://www.w3.org/2000/svg", "path");
            rutaArco.setAttribute("id", `arco-signo-${i}`);
            // "M" se mueve al inicio, "A" dibuja el arco hacia el final
            rutaArco.setAttribute("d", `M ${xStart} ${yStart} A ${rTexto} ${rTexto} 0 0 1 ${xEnd} ${yEnd}`);
            rutaArco.setAttribute("fill", "none");
            defs.appendChild(rutaArco);

            // --- PARTE C: ACOPLAR EL TEXTO AL ARCO ---
            const etiquetaTexto = document.createElementNS("http://www.w3.org/2000/svg", "text");
            etiquetaTexto.setAttribute("font-family", "'Cormorant Garamond', serif");
            etiquetaTexto.setAttribute("font-size", "10");
            etiquetaTexto.setAttribute("letter-spacing", "1.5");
            etiquetaTexto.setAttribute("fill", "#111111");

            // Creamos el eslabón mágico textPath que amarra el texto a la ruta invisible
            const textPath = document.createElementNS("http://www.w3.org/2000/svg", "textPath");
            textPath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `#arco-signo-${i}`);
            textPath.setAttribute("startOffset", "50%"); // Esto alinea el texto al centro exacto del arco
            textPath.setAttribute("text-anchor", "middle"); // Asegura que el centrado sea simétrico
            textPath.textContent = nombresSignos[i];

            etiquetaTexto.appendChild(textPath);
            lienzoSvg.appendChild(etiquetaTexto);
        }
    }
});