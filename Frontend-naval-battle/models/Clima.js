class Clima {
    constructor(temperatura, viento, direccionViento) {
        this.temperatura = temperatura;
        this.viento = viento;
        this.direccionViento = direccionViento;
    }

    // Getter y Setter para temperatura
    get temperatura() {
        return this._temperatura;
    }

    set temperatura(valor) {
        this._temperatura = valor;
    }

    // Getter y Setter para viento
    get viento() {
        return this._viento;
    }

    set viento(valor) {
        this._viento = valor;
    }

    // Getter y Setter para dirección del viento
    get direccionViento() {
        return this._direccionViento;
    }

    set direccionViento(valor) {
        this._direccionViento = valor;
    }

    static async obtenerDatos(lat, lon) {
        const API_KEY = ""; // no Permutar!!!!!!!!!!!!!!!
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            
            const temperatura = data.main.temp; // Temperatura en °C
            const viento = data.wind.speed; // Velocidad del viento en m/s
            const direccionViento = data.wind.deg; // Dirección del viento en grados

            return new Clima(temperatura, viento, direccionViento);
        } catch (error) {
            console.error("Error obteniendo datos del clima:", error);
            return null;
        }
    }

    

}

// Centinela: Obtener clima en el Océano Atlántico (aprox. lat 0, lon -30)


export default Clima;
