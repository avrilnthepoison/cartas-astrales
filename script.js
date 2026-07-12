// ============================================
// GLIESE - CARTA ASTRAL CON SWISS EPHEMERIS
// ============================================

document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // CONFIGURACIÓN INICIAL
    // ==========================================
    const botonCalcular = document.getElementById("btn-calcular");
    const botonBorrar = document.getElementById("btn-borrar");
    const lienzoSvg = document.getElementById("carta-astral");
    
    const CENTRO_X = 300;
    const CENTRO_Y = 300;
    const RADIO_RUEDA = 230;
    
    const SIGNOS = [
        "ARIES", "TAURO", "GÉMINIS", "CÁNCER",
        "LEO", "VIRGO", "LIBRA", "ESCORPIO",
        "SAGITARIO", "CAPRICORNIO", "ACUARIO", "PISCIS"
    ];
    
    // Nombres de planetas (para visualización)
    const NOMBRES_PLANETAS = {
        'Sun': 'SOL',
        'Moon': 'LUNA',
        'Mercury': 'MERCURIO',
        'Venus': 'VENUS',
        'Mars': 'MARTE',
        'Jupiter': 'JÚPITER',
        'Saturn': 'SATURNO',
        'Uranus': 'URANO',
        'Neptune': 'NEPTUNO',
        'Pluto': 'PLUTÓN',
        'Chiron': 'QUIRÓN',
        'TrueNode': 'NODO NORTE'
    };
    
    // IDs de los cuerpos en Swiss Ephemeris
    const SE_BODIES = {
        'Sun': swe.SE_SUN,
        'Moon': swe.SE_MOON,
        'Mercury': swe.SE_MERCURY,
        'Venus': swe.SE_VENUS,
        'Mars': swe.SE_MARS,
        'Jupiter': swe.SE_JUPITER,
        'Saturn': swe.SE_SATURN,
        'Uranus': swe.SE_URANUS,
        'Neptune': swe.SE_NEPTUNE,
        'Pluto': swe.SE_PLUTO,
        'Chiron': swe.SE_CHIRON,
        'TrueNode': swe.SE_TRUE_NODE
    };
    
    const CANTIDAD_CUERPOS = Object.keys(SE_BODIES).length;

    // ==========================================
    // FUNCIÓN: OBTENER EFEMÉRIDES
    // ==========================================
    function obtenerEfemerides(tiempoJuliano, cuerpoId) {
        try {
            // Flags: usar efemérides con correcciones
            const flags = swe.SEFLG_SWIEPH | swe.SEFLG_SPEED;
            
            // Obtener posición del cuerpo
            const resultado = swe.calc_ut(tiempoJuliano, cuerpoId, flags);
            
            if (!resultado || resultado.length < 3) {
                console.warn(`No se pudo calcular el cuerpo ${cuerpoId}`);
                return null;
            }
            
            // resultado[0] = longitud eclíptica en grados
            // resultado[1] = latitud eclíptica
            // resultado[2] = distancia
            // resultado[3] = velocidad en longitud
            // resultado[4] = velocidad en latitud
            // resultado[5] = velocidad en distancia
            
            let longitud = resultado[0];
            
            // Normalizar a 0-360
            longitud = ((longitud % 360) + 360) % 360;
            
            return {
                longitud: longitud,
                latitud: resultado[1] || 0,
                distancia: resultado[2] || 0,
                velocidad: resultado[3] || 0
            };
        } catch (error) {
            console.error(`Error en obtenerEfemerides (cuerpo ${cuerpoId}):`, error);
            return null;
        }
    }

    // ==========================================
    // FUNCIÓN: CALCULAR ASCENDENTE (ARMC)
    // ==========================================
    function calcularAscendenteMC(tiempoJuliano, latitud, longitud) {
        try {
            // Calcular el tiempo sideral local
            const armc = swe.sidtime(tiempoJuliano);
            
            // Ajustar por longitud
            const horaSideral = armc + (longitud / 15);
            const ramc = ((horaSideral % 24) / 24) * 360;
            
            // Calcular Ascendente usando fórmula de astrología tradicional
            // Para sistema de signos enteros, usamos el ASC en el signo correspondiente
            const obl = swe.get_obl(tiempoJuliano);
            const eps = obl * Math.PI / 180;
            const latRad = latitud * Math.PI / 180;
            const ramcRad = ramc * Math.PI / 180;
            
            // Fórmula para el Ascendente
            const y = -Math.cos(ramcRad);
            const x = Math.sin(ramcRad) * Math.cos(eps) + Math.tan(latRad) * Math.sin(eps);
            
            let asc = Math.atan2(y, x) * 180 / Math.PI;
            asc = ((asc % 360) + 360) % 360;
            
            // MC (Medio Cielo)
            const mc = ((ramc + 90) % 360 + 360) % 360;
            
            return {
                ascendente: asc,
                medioCielo: mc,
                ramc: ramc
            };
        } catch (error) {
            console.error("Error en calcularAscendenteMC:", error);
            return {
                ascendente: 0,
                medioCielo: 0,
                ramc: 0
            };
        }
    }

    // ==========================================
    // FUNCIÓN: CONVERTIR DÍA JULIANO
    // ==========================================
    function convertirADiaJuliano(fechaStr, horaStr, zonaHoraria) {
        try {
            // Construir fecha con zona horaria
            const fechaCompleta = `${fechaStr}T${horaStr}`;
            const fechaMoment = moment.tz(fechaCompleta, `UTC${zonaHoraria >= 0 ? '+' : ''}${zonaHoraria}`);
            
            if (!fechaMoment.isValid()) {
                throw new Error("Fecha inválida");
            }
            
            // Convertir a UTC y obtener día juliano
            const fechaUTC = fechaMoment.clone().utc();
            const año = fechaUTC.year();
            const mes = fechaUTC.month() + 1;
            const dia = fechaUTC.date();
            const hora = fechaUTC.hour();
            const minuto = fechaUTC.minute();
            const segundo = fechaUTC.second();
            
            // Usar la función de Swiss Ephemeris para día juliano
            const diaJuliano = swe.julday(año, mes, dia, hora + minuto/60 + segundo/3600);
            
            return diaJuliano;
        } catch (error) {
            console.error("Error en convertirADiaJuliano:", error);
            return null;
        }
    }

    // ==========================================
    // FUNCIÓN: CALCULAR TODOS LOS CUERPOS
    // ==========================================
    function calcularCartaCompleta(fechaStr, horaStr, latitud, longitud, zonaHoraria) {
        try {
            // Convertir a día juliano
            const diaJuliano = convertirADiaJuliano(fechaStr, horaStr, zonaHoraria);
            if (!diaJuliano) {
                throw new Error("No se pudo convertir la fecha a día juliano");
            }
            
            // Calcular Ascendente y MC
            const ejes = calcularAscendenteMC(diaJuliano, latitud, longitud);
            
            // Calcular posiciones planetarias
            const posiciones = {};
            const planetasLista = Object.entries(SE_BODIES);
            
            for (const [nombre, id] of planetasLista) {
                const resultado = obtenerEfemerides(diaJuliano, id);
                if (resultado) {
                    const nombreMostrar = NOMBRES_PLANETAS[nombre] || nombre;
                    posiciones[nombreMostrar] = resultado.longitud;
                } else {
                    posiciones[nombreMostrar] = 0;
                }
            }
            
            // Calcular Nodo Norte (ya incluido en SE_BODIES)
            // Si no se pudo calcular, usar cálculo alternativo (para TrueNode)
            
            return {
                ascendente: ejes.ascendente,
                medioCielo: ejes.medioCielo,
                ramc: ejes.ramc,
                planetas: posiciones,
                diaJuliano: diaJuliano,
                fecha: fechaStr,
                hora: horaStr,
                latitud: latitud,
                longitud: longitud,
                zonaHoraria: zonaHoraria
            };
        } catch (error) {
            console.error("Error en calcularCartaCompleta:", error);
            alert("Error al calcular la carta. Verifica los datos ingresados.");
            return null;
        }
    }

    // ==========================================
    // FUNCIÓN: DIBUJAR CARTA ASTRAL
    // ==========================================
    function dibujarCartaAstral(datos) {
        // Limpiar SVG
        while (lienzoSvg.firstChild) {
            lienzoSvg.removeChild(lienzoSvg.firstChild);
        }
        
        if (!datos) {
            dibujarRuedaBase();
            return;
        }
        
        const { ascendente, medioCielo, planetas } = datos;
        
        // Dibujar elementos en capas
        dibujarRuedaBase();
        dibujarEjes(ascendente, medioCielo);
        dibujarPlanetas(planetas);
        dibujarNombresSignos();
        dibujarGradosDetalle();
        
        // Guardar en localStorage
        try {
            localStorage.setItem('cartaAstralDatos', JSON.stringify(datos));
        } catch (e) {
            console.warn("No se pudo guardar en localStorage:", e);
        }
    }

    // ==========================================
    // FUNCIÓN: DIBUJAR RUEDA BASE
    // ==========================================
    function dibujarRuedaBase() {
        // Círculo exterior
        const circuloExterior = crearElemento('circle', {
            cx: CENTRO_X,
            cy: CENTRO_Y,
            r: RADIO_RUEDA,
            stroke: '#111111',
            'stroke-width': '1.5',
            fill: 'none'
        });
        lienzoSvg.appendChild(circuloExterior);
        
        // Círculo interior
        const circuloInterior = crearElemento('circle', {
            cx: CENTRO_X,
            cy: CENTRO_Y,
            r: RADIO_RUEDA - 25,
            stroke: '#111111',
            'stroke-width': '1',
            fill: 'none'
        });
        lienzoSvg.appendChild(circuloInterior);
        
        // Punto central
        const puntoCentral = crearElemento('circle', {
            cx: CENTRO_X,
            cy: CENTRO_Y,
            r: '3',
            fill: '#111111'
        });
        lienzoSvg.appendChild(puntoCentral);
        
        // Líneas divisorias (30°)
        for (let i = 0; i < 12; i++) {
            const angulo = i * 30;
            const rad = (angulo - 90) * (Math.PI / 180);
            const x1 = CENTRO_X + RADIO_RUEDA * Math.cos(rad);
            const y1 = CENTRO_Y + RADIO_RUEDA * Math.sin(rad);
            const x2 = CENTRO_X + (RADIO_RUEDA - 25) * Math.cos(rad);
            const y2 = CENTRO_Y + (RADIO_RUEDA - 25) * Math.sin(rad);
            
            const linea = crearElemento('line', {
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
                stroke: '#111111',
                'stroke-width': '1'
            });
            lienzoSvg.appendChild(linea);
        }
    }

    // ==========================================
    // FUNCIÓN: DIBUJAR EJES
    // ==========================================
    function dibujarEjes(ascendente, medioCielo) {
        // Ascendente (línea sólida)
        const radAsc = (ascendente - 90) * (Math.PI / 180);
        const xAsc1 = CENTRO_X + (RADIO_RUEDA - 25) * Math.cos(radAsc);
        const yAsc1 = CENTRO_Y + (RADIO_RUEDA - 25) * Math.sin(radAsc);
        const xAsc2 = CENTRO_X + (RADIO_RUEDA - 65) * Math.cos(radAsc);
        const yAsc2 = CENTRO_Y + (RADIO_RUEDA - 65) * Math.sin(radAsc);
        
        const lineaAsc = crearElemento('line', {
            x1: xAsc1,
            y1: yAsc1,
            x2: xAsc2,
            y2: yAsc2,
            stroke: '#111111',
            'stroke-width': '2'
        });
        lienzoSvg.appendChild(lineaAsc);
        
        // Etiqueta ASC
        const xAscTxt = CENTRO_X + (RADIO_RUEDA - 78) * Math.cos(radAsc);
        const yAscTxt = CENTRO_Y + (RADIO_RUEDA - 78) * Math.sin(radAsc) + 4;
        const txtAsc = crearElemento('text', {
            x: xAscTxt,
            y: yAscTxt,
            'font-family': "'Inter', sans-serif",
            'font-size': '10',
            'font-weight': '600',
            'text-anchor': 'middle',
            fill: '#111111'
        });
        txtAsc.textContent = 'ASC';
        lienzoSvg.appendChild(txtAsc);
        
        // Medio Cielo (línea punteada)
        const radMc = (medioCielo - 90) * (Math.PI / 180);
        const xMc1 = CENTRO_X + (RADIO_RUEDA - 25) * Math.cos(radMc);
        const yMc1 = CENTRO_Y + (RADIO_RUEDA - 25) * Math.sin(radMc);
        const xMc2 = CENTRO_X + (RADIO_RUEDA - 65) * Math.cos(radMc);
        const yMc2 = CENTRO_Y + (RADIO_RUEDA - 65) * Math.sin(radMc);
        
        const lineaMc = crearElemento('line', {
            x1: xMc1,
            y1: yMc1,
            x2: xMc2,
            y2: yMc2,
            stroke: '#111111',
            'stroke-width': '1.5',
            'stroke-dasharray': '4,4'
        });
        lienzoSvg.appendChild(lineaMc);
        
        // Etiqueta MC
        const xMcTxt = CENTRO_X + (RADIO_RUEDA - 78) * Math.cos(radMc);
        const yMcTxt = CENTRO_Y + (RADIO_RUEDA - 78) * Math.sin(radMc) + 4;
        const txtMc = crearElemento('text', {
            x: xMcTxt,
            y: yMcTxt,
            'font-family': "'Inter', sans-serif",
            'font-size': '10',
            'font-weight': '600',
            'text-anchor': 'middle',
            fill: '#111111'
        });
        txtMc.textContent = 'MC';
        lienzoSvg.appendChild(txtMc);
    }

    // ==========================================
    // FUNCIÓN: DIBUJAR PLANETAS
    // ==========================================
    function dibujarPlanetas(planetas) {
        const nombresPlanetas = Object.keys(planetas);
        const total = nombresPlanetas.length;
        
        // Si hay muchos planetas, usar radios escalonados
        const radioBase = RADIO_RUEDA - 45;
        const radioStep = 8;
        const maxRadio = RADIO_RUEDA - 30;
        
        for (let i = 0; i < total; i++) {
            const nombre = nombresPlanetas[i];
            const posicion = planetas[nombre];
            
            // Radio escalonado para evitar superposición
            const radioPlaneta = Math.min(radioBase + (i % 3) * radioStep, maxRadio);
            
            const rad = (posicion - 90) * (Math.PI / 180);
            const x = CENTRO_X + radioPlaneta * Math.cos(rad);
            const y = CENTRO_Y + radioPlaneta * Math.sin(rad) + 3;
            
            const txtPlaneta = crearElemento('text', {
                x: x,
                y: y,
                'font-family': "'Inter', sans-serif",
                'font-size': '9',
                'font-weight': '500',
                'text-anchor': 'middle',
                fill: '#111111',
                opacity: '0.8'
            });
            txtPlaneta.textContent = nombre;
            lienzoSvg.appendChild(txtPlaneta);
        }
    }

    // ==========================================
    // FUNCIÓN: DIBUJAR NOMBRES DE SIGNOS
    // ==========================================
    function dibujarNombresSignos() {
        const radioTexto = RADIO_RUEDA - 16;
        
        for (let i = 0; i < 12; i++) {
            const anguloInicio = (i * 30 - 90) * (Math.PI / 180);
            const anguloFin = ((i * 30 + 30) - 90) * (Math.PI / 180);
            
            const sx = CENTRO_X + radioTexto * Math.cos(anguloInicio);
            const sy = CENTRO_Y + radioTexto * Math.sin(anguloInicio);
            const ex = CENTRO_X + radioTexto * Math.cos(anguloFin);
            const ey = CENTRO_Y + radioTexto * Math.sin(anguloFin);
            
            const idPath = `path-signo-${i}`;
            const path = crearElemento('path', {
                id: idPath,
                d: `M ${ex},${ey} A ${radioTexto},${radioTexto} 0 0,1 ${sx},${sy}`,
                fill: 'none',
                stroke: 'none'
            });
            lienzoSvg.appendChild(path);
            
            const txtPath = crearElemento('textPath', {
                href: `#${idPath}`,
                'startOffset': '50%',
                'text-anchor': 'middle'
            });
            txtPath.textContent = SIGNOS[i];
            
            const texto = crearElemento('text', {
                'font-family': "'Inter', sans-serif",
                'font-size': '10',
                'font-weight': '600',
                fill: '#111111'
            });
            texto.appendChild(txtPath);
            lienzoSvg.appendChild(texto);
        }
    }

    // ==========================================
    // FUNCIÓN: DIBUJAR GRADOS DETALLE
    // ==========================================
    function dibujarGradosDetalle() {
        const radioGrados = RADIO_RUEDA - 4;
        
        for (let i = 0; i < 360; i += 10) {
            const angulo = (i - 90) * (Math.PI / 180);
            const x = CENTRO_X + radioGrados * Math.cos(angulo);
            const y = CENTRO_Y + radioGrados * Math.sin(angulo);
            
            const txt = crearElemento('text', {
                x: x,
                y: y + 2,
                'font-family': "'Inter', sans-serif",
                'font-size': '6',
                'text-anchor': 'middle',
                fill: '#666666',
                opacity: '0.5'
            });
            txt.textContent = i;
            lienzoSvg.appendChild(txt);
        }
    }

    // ==========================================
    // FUNCIÓN: CREAR ELEMENTO SVG
    // ==========================================
    function crearElemento(tipo, atributos) {
        const elemento = document.createElementNS('http://www.w3.org/2000/svg', tipo);
        for (const [key, value] of Object.entries(atributos)) {
            elemento.setAttribute(key, value);
        }
        return elemento;
    }

    // ==========================================
    // FUNCIÓN: CARGAR DATOS GUARDADOS
    // ==========================================
    function cargarDatosGuardados() {
        try {
            const datosGuardados = localStorage.getItem('cartaAstralDatos');
            if (datosGuardados) {
                const datos = JSON.parse(datosGuardados);
                // Rellenar formulario
                if (datos.fecha) document.getElementById('fecha-nacimiento').value = datos.fecha;
                if (datos.hora) document.getElementById('hora-nacimiento').value = datos.hora;
                if (datos.latitud) document.getElementById('latitud').value = datos.latitud;
                if (datos.longitud) document.getElementById('longitud').value = datos.longitud;
                if (datos.zonaHoraria) document.getElementById('zona-horaria').value = datos.zonaHoraria;
                
                // Dibujar carta
                dibujarCartaAstral(datos);
            } else {
                dibujarCartaAstral(null);
            }
        } catch (e) {
            console.warn("No se pudieron cargar los datos guardados:", e);
            dibujarCartaAstral(null);
        }
    }

    // ==========================================
    // FUNCIÓN: RESTABLECER TODO
    // ==========================================
    function restablecerTodo() {
        document.getElementById('fecha-nacimiento').value = '';
        document.getElementById('hora-nacimiento').value = '';
        document.getElementById('latitud').value = '';
        document.getElementById('longitud').value = '';
        document.getElementById('zona-horaria').value = '';
        localStorage.removeItem('cartaAstralDatos');
        dibujarCartaAstral(null);
    }

    // ==========================================
    // FUNCIÓN: VALIDAR Y CALCULAR
    // ==========================================
    function validarYCalcular() {
        const fecha = document.getElementById('fecha-nacimiento').value;
        const hora = document.getElementById('hora-nacimiento').value;
        const latitud = parseFloat(document.getElementById('latitud').value);
        const longitud = parseFloat(document.getElementById('longitud').value);
        const zonaHoraria = parseFloat(document.getElementById('zona-horaria').value);
        
        // Validaciones
        if (!fecha || !hora) {
            alert('Por favor, ingresa fecha y hora de nacimiento.');
            return;
        }
        
        if (isNaN(latitud) || latitud < -90 || latitud > 90) {
            alert('La latitud debe ser un número entre -90 y 90.');
            return;
        }
        
        if (isNaN(longitud) || longitud < -180 || longitud > 180) {
            alert('La longitud debe ser un número entre -180 y 180.');
            return;
        }
        
        if (isNaN(zonaHoraria) || zonaHoraria < -12 || zonaHoraria > 14) {
            alert('La zona horaria debe ser un número entre -12 y 14.');
            return;
        }
        
        // Calcular carta
        const datos = calcularCartaCompleta(fecha, hora, latitud, longitud, zonaHoraria);
        if (datos) {
            dibujarCartaAstral(datos);
        }
    }

    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    botonCalcular.addEventListener('click', validarYCalcular);
    botonBorrar.addEventListener('click', restablecerTodo);
    
    // Enter para calcular
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.closest('.bloque-formulario')) {
            validarYCalcular();
        }
    });

    // ==========================================
    // INICIALIZACIÓN
    // ==========================================
    // Verificar que swe esté disponible
    if (typeof swe === 'undefined') {
        console.error('Swiss Ephemeris no está cargado correctamente.');
        alert('Error: Swiss Ephemeris no se cargó. Verifica tu conexión a internet.');
    } else {
        console.log('✅ Swiss Ephemeris cargado correctamente');
        // Inicializar archivos de efemérides
        try {
            // Establecer ruta de archivos de efemérides si es necesario
            // swe.set_ephe_path('./ephe/');
            console.log('✅ Efemérides inicializadas');
        } catch (e) {
            console.warn('⚠️ No se pudieron inicializar las efemérides:', e);
        }
    }
    
    // Cargar datos guardados
    cargarDatosGuardados();
});