class Clima {
    constructor(temperatura, viento, direccionViento) {
        this.temperatura = temperatura;
        this.viento = viento;
        this.direccionViento = direccionViento;
    }

    static async obtenerDatos(lat, lon) {
        const API_KEY = "bd7a25e175596ad61c1f838c8c8c7ea6"; // no Permutar!!!!!!!!!!!!!!!
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
Clima.obtenerDatos(0, -30).then(clima => {
    if (clima) {
        console.log(`Temperatura: ${clima.temperatura}°C`);
        console.log(`Viento: ${clima.viento} m/s`);
        console.log(`Dirección del viento: ${clima.direccionViento}°`);
    }
});
