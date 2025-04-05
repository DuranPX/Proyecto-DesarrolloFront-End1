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

    verificarSolapamiento(f, c) {
        if (this.matriz[f][c] === "b") {
            return false;
        } else if (this.matriz[f][c] === "a") {
            return true;
        }
        return true;
    }
    
    colocarBarcoLogico(f, c, tamBarco, orientacionBarco) {
        if (orientacionBarco === "vertical") {
            for (let i = 0; i < tamBarco; i++) {
                if (this.verificarSolapamiento(f + i, c) === true) {
                    this.matriz[f + i][c] = "b";
                } else {
                    console.log("Hay solapamiento bobo hijueputa");
                    return  true;
                }
            }
        } else if (orientacionBarco === "horizontal") {
            for (let i = 0; i < tamBarco; i++) {
                if (this.verificarSolapamiento(f, c + i) === true) {
                    this.matriz[f][c + i] = "b";
                } else {
                    console.log("Hay solapamiento bobo hijueputa");
                    return  true;
                }
            }
            return false;
        }
    }

    verificarImpacto(f, c) {
        const casilla = this.matriz[f][c];
        const estadoDisparo = null;

        // Verificar si hay impacto directo
        if (casilla !== 'a') {
            return estadoDisparo = 1; //El número 1 es cuando impacta directamente
        }

        // Revisar casillas a la redonda
        const direcciones = [
            [-1, 0], [1, 0], [0, -1], [0, 1], // arriba, abajo, izquierda, derecha
            [-1, -1], [-1, 1], [1, -1], [1, 1] // diagonales
        ];

        for (let [dx, dy] of direcciones) {
            const nuevaFila = fila + dx;
            const nuevaCol = columna + dy;

            if (
                nuevaFila >= 0 && nuevaFila < this.filas &&
                nuevaCol >= 0 && nuevaCol < this.columnas
            ) {
                if (this.matriz[nuevaFila][nuevaCol] !== 'a') {
                    return estadoDisparo = 2; //El número 2 es cuando impacta en una casilla alrededor
                }
            }
        }
        return estadoDisparo = 0; //El número 0 es cuando no impacta
    }


    exportarTablero(nombre) {
        let tableroExport = new TableroService();
        tableroExport.Exportar_Tablero(nombre , this.tablero);
    }

}
export default Tablero;