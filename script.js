// 1. Esperamos a que la página cargue por completo
document.addEventListener("DOMContentLoaded", () => {
    
    // 2. Mapeamos los elementos visuales de la pantalla
    const botonGenerar = document.getElementById("btn-generar");
    const lienzoSvg = document.getElementById("carta-astral");

    // Centro del lienzo y dimensiones fijas
    const CENTRO_X = 300;
    const CENTRO_Y = 300;
    const RADIO_RUEDA = 240; // Redujimos un poco el radio del círculo para dejar espacio a los nombres afuera

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

    // 5. Función de dibujo con los signos incluidos
    function dibujarEstructuraRadix(datos) {
        // Limpiamos el contenedor por completo
        while (lienzoSvg.firstChild) {
            lienzoSvg.removeChild(lienzoSvg.firstChild);
        }

        // Array con los nombres de los signos en orden tradicional (Empezando por Aries)
        // Puedes cambiar los nombres por abreviaciones (ARI, TAU) o glifos más adelante si prefieres
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

        // 3. Dibujamos las 12 divisiones (Ticks) y los nombres de los signos
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

            // --- PARTE B: LOS NOMBRES DE LOS SIGNOS ---
            // El texto debe ir en el centro de la porción (Grado actual + 15 grados)
            const gradosTexto = (i * 30) + 15;
            const radianesTexto = gradosTexto * (Math.PI / 180);

            // Calculamos la posición flotando un poco hacia afuera (RADIO_RUEDA + 20 píxeles)
            const xTexto = Math.round(CENTRO_X + (RADIO_RUEDA + 20) * Math.cos(radianesTexto));
            // Sumamos 5 píxeles en el eje Y para equilibrar visualmente la altura de la tipografía
            const yTexto = Math.round(CENTRO_Y + (RADIO_RUEDA + 20) * Math.sin(radianesTexto)) + 5;

            // Creamos el elemento de texto en el SVG
            const etiquetaTexto = document.createElementNS("http://www.w3.org/2000/svg", "text");
            etiquetaTexto.setAttribute("x", String(xTexto));
            etiquetaTexto.setAttribute("y", String(yTexto));
            etiquetaTexto.setAttribute("font-family", "'Cormorant Garamond', serif");
            etiquetaTexto.setAttribute("font-size", "10"); // Tamaño pequeño y delicado
            etiquetaTexto.setAttribute("letter-spacing", "1"); // Espaciado entre letras elegante
            etiquetaTexto.setAttribute("text-anchor", "middle"); // Centra el texto exactamente en la coordenada
            etiquetaTexto.setAttribute("fill", "#111111");
            etiquetaTexto.textContent = nombresSignos[i];

            lienzoSvg.appendChild(etiquetaTexto);
        }
    }
});