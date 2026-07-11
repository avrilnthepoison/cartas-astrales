document.addEventListener("DOMContentLoaded", () => {
    
    const botonGenerar = document.getElementById("btn-generar");
    const botonBorrar = document.getElementById("btn-borrar");
    const lienzoSvg = document.getElementById("carta-astral");

    const CENTRO_X = 300;
    const CENTRO_Y = 300;
    const RADIO_RUEDA = 230; 

    const nombresSignos = [
        "ARIES", "TAURO", "GÉMINIS", "CÁNCER", 
        "LEO", "VIRGO", "LIBRA", "ESCORPIO", 
        "SAGITARIO", "CAPRICORNIO", "ACUARIO", "PISCIS"
    ];

    function transformarADecimal(g, m) {
        return g + (m / 60);
    }

    function procesarYGenerarCarta() {
        const ascG = parseInt(document.getElementById("asc-grado").value, 10) || 0;
        const ascM = parseInt(document.getElementById("asc-minuto").value, 10) || 0;
        const ascSigno = parseInt(document.getElementById("asc-signo").value, 10);
        
        const valorAscDecimal = transformarADecimal(ascG, ascM);
        const gradoAscAbsoluto = (ascSigno * 30) + valorAscDecimal;

        const mcG = parseInt(document.getElementById("mc-grado").value, 10) || 0;
        const mcM = parseInt(document.getElementById("mc-minuto").value, 10) || 0;
        const mcSigno = parseInt(document.getElementById("mc-signo").value, 10);
        
        const valorMcDecimal = transformarADecimal(mcG, mcM);
        const gradoMcAbsoluto = (mcSigno * 30) + valorMcDecimal;

        const planetasIngresados = {};
        const filasPlanetas = document.querySelectorAll(".fila-planeta");

        const estructuraAGuardar = {
            ascendente: { g: document.getElementById("asc-grado").value, m: document.getElementById("asc-minuto").value, signo: ascSigno },
            medioCielo: { g: document.getElementById("mc-grado").value, m: document.getElementById("mc-minuto").value, signo: mcSigno },
            planetas: {}
        };

        filasPlanetas.forEach(fila => {
            const nombreAstro = fila.getAttribute("data-astro");
            const gInput = fila.querySelector(".p-grado").value;
            const mInput = fila.querySelector(".p-minuto").value;
            const signoIndice = parseInt(fila.querySelector(".p-signo").value, 10);

            const g = parseInt(gInput, 10) || 0;
            const m = parseInt(mInput, 10) || 0;

            const posicionDecimal = transformarADecimal(g, m);
            const posicionAbsoluta = (signoIndice * 30) + posicionDecimal;
            
            planetasIngresados[nombreAstro] = posicionAbsoluta;
            estructuraAGuardar.planetas[nombreAstro] = { g: gInput, m: mInput, signo: signoIndice };
        });

        localStorage.setItem("datosRadixManual", JSON.stringify(estructuraAGuardar));

        dibujarRadixManual(gradoAscAbsoluto, gradoMcAbsoluto, planetasIngresados, true);
    }

    // FUNCIÓN PARA BORRAR LA MEMORIA Y VOLVER AL ESTADO VACÍO (SÓLO RUEDA BASE)
    function restablecerTodoACero() {
        localStorage.removeItem("datosRadixManual");

        document.getElementById("asc-grado").value = "";
        document.getElementById("asc-minuto").value = "";
        document.getElementById("asc-signo").value = "0";

        document.getElementById("mc-grado").value = "";
        document.getElementById("mc-minuto").value = "";
        document.getElementById("mc-signo").value = "0";

        const filasPlanetas = document.querySelectorAll(".fila-planeta");
        filasPlanetas.forEach(fila => {
            fila.querySelector(".p-grado").value = "";
            fila.querySelector(".p-minuto").value = "";
            fila.querySelector(".p-signo").value = "0";
        });

        dibujarRadixManual(0, 0, {}, false);
    }

    // FUNCIÓN PARA RECOGER HISTORIAL TRAS UN REFRESCO (F5)
    function cargarValoresGuardados() {
        const datosGuardados = localStorage.getItem("datosRadixManual");
        
        if (!datosGuardados) {
            dibujarRadixManual(0, 0, {}, false);
            return;
        }

        try {
            const datos = JSON.parse(datosGuardados);

            if (datos.ascendente) {
                document.getElementById("asc-grado").value = datos.ascendente.g;
                document.getElementById("asc-minuto").value = datos.ascendente.m;
                document.getElementById("asc-signo").value = datos.ascendente.signo;
            }

            if (datos.medioCielo) {
                document.getElementById("mc-grado").value = datos.medioCielo.g;
                document.getElementById("mc-minuto").value = datos.medioCielo.m;
                document.getElementById("mc-signo").value = datos.medioCielo.signo;
            }

            if (datos.planetas) {
                const filasPlanetas = document.querySelectorAll(".fila-planeta");
                filasPlanetas.forEach(fila => {
                    const nombreAstro = fila.getAttribute("data-astro");
                    const datosAstro = datos.planetas[nombreAstro];
                    
                    if (datosAstro) {
                        fila.querySelector(".p-grado").value = datosAstro.g;
                        fila.querySelector(".p-minuto").value = datosAstro.m;
                        fila.querySelector(".p-signo").value = datosAstro.signo;
                    }
                });
            }
            
            procesarYGenerarCarta();

        } catch (e) {
            console.error("Error al restaurar los datos de sesión:", e);
            dibujarRadixManual(0, 0, {}, false);
        }
    }