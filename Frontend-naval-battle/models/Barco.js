export class Barco {
    constructor(nombre, tamaño, posicion) {
        this.nombre = nombre;
        this.tamaño = tamaño;
        this.posicion = "horizontal";
    }

    estaHundido() {
        
    }

    cambiarDireccion(){
        this.posicion = this.posicion === "horizontal" ? "vertical" : "horizontal";
        console.log(`${this.nombre} ahora está en orientación: ${this.posicion}`);
    }

    colocar(fila, columna, direccion) {
        this.posicion = [];

        for (let i = 0; i < this.tamaño; i++) {
            if (direccion === "horizontal") {
                this.posicion.push({ fila, columna: columna + i });
            } else {
                this.posicion.push({ fila: fila + i, columna });
            }
        }
    }
}
export default Barco;
