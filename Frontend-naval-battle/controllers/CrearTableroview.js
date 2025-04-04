import Tablero from "../models/Tablero.js";
import { Acorazado, Destructor, PortaAviones, Submarino } from "../models/barcosCondensador.js";

document.addEventListener("DOMContentLoaded", function () {
    let botonCrear = document.getElementById("btnCrearPc");

    //Variables del estado de juego
    let size = parseInt(document.getElementById("inputTableroPc").value) || 10;
    let tableroJugador = new Tablero(size, size);
    let tableroEnemigo = new Tablero(size, size);

    // let PortaAvion = new PortaAviones();
    // let acorazado = new Acorazado();
    // let submarinos = [new Submarino(), new Submarino()];
    // let destructores = [new Destructor(), new Destructor()];
    
    let esHorizontal = false;
    let barcosSeleccionado = null;

    // Objetos que controla los baratos disponibles
    let barcosDisponibles = {
        PortaAviones:{cantidad:1,clase:PortaAviones,img: "../views/assets/PortaAviones.png" },
        Acorazado:{cantidad:1,clase:Acorazado,img: "../views/assets/Acorazado.jpg" },
        Submarino:{cantidad:2,clase:Submarino,img: "../views/assets/Submarino.jpg"},
        Destructor:{cantidad:2,clase: Destructor,img: "../views/assets/Destructor.jpg"}
    };

    function crearTablero() {
        const newSize = parseInt(document.getElementById("inputTableroPc").value) || 10;
        if (isNaN(newSize) || newSize < 10 || newSize > 20) {
            alert("Ingresa un tamaño válido (entre 10 y 20)");
            return;
        }

        tableroJugador = new Tablero(newSize, newSize);
        tableroEnemigo = new Tablero(newSize, newSize);
        generarTablero("TablaUsuario", size);
        crearIniciarJuegobtn("btnEntornoJugar");
        console.log("tablero del jugador creado", tableroJugador);
        console.log("tablero del bot creado", tableroEnemigo);
    }

    function generarTablero(id, size) {
        let tabla = document.getElementById(id);
        tabla.innerHTML = ""; // Limpiar si ya hay un tablero

        for (let fila = 0; fila <= size; fila++) {
            let tr = document.createElement("tr");

            for (let col = 0; col <= size; col++) {
                let td = document.createElement("td");

                // Letras en la primera columna (A, B, C...)
                if (col === 0 && fila > 0) {
                    td.textContent = String.fromCharCode(64 + fila); // A, B, C...
                    td.classList.add("coordenada");
                }
                // Números en la primera fila (1, 2, 3...)
                else if (fila === 0 && col > 0) {
                    td.textContent = col;
                    td.classList.add("coordenada");
                }
                // Espacio vacío para las celdas del juego
                else if (fila > 0 && col > 0) {
                    let filaLetra = String.fromCharCode(64 + fila); // Convierte número en letra
                    td.id = `celda-${filaLetra}-${col}`; // Ejemplo: celda-A-1, celda-B-2
                    td.classList.add("celda");

                    // Guardar posicion en matriz (Fila y Columna)
                    td.dataset.fila = fila - 1; 
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

    function crearBotonesdeBarcos(){
        const contenedorBarcos = document.getElementById("contenedor-barcos");
        contenedorBarcos.innerHTML='';
        Object.entries(barcosDisponibles).forEach(([nombre, datos]) => {
           
            const disponibles = datos.cantidad - datos.colocados;
            if(disponibles <= 0) return;

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
            contenedorBarcos.insertAdjacentHTML('beforeend', barcoHTML)
        });

        //Agregar event listeners depués de crear los elementos
        document.querySelectorAll('.barco-seleccionable').forEach(carta => {
            carta.addEventListener('click', seleccionarBarco);
        });
    }
    

    function crearIniciarJuegobtn(claseboton) {
        let ContenedorTablero = document.getElementById("contenedortablero-pc");
        let botonValidar = document.createElement('button');

        botonValidar.textContent = "Ir a la batalla!";
        botonValidar.id = "btnBatalla"
        botonValidar.classList.add("btn", "btn-danger", claseboton);
        ContenedorTablero.appendChild(botonValidar);

        botonValidar.addEventListener("click", function () {
            //aqui iria la ejecucion de la funcion menu response para mostra el juego 
        })
    }

    function UbicarBarco(tamañoBarco, fila, columna) {
        for (let index = 0; index < array.length; index++) {
            const element = array[index];

        }
    }
    //alerta de suficientes barcos de tal tipo colocados 
    botonCrear.addEventListener("click", function () {
        crearTablero();
    });
});

// Rotar barco con tecla "R"
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'r') {
        esHorizontal = !esHorizontal; // Alternar entre true/false
        console.log(`Modo: ${esHorizontal ? 'Horizontal' : 'Vertical'}`);
    }
});