document.addEventListener("DOMContentLoaded", () => {
    
    const botonGenerar = document.getElementById("btn-generar");
    const lienzoSvg = document.getElementById("carta-astral");
    
    const inputCiudad = document.getElementById("ciudad");
    const contenedorSugerencias = document.getElementById("sugerencias-ciudad");

    const CENTRO_X = 300;
    const CENTRO_Y = 300;
    const RADIO_RUEDA = 230; 

    let coordenadasSeleccionadas = {
        latitud: null,
        longitud: null,
        nombreCiudad: ""
    };

    // --- MÓDULO DE GEOLOCALIZACIÓN (OpenStreetMap) ---
    let temporizadorBusqueda;
    inputCiudad.addEventListener("input", () => {
        clearTimeout(temporizadorBusqueda);
        const query = inputCiudad.value.trim();
        if (query.length < 3) { contenedorSugerencias.style.display = "none"; return; }
        temporizadorBusqueda = setTimeout(() => { buscarCiudadEnOpenStreetMap(query); }, 400);
    });

    async function buscarCiudadEnOpenStreetMap(texto) {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(texto)}&addressdetails=1&limit=5`;
        try {
            const respuesta = await fetch(url, { headers: { "User-Agent": "MiGeneradorAstral/1.0" } });
            const datos = await respuesta.json();
            mostrarSugerencias(datos);
        } catch (error) { console.error("Error buscando la ciudad:", error); }
    }

    function mostrarSugerencias(ciudades) {
        contenedorSugerencias.innerHTML = "";
        if (ciudades.length === 0) { contenedorSugerencias.style.display = "none"; return; }
        ciudades.forEach(ciudad => {
            const item = document.createElement("div");
            item.style.padding = "8px 12px";
            item.style.cursor = "pointer";
            item.style.borderBottom = "1px solid #eee";
            item.style.color = "#111";
            item.style.fontSize = "13px";
            item.textContent = ciudad.display_name;
            item.addEventListener("mouseover", () => item.style.background = "#f5f5f5");
            item.addEventListener("mouseout", () => item.style.background = "#fff");
            item.addEventListener("click", () => {
                inputCiudad.value = ciudad.display_name;
                coordenadasSeleccionadas.latitud = parseFloat(ciudad.lat);
                coordenadasSeleccionadas.longitud = parseFloat(ciudad.lon);
                coordenadasSeleccionadas.nombreCiudad = ciudad.display_name;
                contenedorSugerencias.innerHTML = "";
                contenedorSugerencias.style.display = "none";
            });
            contenedorSugerencias.appendChild(item);
        });
        contenedorSugerencias.style.display = "block";
    }

    document.addEventListener("click", (e) => {
        if (e.target !== inputCiudad && e.target !== contenedorSugerencias) contenedorSugerencias.style.display = "none";
    });


    // --- CONTROLADOR DEL BOTÓN GENERAR (MOTOR LOCAL DE ALTA FIDELIDAD) ---
    botonGenerar.addEventListener("click", () => {
        const fechaInput = document.getElementById("fecha").value; 
        const horaInput = document.getElementById("hora").value;   

        if (!fechaInput || !horaInput) {
            alert("Por favor, introduce una fecha y hora válidas.");
            return;
        }
        if (!coordenadasSeleccionadas.latitud) {
            alert("Por favor, selecciona una ciudad de la lista desplegable.");
            return;
        }

        // Bloqueamos el botón visualmente para proteger el hilo de ejecución
        botonGenerar.textContent = "CALCULANDO...";
        botonGenerar.disabled = true;

        // Separamos y forzamos a números enteros en base 10
        const [anio, mes, dia] = fechaInput.split("-").map(num => parseInt(num, 10));
        const [horas, minutos] = horaInput.split(":").map(num => parseInt(num, 10));

        // Estimación estándar del huso horario basada en longitud geográfica
        const timezoneEstimado = Math.round(coordenadasSeleccionadas.longitud / 15);

        console.log(`Datos procesados para el motor: Fecha=${dia}/${mes}/${anio}, Hora=${horas}:${minutos}, TZ=${timezoneEstimado}, Lat=${coordenadasSeleccionadas.latitud}, Lon=${coordenadasSeleccionadas.longitud}`);

        try {
            // Validamos que el constructor global de la librería inyectada en el HTML esté disponible
            if (typeof astrology === "undefined" || !astrology.AstroDate || !astrology.Radix) {
                throw new Error("La librería matemática de astrología no se encuentra en el entorno global de la página.");
            }

            // 1. Creamos el objeto de fecha usando la sintaxis nativa exacta del motor
            const fechaAstral = new astrology.AstroDate(anio, mes, dia, horas, minutos, timezoneEstimado);
            
            // 2. Ejecutamos el cálculo del Radix limitando la precisión de coordenadas a 4 decimales
            const calculadora = new astrology.Radix(
                fechaAstral, 
                parseFloat(coordenadasSeleccionadas.latitud.toFixed(4)), 
                parseFloat(coordenadasSeleccionadas.longitud.toFixed(4))
            );

            // 3. Extraemos el Ascendente real calculado (0 - 360)
            const gradoAscendenteReal = calculadora.ascendant;
            
            // 4. Mapeamos las coordenadas de los astros septenarios clásicos
            const planetasReales = {
                "☉ SOL": calculadora.planets.sun,
                "☽ LUNA": calculadora.planets.moon,
                "☿ MER": calculadora.planets.mercury,
                "♀ VEN": calculadora.planets.venus,
                "♂ MAR": calculadora.planets.mars,
                "♃ JÚP": calculadora.planets.jupiter,
                "♄ SAT": calculadora.planets.saturn
            };

            console.log("🌌 ¡Cielo local calculado con éxito!", { gradoAscendenteReal, planetasReales });

            // Dibujamos con tus funciones visuales exactas en sentido antihorario
            dibujarRadixWholeSign(gradoAscendenteReal, planetasReales);

        } catch (error) {
            console.error("Detalle del error en el motor local:", error);
            alert(`Hubo un problema con el motor: ${error.message}`);
        } finally {
            // Restauramos el botón pase lo que pase
            botonGenerar.textContent = "GENERAR MAPA";
            botonGenerar.disabled = false;
        }
    });

    // --- TU FUNCIÓN DE DIBUJO INTEGRAL DE SIGNOS ENTEROS (SENTIDO ANTIHORARIO) ---
    function dibujarRadixWholeSign(ascendenteG, planetas) {
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

        const indiceSignoAsc = Math.floor(ascendenteG / 30); 
        const inicioSignoAscG = indiceSignoAsc * 30; 
        const desfaceG = 180 + inicioSignoAscG;

        function ajustarAngulo(gradosOriginales) {
            const gradosCalculados = desfaceG - gradosOriginales;
            return gradosCalculados * (Math.PI / 180);
        }

        // Círculo exterior principal
        const circuloExterior = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circuloExterior.setAttribute("cx", String(CENTRO_X));
        circuloExterior.setAttribute("cy", String(CENTRO_Y));
        circuloExterior.setAttribute("r", String(RADIO_RUEDA));
        circuloExterior.setAttribute("stroke", "#111111");
        circuloExterior.setAttribute("stroke-width", "1");
        circuloExterior.setAttribute("fill", "none");
        lienzoSvg.appendChild(circuloExterior);

        // Punto central
        const puntoCentral = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        puntoCentral.setAttribute("cx", String(CENTRO_X));
        puntoCentral.setAttribute("cy", String(CENTRO_Y));
        puntoCentral.setAttribute("r", "3");
        puntoCentral.setAttribute("fill", "#111111");
        lienzoSvg.appendChild(puntoCentral);

        // Dibujo de las 12 divisiones de signos (Whole Signs)
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

        // Línea del Ascendente real
        const radianesAsc = ajustarAngulo(ascendenteG);
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

        // Posicionamiento de Planetas Reales
        for (const [planeta, grados] of Object.entries(planetas)) {
            if (grados === undefined || grados === null) continue;

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