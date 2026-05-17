// 1. Esperamos a que la página cargue por completo
document.addEventListener("DOMContentLoaded", () => {
    
    // 2. Mapeamos los elementos visuales de la pantalla
    const botonGenerar = document.getElementById("btn-generar");
    const lienzoSvg = document.getElementById("carta-astral");

    // Centro del lienzo y dimensiones (definidas en tu viewBox 600x600)
    const CENTRO_X = 300;
    const CENTRO_Y = 300;
    const RADIO_RUEDA = 280;

    // 3. Escuchamos el clic del botón
    botonGenerar.addEventListener("click", () => {
        // Capturamos los datos que el usuario escribió
        const fechaInput = document.getElementById("fecha").value;
        const horaInput = document.getElementById("hora").value;
        const ciudadInput = document.getElementById("ciudad").value;

        console.log(`Calculando para: ${fechaInput} a las ${horaInput} en ${ciudadInput}`);

        // Aquí ejecutaremos la función de cálculo
        generarMatematicaAstral(fechaInput, horaInput);
    });

    // 4. Función que procesará los grados astronómicos
    function generarMatematicaAstral(fecha, hora) {
        // [Temporal] Por ahora simularemos los datos para aprender a dibujar.
        // En el siguiente paso meteremos las posiciones reales de la librería.
        const posicionesEjemplo = {
            Ascendente: 312.5, // Principio de Acuario
            Sol: 57.2,         // Tauro
            Luna: 315.1        // Acuario
        };

        dibujarEstructuraRadix(posicionesEjemplo);
    }

    // 5. Función de dibujo en el lienzo SVG
    function dibujarEstructuraRadix(datos) {
        // Borramos lo que haya adentro para no encimar cartas si das clic varias veces
        lienzoSvg.innerHTML = '';

        // Dibujamos el círculo exterior minimalista que ya tenías
        const circuloExterior = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circuloExterior.setAttribute("cx", CENTRO_X);
        circuloExterior.setAttribute("cy", CENTRO_Y);
        circuloExterior.setAttribute("r", RADIO_RUEDA);
        circuloExterior.setAttribute("stroke", "#111111");
        circuloExterior.setAttribute("stroke-width", "1");
        circuloExterior.setAttribute("fill", "none");
        lienzoSvg.appendChild(circuloExterior);

        // Dibujamos el punto central del Radix
        const puntoCentral = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        puntoCentral.setAttribute("cx", CENTRO_X);
        puntoCentral.setAttribute("cy", CENTRO_Y);
        puntoCentral.setAttribute("r", "3"); // Lo pusimos un pelín más delicado a 3px
        puntoCentral.setAttribute("fill", "#111111");
        lienzoSvg.appendChild(puntoCentral);

        // --- DIBUJAR LAS 12 DIVISIONES DE LOS SIGNOS (TICKS) ---
        // Hacemos un ciclo que vaya de 0 a 11 (los 12 signos)
        for (let i = 0; i < 12; i++) {
            // Cada signo está separado exactamente por 30 grados
            const grados = i * 30;
            // Convertimos los grados a radianes para que JavaScript los entienda matemáticamente
            const radianes = grados * (Math.PI / 180);

            // Calcular Punto 1 (En el borde exacto del círculo exterior: radio 280)
            const x1 = CENTRO_X + RADIO_RUEDA * Math.cos(radianes);
            const y1 = CENTRO_Y + RADIO_RUEDA * Math.sin(radianes);

            // Calcular Punto 2 (Un poco más adentro de la rueda: radio 268)
            // Esto define el largo de la pequeña línea divisoria (12 píxeles de largo)
            const x2 = CENTRO_X + (RADIO_RUEDA - 12) * Math.cos(radianes);
            const y2 = CENTRO_Y + (RADIO_RUEDA - 12) * Math.sin(radianes);

            // Creamos el elemento línea en el SVG
            const lineaDivisoria = document.createElementNS("http://www.w3.org/2000/svg", "line");
            lineaDivisoria.setAttribute("x1", x1);
            lineaDivisoria.setAttribute("y1", y1);
            lineaDivisoria.setAttribute("x2", x2);
            lineaDivisoria.setAttribute("y2", y2);
            lineaDivisoria.setAttribute("stroke", "#111111");
            lineaDivisoria.setAttribute("stroke-width", "1"); // Súper delgada
            
            // Añadimos la línea al lienzo
            lienzoSvg.appendChild(lineaDivisoria);
        }
    }
});