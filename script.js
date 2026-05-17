// 1. Esperamos a que la página cargue por completo
document.addEventListener("DOMContentLoaded", () => {
    
    // 2. Mapeamos los elementos visuales de la pantalla
    const botonGenerar = document.getElementById("btn-generar");
    const lienzoSvg = document.getElementById("carta-astral");

    // Centro del lienzo y dimensiones fijas
    const CENTRO_X = 300;
    const CENTRO_Y = 300;
    const RADIO_RUEDA = 280;

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

    // 5. Función de dibujo corregida
    function dibujarEstructuraRadix(datos) {
        // Limpiamos el contenedor por completo
        while (lienzoSvg.firstChild) {
            lienzoSvg.removeChild(lienzoSvg.firstChild);
        }

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

        // 3. Dibujamos las 12 divisiones (Ticks) asegurando números válidos
        for (let i = 0; i < 12; i++) {
            const grados = i * 30;
            const radianes = grados * (Math.PI / 180);

            // Forzamos el redondeo para evitar decimales infinitos que rompan el SVG
            const x1 = Math.round(CENTRO_X + RADIO_RUEDA * Math.cos(radianes));
            const y1 = Math.round(CENTRO_Y + RADIO_RUEDA * Math.sin(radianes));
            const x2 = Math.round(CENTRO_X + (RADIO_RUEDA - 15) * Math.cos(radianes));
            const y2 = Math.round(CENTRO_Y + (RADIO_RUEDA - 15) * Math.sin(radianes));

            const lineaDivisoria = document.createElementNS("http://www.w3.org/2000/svg", "line");
            lineaDivisoria.setAttribute("x1", String(x1));
            lineaDivisoria.setAttribute("y1", String(y1));
            lineaDivisoria.setAttribute("x2", String(x2));
            lineaDivisoria.setAttribute("y2", String(y2));
            lineaDivisoria.setAttribute("stroke", "#111111");
            lineaDivisoria.setAttribute("stroke-width", "1");
            
            lienzoSvg.appendChild(lineaDivisoria);
        }
    }
});