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
        puntoCentral.setAttribute("r", "4");
        puntoCentral.setAttribute("fill", "#111111");
        lienzoSvg.appendChild(puntoCentral);

        // --- ¡Aquí empezaremos a pintar las líneas de los signos! ---
    }
});
