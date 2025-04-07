import Tablero from "../../models/Tablero.js";
import { Acorazado, Destructor, PortaAviones, Submarino } from "../../models/Barco/barcosCondensador.js";
import Jugador from "../../models/Jugador.js";
import Clima from "../../models/Clima.js";



// Esperamos a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function () {


    // VARIABLES DE ESTADO DEL JUEGO
    let turno = 0; // 0 para jugador humano y 1 para jugador enemigo
    let size = parseInt(document.getElementById("inputTableroPc").value) || 10;
    let esHorizontal = false;
    let barcoSeleccionado = null;

    const tablaClima = document.getElementById("tabla-Clima");
    let climaSeleccionado = null;
    let guardarClima = new Clima(null, null, null);
    let mapaSeleccionado = false;


    // ELEMENTOS DEL DOM
    let seccionTableroEnemigo = document.getElementById("enemyTablero_pc");
    let seccionTableroJugador = document.getElementById("userTablero_pc");

    const botonInicializarJugador = document.getElementById("btnMenu");
    const botonGuardarJuego = document.getElementById("guardarBtn-pc");
    const botonexportarMapa = document.getElementById("exportarBtn-pc");
    const botonCrear = document.getElementById("btnCrearPc"); // Botón para crear el tablero


    // INICIALIZACIÓN DE TABLEROS

    /**
     * Creamos dos instancias de Tablero:
     * - tableroJugador: Para el jugador humano
     * - tableroEnemigo: Para la IA
     */
    let tableroJugador = new Tablero(size, size);
    let tableroEnemigo = new Tablero(size, size);


    // CONFIGURACIÓN DE BARCOS DISPONIBLES

    /**
     * Objeto que contiene información sobre los barcos disponibles:
     * - cantidad: Cuántos barcos de este tipo se pueden colocar
     * - clase: Referencia a la clase del barco
     * - img: Ruta a la imagen del barco
     */
    const barcosDisponibles = {
        PortaAviones: { cantidad: 1, clase: PortaAviones, img: "PortaAviones.png" },
        Acorazado: { cantidad: 1, clase: Acorazado, img: "Acorazado.jpg" },
        Submarino: { cantidad: 2, clase: Submarino, img: "Submarino.jpg" },
        Destructor: { cantidad: 2, clase: Destructor, img: "Destructor.jpg" }
    };

    const climasDisponibles = {
        Despejado: { nombre: "Despejado", descripcion: "Pacífico", img: "oceanodespejado.jpg", lat: 0, lon: -160 },
        Nocturno: { nombre: "Nocturno", descripcion: "Mar muerto", img: "oceano12.webp", lat: 31.55, lon: 35.47 },
        Soleado: { nombre: "Soleado", descripcion: "Báltico", img: "oceanosoleado.jpg", lat: 54.35, lon: 18.65 },
        Antartida: { nombre: "Antartida", descripcion: "Antártico", img: "Antartico.jpg", lat: -90, lon: 0 },
    }


    // INICIALIZACIÓN DE JUGADORES

    let JugadorHumano; // Jugador humano

    const JugadorIA = new Jugador("bot_ninja", 0, true); // Jugador IA (computadora)

    async function iniciarJugadorHumano(nickname) {
        JugadorHumano = await Jugador.crearJugador(nickname, 0, false);
        // podés seguir llamando funciones o iniciar lógica si querés
        console.log("Jugador creado:", JugadorHumano);
        actualizar_puntaje();

    }

    // funcion para crear jugador
    function recogerNickname() {
        const NickName = document.getElementById("input-login").value;
        iniciarJugadorHumano(NickName)
        console.log("Nickname:", NickName);
    }


    // FUNCIÓN PARA CREAR EL TABLERO

    /**
     * Crea un nuevo tablero con el tamaño especificado
     * - Valida que el tamaño esté entre 10 y 20
     * - Reinicia los contadores de barcos colocados
     * - Genera el tablero visual y los botones de barcos
     */
    function crearTablero(id_select) {
        // Obtenemos el tamaño del tablero del input
        const newSize = parseInt(document.getElementById(id_select).value) || 10;

        // Validamos que el tamaño sea correcto
        if (isNaN(newSize) || newSize < 10 || newSize > 20) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "El tamaño del tablero debe ser entre 10 y 20",
            });
            return;
        }

        // Reiniciamos los contadores de barcos colocados
        Object.keys(barcosDisponibles).forEach(k => barcosDisponibles[k].colocados = 0);

        // Actualizamos el tamaño y creamos nuevos tableros
        size = newSize;
        tableroJugador = new Tablero(size, size);
        tableroEnemigo = new Tablero(size, size);

        // Generamos el tablero visual y los botones
        generarTablero("TablaUsuario", size);
        crearBotonesBarcos();
        crearBotonesMapas();
        crearIniciarJuegobtn();
        console.log("tablero del jugador creado", tableroJugador);
        console.log("tablero del bot creado", tableroEnemigo);
        crearTableroEnemigo();
        console.log("tablero del jugador creado", tableroJugador);
        console.log("tablero del bot creado", tableroEnemigo);
    }

    function crearTableroEnemigo() {
        const tamBarcos = [2, 2, 3, 3, 4, 5]; // Tamaños de barcos posibles
        for (let i = 0; i < tamBarcos.length; i++) {
            let colocado = false;

            while (!colocado) {
                let fila = Math.floor(Math.random() * size); // Fila aleatoria
                let columna = Math.floor(Math.random() * size); // Columna aleatoria
                let orientacionBarco = Math.random() >= 0.5 ? "horizontal" : "vertical"; // Orientación aleatoria

                // Verificamos si el barco cabe dentro del tablero
                if (orientacionBarco === "vertical" && fila + tamBarcos[i] > size) continue;
                if (orientacionBarco === "horizontal" && columna + tamBarcos[i] > size) continue;

                // Intentamos colocarlo. Si devuelve false, se colocó bien.
                if (!tableroEnemigo.colocarBarcoLogico(fila, columna, tamBarcos[i], orientacionBarco)) {
                    colocado = true; // Barco colocado con éxito
                }
            }
        }
    }


    // FUNCIÓN PARA GENERAR EL TABLERO VISUAL

    function generarTablero(id, size) {
        const tabla = document.getElementById(id);
        tabla.innerHTML = ""; // Limpiamos el tablero si ya existe

        // Creamos las filas y columnas del tablero
        for (let fila = 0; fila <= size; fila++) {
            const tr = document.createElement("tr");

            for (let col = 0; col <= size; col++) {
                const td = document.createElement("td");

                // Primera columna (letras A, B, C...)
                if (col === 0 && fila > 0) {
                    td.textContent = String.fromCharCode(64 + fila); // Convertimos número a letra
                    td.classList.add("coordenada");
                }
                // Primera fila (números 1, 2, 3...)
                else if (fila === 0 && col > 0) {
                    td.textContent = col;
                    td.classList.add("coordenada");
                }
                // Celdas jugables
                else if (fila > 0 && col > 0) {
                    const filaLetra = String.fromCharCode(64 + fila);
                    td.id = `celda-${filaLetra}-${col}`;
                    td.classList.add("celda");
                    td.dataset.fila = fila - 1; // Guardamos posición en la matriz
                    td.dataset.columna = col - 1;
                    td.onclick = () => colocarBarcoEnCelda(
                        parseInt(td.dataset.fila),
                        parseInt(td.dataset.columna)
                    );
                }

                tr.appendChild(td);
            }
            tabla.appendChild(tr);
        }
    }


    // FUNCIÓN PARA CREAR LOS BOTONES DE BARCOS

    /**
     * Crea los botones/interfaz para seleccionar los barcos
     * - Muestra cuántos barcos de cada tipo quedan disponibles
     * - Asigna eventos para seleccionar barcos
     */
    function crearBotonesBarcos() {
        const contenedorBarcos = document.getElementById("contenedor-barcos");
        contenedorBarcos.innerHTML = ''; // Limpiamos el contenedor

        // Creamos un botón para cada tipo de barco disponible
        //.entries vuelve un objeto en un array donde en cada posicion se guarda una pareja de datos [nombre,dato(s)]
        Object.entries(barcosDisponibles).forEach(([nombre, datos]) => {
            const disponibles = datos.cantidad - datos.colocados;
            if (disponibles <= 0) return; // No mostramos barcos que ya se colocaron todos

            // Plantilla HTML para cada barco
            const barcoHTML = `
                <div class="col-lg-3 col-md-4 col-6">
                    <div class="carta barco-seleccionable" data-tipo="${nombre}">
                        <img src="../views/assets/${datos.img}" alt="${nombre}" class="img-fluid">
                        <div class="info">
                            <h3>${nombre}</h3>
                            <p>Disponibles: ${disponibles}</p>
                        </div>
                    </div>
                </div>
            `;
            contenedorBarcos.insertAdjacentHTML('beforeend', barcoHTML);
        });

        // Asignamos eventos a los botones de barcos
        document.querySelectorAll('.barco-seleccionable').forEach(carta => {
            carta.addEventListener('click', seleccionarBarco);
        });
    }

    // FUNCIÓN PARA SELECCIONAR UN BARCO

    function seleccionarBarco(e) { //evento del click - Saber qué elemento fue clickeado (e.currentTarget) - Sacar el tipo de barco desde data-tipo - usando los objetos de barcos

        const tipoBarco = e.currentTarget.dataset.tipo; // Obtenemos el tipo de barco
        const datosBarco = barcosDisponibles[tipoBarco]; // Obtenemos los datos del barco

        // Verificamos si ya se colocaron todos los barcos de este tipo
        if (datosBarco.colocados >= datosBarco.cantidad) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Ya colocaste todos los ${tipoBarco}s disponibles`,
            });
            return;
        }

        // Deseleccionamos otros barcos
        document.querySelectorAll('.barco-seleccionable').forEach(el => {
            el.classList.remove('barco-seleccionado');
        });
        // Seleccionamos este barco
        e.currentTarget.classList.add('barco-seleccionado');
        barcoSeleccionado = new datosBarco.clase(); // Creamos una nueva instancia del barco
    }

    // FUNCIÓN PARA COLOCAR UN BARCO EN EL TABLERO


    function colocarBarcoEnCelda(fila, columna) {
        // Verificamos que haya un barco seleccionado
        if (!barcoSeleccionado) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Primero selecciona un barco",
            });
            return;
        }

        const tamaño = barcoSeleccionado.tamaño; // Tamaño del barco
        const direccion = esHorizontal ? "horizontal" : "vertical"; // Dirección del barco
        const tipoBarco = barcoSeleccionado.nombre; // Nombre del barco

        // Validamos que el barco quepa en la posición seleccionada
        if (direccion === "horizontal" && columna + tamaño > size) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No cabe horizontalmente en esta posición",
            });
            return;
        }
        if (direccion === "vertical" && fila + tamaño > size) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No cabe verticalmente en esta posición",
            });
            return;
        }

        // Verificamos colisiones con otros barcos y colocamos la posicion en la matriz logica
        if (tableroJugador.colocarBarcoLogico(fila, columna, tamaño, direccion)) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "¡Ya hay un barco en esta posición!",
            });
            return;
        }


        // Colocamos el barco en el tablero
        for (let i = 0; i < tamaño; i++) {
            const celdaFila = direccion === "horizontal" ? fila : fila + i;
            const celdaColumna = direccion === "horizontal" ? columna + i : columna;

            // Actualizamos la representación visual
            const filaLetra = String.fromCharCode(65 + celdaFila);
            const celda = document.getElementById(`celda-${filaLetra}-${celdaColumna + 1}`);
            if (celda) {
                celda.classList.add("celda-barco"); // Aplicamos estilo
                celda.dataset.barco = tipoBarco; // Guardamos el tipo de barco
            }
        }

        // Actualizamos los contadores
        barcosDisponibles[tipoBarco].colocados++;
        crearBotonesBarcos(); // Actualizamos la interfaz
        barcoSeleccionado = null;
    }

    // FUNCIÓN PARA CREAR EL BOTÓN DE INICIAR JUEGO

    // Crea el botón para iniciar el juego después de colocar los barcos

    function crearIniciarJuegobtn() {
        const contenedor = document.getElementById("contenedortablero-pc");

        // Verificamos que el botón no exista ya
        if (document.getElementById("btnBatalla")) return;

        // Creamos el botón
        const btn = document.createElement("button");
        btn.id = "btnBatalla";
        btn.className = "btn btn-danger";
        btn.textContent = "Ir a la batalla!";

        // Asignamos el evento de click
        btn.addEventListener('click', () => {
            // Verificamos que todos los barcos estén colocados
            const todosColocados = Object.values(barcosDisponibles).every(
                b => b.colocados >= b.cantidad
            );

            if (!todosColocados) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "¡Coloca todos los barcos primero!",
                });
                return;
            } else if (!mapaSeleccionado) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "¡Selecciona un mapa primero!",
                });
                return;
            } else {
                console.log("Iniciando batalla...");
                console.log("Mostrando Juego en proceso...");
                document.querySelectorAll("section").forEach(seccion => {
                    seccion.style.display = "none";
                });

                // Mostrar la sección seleccionada
                let seccionMostrada = document.getElementById("juego-pc");
                if (seccionMostrada) {
                    seccionMostrada.style.display = "block";
                }
                // Aquí iría la lógica para comenzar el juego
                console.log("entro a la logica del juego");


                generarTableroUser(seccionTableroEnemigo.id, tableroEnemigo.get_matriz());
                generarTableroUser(seccionTableroJugador.id, tableroJugador.get_matriz());
                console.log("se supone que genero el tablero");
                seleccionarMapa();
            }


        });

        contenedor.appendChild(btn);
    }

    // EVENTO PARA ROTAR BARCOS (TECLA R)

    document.addEventListener('keydown', (e) => {
        // Verificamos si se presionó la tecla R
        if (e.key.toLowerCase() === 'r') {

            // Cambiamos la dirección
            esHorizontal = !esHorizontal;
            barcoSeleccionado.cambiarDireccion();
            console.log(`Modo: ${esHorizontal ? 'horizontal' : 'vertical'}`);
        }
    });

    //Funcion para crear las cartas de los mapas
    function crearBotonesMapas() {
        const contenedorMapas = document.getElementById("contenedor-mapas");
        contenedorMapas.innerHTML = ''; // Limpiamos el contenedor

        // Creamos un botón para cada tipo de mapa disponible
        //.entries vuelve un objeto en un array donde en cada posicion se guarda una pareja de datos [nombre,dato(s)]
        //En este caso solo usamos los datos y por eso destruimos a "nombre" con "_" ya q este no es necesario
        Object.entries(climasDisponibles).forEach(([_, datos]) => {
            const mapasHTML = `
                <div class="col-lg-3 col-md-4 col-6">
                    <div class="carta mapa-seleccionable" 
                    data-lat="${datos.lat}" 
                         data-lon="${datos.lon}">
                        <img src="assets/${datos.img}" alt="${datos.nombre}" class="img-fluid">
                        <div class="info">
                        <h3>${datos.nombre}</h3>
                            <p>${datos.descripcion}</p>
                        </div>
                    </div>
                    </div>
            `;
            contenedorMapas.insertAdjacentHTML('beforeend', mapasHTML);
        });

        // Asignamos eventos a los botones de mapas (Sin esto la carta no actua como boton)
        document.querySelectorAll('.mapa-seleccionable').forEach(carta => {
            carta.addEventListener('click', seleccionarMapa);
        });


    }

    //Funcion para seleccionar mapa y crear la tabla del clima
    //Funcion para seleccionar el mapa y cargar el clima

    function seleccionarMapa(e) {
        const elemento = e.currentTarget;

        const lat = parseFloat(elemento.dataset.lat);
        const lon = parseFloat(elemento.dataset.lon);

        const nombreClima = elemento.querySelector('h3').textContent;

        console.log("Latitud:", lat);
        console.log("Longitud:", lon);

        Clima.obtenerDatos(lat, lon).then(clima => {
            if (clima) {
                console.log(`Temperatura: ${clima.temperatura}°C`);
                console.log(`Viento: ${clima.viento} m/s`);
                console.log(`Dirección del viento: ${clima.direccionViento}°`);
                mapaSeleccionado=true;
                guardarClima = new Clima(clima.temperatura, clima.viento, clima.direccionViento);
            }

            climaSeleccionado = Object.values(climasDisponibles).find(c => c.nombre === nombreClima);

            const climaHTML = `

            <div><h3 class="titulo">Tabla Climatica </h3></div>
                <div class="container" id="tablaClimatica">
                    <table id="tablaClima">
                        <thead id="encabezado-clima" class="text-center">
                            <tr>
                                <th>Clima</th>
                                <th>Lugar</th>
                                <th>Temp (°C)</th>
                                <th>Viento (m/s)</th>
                                <th>Dirección V (°)</th>
                            </tr>
                        </thead>
                        <tbody class="text-center" id="cuerpo-clima">
                            <tr>
                                <td>${climaSeleccionado.nombre}</td>
                                <td>${climaSeleccionado.descripcion}</td> 
                                <td>${guardarClima.temperatura}</td>      
                                <td>${guardarClima.viento}</td>              
                                <td>${guardarClima.direccionViento}</td>     
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;

            // Seleccionamos todos los contenedores con la clase 'tablaClima'
            const contenedores = document.querySelectorAll('.tablaClima');
            contenedores.forEach(contenedor => {
                contenedor.innerHTML = ''; // Limpia cada contenedor
                contenedor.insertAdjacentHTML('beforeend', climaHTML);
            });
        });
    }

    //funcion para manejar el turno y ataques de la IA

    function manejarTurno() {
        console.log("Tamaño del tablero", size);
        if (turno === 1) {
            const fila = JugadorIA.elegirDisparo(size);
            const columna = JugadorIA.elegirDisparo(size);
            console.log("Return de elegirDisparo", fila, columna);
            atacar(fila, columna, "usuario");
        }
    }
    // Funcion para crear el tablero segun cada jugador

    function generarTableroUser(id, tablero) {
        const tabla = document.getElementById(id);
        tabla.innerHTML = "";

        console.log("tableroEnemigo:", tableroEnemigo);
        console.log("tablero ingresado", tablero);
        console.log("matriz enemigo:", tableroEnemigo.get_matriz?.());

        const size = tablero.length; // Asumimos que el tablero es una matriz cuadrada

        for (let fila = 0; fila <= size; fila++) {
            const tr = document.createElement("tr");

            for (let col = 0; col <= size; col++) {
                const td = document.createElement("td");

                if (col === 0 && fila > 0) {
                    td.textContent = String.fromCharCode(64 + fila);
                    td.classList.add("coordenada");
                } else if (fila === 0 && col > 0) {
                    td.textContent = col;
                    td.classList.add("coordenada");
                } else if (fila > 0 && col > 0) {
                    const f = fila - 1;
                    const c = col - 1;

                    const filaLetra = String.fromCharCode(64 + fila);
                    td.id = `celda-${filaLetra}-${col}`;
                    td.classList.add("celda");
                    td.dataset.fila = f;
                    td.dataset.columna = c;
                    td.dataset.jugador = id === "enemyTablero_pc" ? "enemigo" : "usuario";

                    // pintar segun el contenido de la matriz
                    if (tablero[f][c] === "b" && id === "userTablero_pc") { // Azul = barco - agregar al condicional las variantes para actualizar el tablero despues de cada ataque
                        td.style.backgroundColor = "#0049a6"; // Azul
                    }
                    if (tablero[f][c] === "a-c") { // si hay un barco cerca pinta la casilla de naranja
                        td.style.backgroundColor = "#ff9900"; // Naranja
                    }
                    if (tablero[f][c] === "b-h") { // si hay un barco herido lo pinta de rojo
                        td.style.backgroundColor = "#ff0000"; // Rojo
                    }
                    if (tablero[f][c] === "F") { // si anteriormente falló un disparo, la casilla se pinta de gris
                        td.style.backgroundColor = "#999999"; // Gris
                    }

                    console.log("centinela para if ataque y turno en: ", turno);
                    if (id === "enemyTablero_pc") {
                        td.addEventListener("click", () => {
                            if (turno !== 0) return; // solo permite ataque si es turno del jugador                    
                            const filaAtacada = parseInt(td.dataset.fila);
                            const columnaAtacada = parseInt(td.dataset.columna);
                            const idAtacado = td.dataset.jugador;
                            console.log("tomamos las variables para atacar", filaAtacada, columnaAtacada, idAtacado);
                            atacar(filaAtacada, columnaAtacada, idAtacado);
                        });
                    }
                }
                tr.appendChild(td);
            }
            tabla.appendChild(tr);
        }
    }
    //funcion para cuando el usuario ataca

    function atacar(fila, columna, id) { // fila atacado, columna atacada y id del tablero atacado
        if (id === "enemigo") {
            console.log("Estamos atacando al enemigo");
            let response = tableroEnemigo.verificarImpacto(fila, columna);

            switch (response) {
                case 1:
                    JugadorHumano.AtacoBarco();// afecta al score del jugador y no cambia de turno, ataca otra vez
                    break;
                case 2:
                    JugadorHumano.cercaImpacto();
                    turno = 1; //como fallo el impacto cambia de turno
                    break;
                case -1:
                    turno = 1;
                default:
                    JugadorHumano.FalloImpacto();
                    turno = 1; //como fallo el impacto cambia de turno
                    break;
            }
            actualizar_puntaje();
            console.log(`Atacando en [${fila}, ${columna}, ${id}]`);
            generarTableroUser(seccionTableroEnemigo.id, tableroEnemigo.get_matriz());
            if (tableroEnemigo.verificarGanador(size)) {
                return finalizarJuego(id);
            }
        } else if (id === "usuario") {
            console.log("Estamos atacando al usuario");
            let response = tableroJugador.verificarImpacto(fila, columna);

            switch (response) {
                case 1:
                    JugadorIA.AtacoBarco();// afecta al score del enemigo y no cambia de turno, ataca otra vez
                    break;
                case 2:
                    JugadorIA.cercaImpacto();
                    turno = 0; //como fallo el impacto cambia de turno
                    break;
                case -1:
                    turno = 1;
                default:
                    JugadorIA.FalloImpacto();
                    turno = 0; //como fallo el impacto cambia de turno
                    break;
            }
            console.log(`Atacando en [${fila}, ${columna}, ${id}]`);
            generarTableroUser(seccionTableroJugador.id, tableroJugador.get_matriz());
            if (tableroJugador.verificarGanador(size)) {
                return finalizarJuego(id);
            }
        }
        manejarTurno();
    }

    // funcion para actualizar el puntaje del jugador en la pantalla de juego
    function actualizar_puntaje() {
        const jugadorPuntaje = document.getElementById("Jugador_puntaje");
        jugadorPuntaje.innerHTML = "";
        const h5 = document.createElement("h5");
        console.log("puntaje del jugador", JugadorHumano.getScore());
        h5.classList.add("puntajeText");
        h5.textContent = "Puntaje del jugador: " + JugadorHumano.getScore();
        jugadorPuntaje.appendChild(h5);
    }

    //funcion para guardar los datos del jugador
    function guardarJuego() {
        const banderaJugador = document.getElementById("CodigoBandera_user").textContent;
        JugadorHumano.ActualizarScore(banderaJugador);
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Tu perfil se ha guardado correctamente",
            showConfirmButton: false,
            timer: 1500
        });
        console.log("bandera del usuario, codigo", banderaJugador);
    }

    //funcion para exportar los mapas en tipo csv
    function exportarMapa(event) {
        event.preventDefault(); // Previene el recargado si vino de un <form>
        Swal.fire({ //alerta de que efectivamente se exportaron los mapas
            title: "Mapa Exportado",
            icon: "success",
            draggable: true
        });
        tableroJugador.exportarTablero("Tablero_Jugador", tableroJugador.get_matriz());
        tableroEnemigo.exportarTablero("Tablero_Enemigo(IA)", tableroEnemigo.get_matriz());
    }

    //funcion para finalizar el juego
    function finalizarJuego(perdedor) {
        let titulo = "";
        let icono = "";
        if (perdedor==="enemigo"){
            titulo = "Ganado";
            icono = "success";
        } else{
            titulo = "Perdido";
            icono="error";
        }
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
            title: `Has ${titulo}`,
            text: "¿Deseas Guardar tu perfil?",
            icon: `${icono}`,
            showCancelButton: true,
            confirmButtonText: "Si, Guardalo",
            cancelButtonText: "No, Soy imaginario",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                swalWithBootstrapButtons.fire({
                    title: "Guardado",
                    text: "Tu perfil sera guardado en breve",
                    icon: "success"
                });
                guardarJuego();
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    text: "No existeeess... (cerati referencia)",
                    icon: "error"
                });
            }
        });

    }

    // EVENTO PARA CREAR EL TABLERO
    botonCrear.addEventListener('click', () => crearTablero("inputTableroPc"));

    //evento para click guardaar juego 
    botonGuardarJuego.addEventListener('click', () => guardarJuego());

    //evento para click Exportar mapa
    botonexportarMapa.addEventListener("click", function (e) {
        exportarMapa(e);
    });

    // reconocer cuando el usuario confirma haber escrito su nickname
    botonInicializarJugador.addEventListener("click", () => recogerNickname());

});