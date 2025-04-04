import TableroService from "../controllers/API/TableroService";

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

    verificarImpacto() {
    }

    colocarBarcoLogico() {

    }


    exportarTablero(nombre) {
        TableroService.Exportar_Tablero(nombre,this.matriz);
    }

}
export default Tablero;