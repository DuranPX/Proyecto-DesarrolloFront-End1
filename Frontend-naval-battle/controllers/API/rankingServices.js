export default class RankingService {

    constructor() {
        this.jugadores = [];
    }

    async datosRanking() {
        try {
            const response = await fetch("http://localhost:5000/ranking");
            const data = await response.json(); // data es un array
    
            this.jugadores = data.map(player => ({
                name: player.nick_name,
                score: player.score,
                country: player.country_code
            }));
    
            this.mostrarRanking();
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
        console.log("Jugadores cargados:", this.jugadores);
    }
    
    
    mostrarRanking() {
        const jugadoresOrdenados = this.jugadores.sort((a, b) => b.score - a.score);
        const tablaJugadores = document.getElementById("tablaJugadores-pc");
        if (!tablaJugadores) {
            console.error("No se encontró el elemento de la tabla");
            return;
        }

        tablaJugadores.innerHTML = "";
        jugadoresOrdenados.forEach((player, index) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${index + 1}</td>
                <td>${player.name}</td>
                <td>${player.score}</td>
                <td>
                    <img src="https://flagcdn.com/40x30/${player.country}.png" onerror="this.style.display='none'">
                    ${player.country.toUpperCase()}
                </td>`;
            tablaJugadores.appendChild(fila);
        });
    }
    getJugadores() {
        return this.jugadores;
    }

    async findAPlayer(nombre,jugadores) {
        console.log("Buscando jugador:", nombre);
        console.log("Jugadores disponibles:", this.jugadores);
        console.log("Jugadores paramtro:", jugadores);
    
        const jugadorEncontrado = jugadores.find(player => player.name === nombre);
    
        if (jugadorEncontrado) {
            console.log("Jugador encontrado:", jugadorEncontrado);
            return jugadorEncontrado;
        } else {
            console.log("No se encontró el jugador.");
            return 0;
        }
    }
}
