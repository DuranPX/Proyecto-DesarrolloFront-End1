import TableroService from "../controllers/API/TableroService.js";

class Tablero {
    constructor(filas, columnas) {
        
        this.filas = filas;
        this.columnas = columnas;
        this.matriz = this.inicializarMatriz();
    }

    inicializarMatriz() {
        // Se genera una matriz vacía con "a" de agua por defecto
        let matriz = Array.from({ length: this.filas }, () =>
            Array.from({ length: this.columnas }, () => "a")
        );
        return matriz;
    }

    get_matriz() {
        return this.matriz;
    }

    verificarSolapamiento(f, c, tamBarco, orientacionBarco) {
        let solapamiento = true;
        for (let i = 0; i < tamBarco; i++) {
            if (orientacionBarco === "vertical") {
                if (this.matriz[f + i][c] === "b") {
                    return false;
                } else if (this.matriz[f + i][c] === "a") {
                    solapamiento = true;
                }
            } else if (orientacionBarco === "horizontal") {
                if (this.matriz[f][c + i] === "b") {
                    return false;
                } else if (this.matriz[f][c + i] === "a") {
                    solapamiento = true;
                }
            }
        }
        return solapamiento;
    }
    
    colocarBarcoLogico(f, c, tamBarco, orientacionBarco) {
        if (orientacionBarco === "vertical") {
            if (this.verificarSolapamiento(f, c, tamBarco, orientacionBarco) === true) {
                for (let i = 0; i < tamBarco; i++) {
                    this.matriz[f + i][c] = "b";
                }
            } else {
                console.log("Hay solapamiento bobo hijueputa");
                return  true;
            }
        } else if (orientacionBarco === "horizontal") {
            if (this.verificarSolapamiento(f, c, tamBarco, orientacionBarco) === true) {
                for (let i = 0; i < tamBarco; i++) {
                    this.matriz[f][c + i] = "b";
                }
            } else {
                console.log("Hay solapamiento bobo hijueputa");
                return  true;
            }
        }
        return false;
    }

    verificarImpacto(f, c) {
        const casilla = this.matriz[f][c];
        let estadoDisparo = null;

        // Verificar si hay impacto directo
        if (casilla !== 'a' && casilla !== 'F' && casilla !== 'b-h') {
            this.matriz[f][c] = "b-h";
            return estadoDisparo = 1; //El número 1 es cuando impacta directamente
        }

        // Revisar casillas a la redonda
        const direcciones = [
            [-1, 0], [1, 0], [0, -1], [0, 1], // arriba, abajo, izquierda, derecha
            [-1, -1], [-1, 1], [1, -1], [1, 1] // diagonales
        ];

        for (let [dx, dy] of direcciones) {
            const nuevaFila = f + dx;
            const nuevaCol = c + dy;

            if (
                nuevaFila >= 0 && nuevaFila < this.filas &&
                nuevaCol >= 0 && nuevaCol < this.columnas
            ) {
                if (this.matriz[nuevaFila][nuevaCol] !== 'a') {
                    this.matriz[f][c] = "a-c";
                    return estadoDisparo = 2; //El número 2 es cuando impacta en una casilla alrededor
                }
            }
        }
        this.matriz[f][c] = "F";
        return estadoDisparo = 0; //El número 0 es cuando no impacta
    }


    exportarTablero(nombre,tablero) {
        let tableroExport = new TableroService();
        tableroExport.Exportar_Tablero(nombre , tablero);
    }

}
export default Tablero;