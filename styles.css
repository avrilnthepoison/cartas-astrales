body {
    background-color: #ffffff;
    color: #111111;
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
}

.contenedor-principal {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
}

.header-astral {
    text-align: center;
    margin-bottom: 40px;
}

.header-astral h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 3rem;
    font-weight: 300;
    margin: 0;
    letter-spacing: 2px;
}

.subtitulo {
    font-size: 0.9rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #666666;
    margin-top: 5px;
}

/* --- NUEVA ESTRUCTURA EN DOS COLUMNAS --- */
.interfaz-columnas {
    display: grid;
    grid-template-columns: 1fr 1fr; /* Divide el espacio en dos partes iguales */
    gap: 50px;                      /* Espacio de separación entre las dos columnas */
    align-items: start;
}

/* --- COLUMNA IZQUIERDA: FORMULARIO --- */
.seccion-formulario {
    width: 100%;
}

.bloque-formulario {
    border: 1px solid #111111;
    padding: 20px;
    margin-bottom: 20px;
    background: #ffffff;
}

.bloque-formulario h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem;
    font-weight: 400;
    margin-top: 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #111111;
    padding-bottom: 5px;
}

.fila-eje, .fila-planeta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
    padding: 2px 0;
}

.nombre-eje, .nombre-astro {
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    width: 100px;
}

.campos-posicion {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    justify-content: flex-end;
}

.campos-posicion input[type="number"] {
    border: 1px solid #111111;
    padding: 6px;
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    background: transparent;
    color: #111111;
    width: 48px;
    text-align: center;
    box-sizing: border-box;
}

.campos-posicion select {
    border: 1px solid #111111;
    padding: 6px;
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    background: transparent;
    color: #111111;
    width: 125px;
    box-sizing: border-box;
}

#btn-generar {
    width: 100%;
    background-color: #111111;
    color: #ffffff;
    border: none;
    padding: 15px;
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s ease;
}

#btn-generar:hover {
    background-color: #333333;
}

/* --- COLUMNA DERECHA: EFECTO STICKY PARA EL MAPA --- */
.seccion-mapa {
    width: 100%;
}

.contenedor-sticky-mapa {
    position: sticky;
    top: 40px; /* Se queda clavado a 40px del tope superior de la pantalla al hacer scroll */
    display: flex;
    justify-content: center;
    align-items: center;
}

#carta-astral {
    width: 100%;
    max-width: 550px;
    height: auto;
    aspect-ratio: 1 / 1;
}

/* --- RESPONSIVE: Si la pantalla es pequeña (celulares), vuelve a una sola columna --- */
@media (max-width: 850px) {
    .interfaz-columnas {
        grid-template-columns: 1fr;
        gap: 30px;
    }
    .contenedor-sticky-mapa {
        position: relative;
        top: 0;
    }
}