document.addEventListener("DOMContentLoaded", function () {
    let botonCrear = document.getElementById("btnCrearPc");

    function crearTablero() {
        let size = parseInt(document.getElementById("inputTableroPc").value);
        if (isNaN(size) || size < 5 || size > 15) {
            alert("Ingresa un tamaño válido (entre 5 y 15)");
            return;
        }

        generarTablero("TablaUsuario", size);
        crearIniciarJuegobtn("btnEntornoJugar");
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
                    td.onclick = () => marcarCelda(td);
                }
        
                tr.appendChild(td);
            }
            tabla.appendChild(tr);
        }
        
    }

    function crearIniciarJuegobtn(claseboton) {
        let ContenedorTablero = document.getElementById("contenedortablero-pc");
        let botonValidar = document.createElement('button');

        botonValidar.textContent = "Ir a la batalla!";
        botonValidar.id = "btnBatalla"
        botonValidar.classList.add("btn", "btn-danger",claseboton);
        ContenedorTablero.appendChild(botonValidar);

        botonValidar.addEventListener("click", function () {
            //aqui iria la ejecucion de la funcion menu response para mostra el juego 
        })
    }


    botonCrear.addEventListener("click", function () {
        crearTablero();
        
    });

});