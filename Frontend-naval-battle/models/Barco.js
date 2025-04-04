export class Barco {
    constructor(nombre, tamaño) {
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

}
export default Barco;
