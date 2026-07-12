// ============================================================
//  GLIESE · CARTA ASTRAL MANUAL (SIN API)
//  v5.0 - Whole Sign / Regiomontanus (cálculo propio)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // ---- ELEMENTOS DEL DOM ----
    const btnGenerar = document.getElementById('btn-generar');
    const btnRestablecer = document.getElementById('btn-restablecer');
    const svg = document.getElementById('carta-astral');
    const mensajeError = document.getElementById('mensaje-error');
    const listaPlanetas = document.getElementById('lista-planetas');

    // ---- CONFIGURACIÓN ----
    const CX = 300, CY = 300, RADIO = 230;
    const SIGNOS = ['ARIES','TAURO','GÉMINIS','CÁNCER','LEO','VIRGO',
                    'LIBRA','ESCORPIO','SAGITARIO','CAPRICORNIO','ACUARIO','PISCIS'];

    // Lista de cuerpos celestes con sus símbolos Unicode
    const CUERPOS = [
        { id: 'sol',       nombre: 'Sol',       simbolo: '☉' },
        { id: 'luna',      nombre: 'Luna',      simbolo: '☽' },
        { id: 'mercurio',  nombre: 'Mercurio',  simbolo: '☿' },
        { id: 'venus',     nombre: 'Venus',     simbolo: '♀' },
        { id: 'marte',     nombre: 'Marte',     simbolo: '♂' },
        { id: 'jupiter',   nombre: 'Júpiter',   simbolo: '♃' },
        { id: 'saturno',   nombre: 'Saturno',   simbolo: '♄' },
        { id: 'urano',     nombre: 'Urano',     simbolo: '♅' },
        { id: 'neptuno',   nombre: 'Neptuno',   simbolo: '♆' },
        { id: 'pluton',    nombre: 'Plutón',    simbolo: '♇' },
        { id: 'quiron',    nombre: 'Quirón',    simbolo: '⚷' },
        { id: 'nodo-norte', nombre: 'Nodo Norte', simbolo: '☊' }
    ];

    // ---- GENERAR DINÁMICAMENTE LOS CAMPOS DE PLANETAS ----
    function generarCamposPlanetas() {
        listaPlanetas.innerHTML = '';
        CUERPOS.forEach((cuerpo) => {
            const div = document.createElement('div');
            div.className = 'fila-planeta';
            div.dataset.planetaId = cuerpo.id;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'check-mostrar';
            checkbox.checked = true;
            checkbox.dataset.planetaId = cuerpo.id;

            const label = document.createElement('label');
            label.className = 'nombre-astro';
            label.textContent = `${cuerpo.simbolo} ${cuerpo.nombre}`;

            const contenedorCampos = document.createElement('div');
            contenedorCampos.className = 'campos-posicion';

            const inputGrado = document.createElement('input');
            inputGrado.type = 'number';
            inputGrado.min = 0; inputGrado.max = 29;
            inputGrado.placeholder = 'G°';
            inputGrado.className = 'p-grado';
            inputGrado.dataset.planetaId = cuerpo.id;

            const inputMinuto = document.createElement('input');
            inputMinuto.type = 'number';
            inputMinuto.min = 0; inputMinuto.max = 59;
            inputMinuto.placeholder = "M'";
            inputMinuto.className = 'p-minuto';
            inputMinuto.dataset.planetaId = cuerpo.id;

            const selectSigno = document.createElement('select');
            selectSigno.className = 'p-signo';
            selectSigno.dataset.planetaId = cuerpo.id;
            SIGNOS.forEach((sig, i) => {
                const opt = document.createElement('option');
                opt.value = i;
                opt.textContent = sig;
                selectSigno.appendChild(opt);
            });

            contenedorCampos.appendChild(inputGrado);
            contenedorCampos.appendChild(inputMinuto);
            contenedorCampos.appendChild(selectSigno);

            div.appendChild(checkbox);
            div.appendChild(label);
            div.appendChild(contenedorCampos);

            listaPlanetas.appendChild(div);
        });
    }
    generarCamposPlanetas();

    // ---- FUNCIONES AUXILIARES ----
    function mostrarError(msg) {
        mensajeError.textContent = msg;
        mensajeError.style.display = 'block';
        console.error(msg);
    }
    function ocultarError() {
        mensajeError.style.display = 'none';
    }

    function crearElemento(tipo, atributos) {
        const el = document.createElementNS('http://www.w3.org/2000/svg', tipo);
        if (atributos) {
            for (const [k, v] of Object.entries(atributos)) {
                el.setAttribute(k, String(v));
            }
        }
        return el;
    }

    function limpiarSVG() {
        while (svg.firstChild) svg.removeChild(svg.firstChild);
    }

    // ---- CONVERSIÓN A GRADOS ABSOLUTOS ----
    function posicionAbsoluta(grado, minuto, signo) {
        const g = parseFloat(grado) || 0;
        const m = parseFloat(minuto) || 0;
        const s = parseInt(signo, 10) || 0;
        return s * 30 + g + m / 60;
    }

    // ---- RECOGER DATOS DEL FORMULARIO ----
    function obtenerDatosFormulario() {
        const datos = {
            ascendente: null,
            medioCielo: null,
            latitud: null,
            sistema: document.getElementById('sistema-casas').value,
            mostrarCasas: document.getElementById('mostrar-casas').checked,
            planetas: {}
        };

        // ASC
        const ascG = document.getElementById('asc-grado').value;
        const ascM = document.getElementById('asc-minuto').value;
        const ascS = document.getElementById('asc-signo').value;
        if (ascG !== '' && ascM !== '' && ascS !== '') {
            datos.ascendente = posicionAbsoluta(ascG, ascM, ascS);
        }

        // MC
        const mcG = document.getElementById('mc-grado').value;
        const mcM = document.getElementById('mc-minuto').value;
        const mcS = document.getElementById('mc-signo').value;
        if (mcG !== '' && mcM !== '' && mcS !== '') {
            datos.medioCielo = posicionAbsoluta(mcG, mcM, mcS);
        }

        // Latitud
        const lat = document.getElementById('latitud-casas').value;
        datos.latitud = parseFloat(lat) || 0;

        // Planetas
        const filas = document.querySelectorAll('.fila-planeta');
        filas.forEach(fila => {
            const id = fila.dataset.planetaId;
            const check = fila.querySelector('.check-mostrar');
            const g = fila.querySelector('.p-grado').value;
            const m = fila.querySelector('.p-minuto').value;
            const s = fila.querySelector('.p-signo').value;
            if (g !== '' && m !== '' && s !== '') {
                datos.planetas[id] = {
                    posicion: posicionAbsoluta(g, m, s),
                    mostrar: check.checked
                };
            } else {
                datos.planetas[id] = { posicion: 0, mostrar: false };
            }
        });

        return datos;
    }

    // ---- CÁLCULO DE CÚSPIDES (SIN API) ----
    function calcularCuspides(asc, mc, lat, sistema) {
        const eps = 23.4366; // oblicuidad de la eclíptica (valor fijo)
        const cusp = [];

        if (sistema === 'W') {
            // Whole Sign: cada 30° desde el ASC
            for (let i = 0; i < 12; i++) {
                let ang = (asc + i * 30) % 360;
                if (ang < 0) ang += 360;
                cusp.push(ang);
            }
            return cusp;
        }

        if (sistema === 'R') {
            // Regiomontanus (aproximación ecuatorial)
            const latRad = lat * Math.PI / 180;
            const epsRad = eps * Math.PI / 180;
            const ascRad = asc * Math.PI / 180;
            const mcRad = mc * Math.PI / 180;

            // ARMC = MC - 90°
            let armc = mc - 90;
            if (armc < 0) armc += 360;
            const armcRad = armc * Math.PI / 180;

            // RA del ASC
            const sinDecAsc = Math.sin(epsRad) * Math.sin(ascRad);
            const decAsc = Math.asin(sinDecAsc);
            const cosDecAsc = Math.cos(decAsc);
            let raAsc = Math.atan2(Math.cos(epsRad) * Math.sin(ascRad), Math.cos(ascRad));
            let raAscDeg = raAsc * 180 / Math.PI;
            if (raAscDeg < 0) raAscDeg += 360;

            // Ángulo horario del ASC
            let hAsc = raAscDeg - armc;
            if (hAsc < 0) hAsc += 360;

            // Para cada casa, calcular su cúspide
            for (let i = 0; i < 12; i++) {
                let h = hAsc + i * 30;
                if (h >= 360) h -= 360;
                let ra = armc + h;
                if (ra >= 360) ra -= 360;
                const raRad = ra * Math.PI / 180;
                // Proyectar sobre la eclíptica (asumiendo declinación cero)
                let lon = Math.atan2(Math.sin(raRad) * Math.cos(epsRad), Math.cos(raRad));
                let lonDeg = lon * 180 / Math.PI;
                if (lonDeg < 0) lonDeg += 360;
                cusp.push(lonDeg);
            }
            return cusp;
        }

        // Fallback: Whole Sign
        for (let i = 0; i < 12; i++) {
            let ang = (asc + i * 30) % 360;
            if (ang < 0) ang += 360;
            cusp.push(ang);
        }
        return cusp;
    }

    // ---- DIBUJO DE LA CARTA ----
    function dibujarCarta(datos) {
        limpiarSVG();
        if (!datos || datos.ascendente === null || datos.medioCielo === null) {
            dibujarRuedaBase();
            return;
        }

        const { ascendente, medioCielo, latitud, sistema, mostrarCasas, planetas } = datos;

        // 1. Rueda base
        dibujarRuedaBase();

        // 2. Líneas de casas (si está activado)
        if (mostrarCasas) {
            const cuspides = calcularCuspides(ascendente, medioCielo, latitud, sistema);
            dibujarLineasCasas(cuspides);
        }

        // 3. Ejes ASC y MC
        dibujarEjes(ascendente, medioCielo);

        // 4. Nombres de signos (curvados)
        dibujarNombresSignos();

        // 5. Grados (cada 10°)
        dibujarGrados();

        // 6. Planetas (con símbolos)
        dibujarPlanetas(planetas);

        // Guardar en localStorage
        try {
            localStorage.setItem('carta_manual_datos', JSON.stringify(datos));
        } catch (e) {}
    }

    // ---- SUBFUNCIONES DE DIBUJO ----
    function dibujarRuedaBase() {
        svg.appendChild(crearElemento('circle', { cx: CX, cy: CY, r: RADIO, stroke: '#111', 'stroke-width': 1.5, fill: 'none' }));
        svg.appendChild(crearElemento('circle', { cx: CX, cy: CY, r: RADIO - 25, stroke: '#111', 'stroke-width': 1, fill: 'none' }));
        svg.appendChild(crearElemento('circle', { cx: CX, cy: CY, r: 3, fill: '#111' }));
    }

    function dibujarLineasCasas(cuspides) {
        cuspides.forEach(grado => {
            const ang = (grado - 90) * Math.PI / 180;
            const x1 = CX, y1 = CY;
            const x2 = CX + RADIO * Math.cos(ang);
            const y2 = CY + RADIO * Math.sin(ang);
            svg.appendChild(crearElemento('line', {
                x1, y1, x2, y2,
                stroke: '#999', 'stroke-width': 0.5, 'stroke-dasharray': '2,4'
            }));
        });
    }

    function dibujarEjes(asc, mc) {
        // Ascendente
        const radAsc = (asc - 90) * Math.PI / 180;
        const xAsc1 = CX + (RADIO - 25) * Math.cos(radAsc);
        const yAsc1 = CY + (RADIO - 25) * Math.sin(radAsc);
        const xAsc2 = CX + (RADIO - 65) * Math.cos(radAsc);
        const yAsc2 = CY + (RADIO - 65) * Math.sin(radAsc);
        svg.appendChild(crearElemento('line', { x1: xAsc1, y1: yAsc1, x2: xAsc2, y2: yAsc2, stroke: '#111', 'stroke-width': 2 }));
        const txtAsc = crearElemento('text', {
            x: CX + (RADIO - 78) * Math.cos(radAsc),
            y: CY + (RADIO - 78) * Math.sin(radAsc) + 4,
            'font-family': "'Inter', sans-serif", 'font-size': 10, 'font-weight': 600,
            'text-anchor': 'middle', fill: '#111'
        });
        txtAsc.textContent = 'ASC';
        svg.appendChild(txtAsc);

        // Medio Cielo
        const radMc = (mc - 90) * Math.PI / 180;
        const xMc1 = CX + (RADIO - 25) * Math.cos(radMc);
        const yMc1 = CY + (RADIO - 25) * Math.sin(radMc);
        const xMc2 = CX + (RADIO - 65) * Math.cos(radMc);
        const yMc2 = CY + (RADIO - 65) * Math.sin(radMc);
        svg.appendChild(crearElemento('line', { x1: xMc1, y1: yMc1, x2: xMc2, y2: yMc2, stroke: '#111', 'stroke-width': 1.5, 'stroke-dasharray': '4,4' }));
        const txtMc = crearElemento('text', {
            x: CX + (RADIO - 78) * Math.cos(radMc),
            y: CY + (RADIO - 78) * Math.sin(radMc) + 4,
            'font-family': "'Inter', sans-serif", 'font-size': 10, 'font-weight': 600,
            'text-anchor': 'middle', fill: '#111'
        });
        txtMc.textContent = 'MC';
        svg.appendChild(txtMc);
    }

    function dibujarNombresSignos() {
        const rTexto = RADIO - 16;
        for (let i = 0; i < 12; i++) {
            const angIni = (i * 30 - 90) * Math.PI / 180;
            const angFin = ((i * 30 + 30) - 90) * Math.PI / 180;
            const sx = CX + rTexto * Math.cos(angIni);
            const sy = CY + rTexto * Math.sin(angIni);
            const ex = CX + rTexto * Math.cos(angFin);
            const ey = CY + rTexto * Math.sin(angFin);
            const id = `path-signo-${i}`;
            svg.appendChild(crearElemento('path', { id, d: `M ${ex},${ey} A ${rTexto},${rTexto} 0 0,1 ${sx},${sy}`, fill: 'none', stroke: 'none' }));
            const tp = crearElemento('textPath', { href: `#${id}`, 'startOffset': '50%', 'text-anchor': 'middle' });
            tp.textContent = SIGNOS[i];
            const txt = crearElemento('text', { 'font-family': "'Inter', sans-serif", 'font-size': 10, 'font-weight': 600, fill: '#111' });
            txt.appendChild(tp);
            svg.appendChild(txt);
        }
    }

    function dibujarGrados() {
        const rGrados = RADIO - 4;
        for (let i = 0; i < 360; i += 10) {
            const ang = (i - 90) * Math.PI / 180;
            const x = CX + rGrados * Math.cos(ang);
            const y = CY + rGrados * Math.sin(ang) + 2;
            const txt = crearElemento('text', {
                x, y,
                'font-family': "'Inter', sans-serif",
                'font-size': 6,
                'text-anchor': 'middle',
                fill: '#666',
                opacity: 0.5
            });
            txt.textContent = i;
            svg.appendChild(txt);
        }
    }

    function dibujarPlanetas(planetas) {
        const radioBase = RADIO - 45;
        const radioStep = 7;
        let idx = 0;
        for (const [id, data] of Object.entries(planetas)) {
            if (!data.mostrar) continue;
            const pos = data.posicion;
            const cuerpo = CUERPOS.find(c => c.id === id);
            if (!cuerpo) continue;
            const radio = Math.min(radioBase + (idx % 3) * radioStep, RADIO - 30);
            const ang = (pos - 90) * Math.PI / 180;
            const x = CX + radio * Math.cos(ang);
            const y = CY + radio * Math.sin(ang) + 3;
            const txt = crearElemento('text', {
                x, y,
                'font-family': "'Segoe UI Symbol', 'Arial Unicode MS', sans-serif",
                'font-size': 14,
                'font-weight': 400,
                'text-anchor': 'middle',
                fill: '#111',
                opacity: 0.9
            });
            txt.textContent = cuerpo.simbolo;
            svg.appendChild(txt);
            idx++;
        }
    }

    // ---- ACCIÓN PRINCIPAL ----
    function generarCarta() {
        ocultarError();
        const datos = obtenerDatosFormulario();
        if (datos.ascendente === null || datos.medioCielo === null) {
            mostrarError('⚠️ Debes ingresar el Ascendente y el Medio Cielo.');
            return;
        }
        // Validar que al menos un planeta tenga datos
        const algunPlaneta = Object.values(datos.planetas).some(p => p.posicion !== 0 && p.mostrar);
        if (!algunPlaneta) {
            mostrarError('⚠️ Ingresa al menos un planeta o punto para mostrar.');
            return;
        }
        dibujarCarta(datos);
    }

    function restablecerDatos() {
        document.querySelectorAll('input[type="number"]').forEach(inp => inp.value = '');
        document.querySelectorAll('select').forEach(sel => sel.selectedIndex = 0);
        document.querySelectorAll('.check-mostrar').forEach(chk => chk.checked = true);
        document.getElementById('latitud-casas').value = '';
        document.getElementById('sistema-casas').value = 'W';
        document.getElementById('mostrar-casas').checked = true;
        localStorage.removeItem('carta_manual_datos');
        dibujarCarta(null);
        ocultarError();
    }

    // ---- CARGAR DATOS GUARDADOS ----
    function cargarDatosGuardados() {
        try {
            const raw = localStorage.getItem('carta_manual_datos');
            if (!raw) {
                dibujarCarta(null);
                return;
            }
            const datos = JSON.parse(raw);
            dibujarCarta(datos);
        } catch (e) {
            console.warn('No se pudieron cargar datos guardados:', e);
            dibujarCarta(null);
        }
    }

    // ---- SOBRESCRIBIR dibujarCarta PARA GUARDAR ----
    const dibujarCartaOriginal = dibujarCarta;
    dibujarCarta = function(datos) {
        dibujarCartaOriginal(datos);
        if (datos && datos.ascendente !== null) {
            try {
                localStorage.setItem('carta_manual_datos', JSON.stringify(datos));
            } catch (e) {}
        }
    };

    // ---- EVENTOS ----
    btnGenerar.addEventListener('click', generarCarta);
    btnRestablecer.addEventListener('click', restablecerDatos);
    document.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                generarCarta();
            }
        });
    });

    // ---- INICIALIZAR ----
    cargarDatosGuardados();
});