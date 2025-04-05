export default class RankingService {

    constructor() {
        this.jugadores = [];
    }

    async datosRanking() {
        try {
            const response = await fetch("http://localhost:5000/ranking");
            console.log("Código de respuesta:", response.status);
            const data = await response.json();

            this.jugadores = Object.keys(data).map(player => ({
                name: data[player].nick_name,
                score: data[player].score,
                country: data[player].country_code
            }));

            this.mostrarRanking();
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
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

    async findAPlayer(nombre) {
        console.log("Buscando jugador:", nombre);
        console.log("Jugadores disponibles:", this.jugadores);
    
        const jugadorEncontrado = this.jugadores.find(player => player.name === nombre);
    
        if (jugadorEncontrado) {
            console.log("Jugador encontrado:", jugadorEncontrado);
            return jugadorEncontrado.score;
        } else {
            console.log("No se encontró el jugador.");
            return null;
        }
    }
}
