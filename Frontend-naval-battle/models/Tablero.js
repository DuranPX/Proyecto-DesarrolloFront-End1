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

    verificarImpacto(f, c) {
        const casilla = this.matriz[f][c];

        if (casilla === a) {
            FalloImpacto();
            return a;
        } else if (casilla === b) {
            AtacoBarco();
            return p;
        } else if (casilla === a-b) {
            cercaImpacto();
            return c; 
        }
    }

    colocarBarcoLogico() {
        
    }
        exportarTablero() {
        fetch("http://localhost:5000/exportar_tablero")
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "tablero.csv";
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(error => console.error("Error al descargar el tablero:", error));
    }
    
}
export default Tablero;