document.addEventListener("DOMContentLoaded", async () => {

    fetch("http://localhost:5000/ranking")
    .then(response => {
        console.log("Código de respuesta:", response.status);
        return response.json();
    })
    .then(data => {
        console.log("Datos obtenidos:", data);  // Muestra la respuesta de la API

        const jugadores = Object.keys(data).map(player => ({
            name: data[player].nick_name,
            score: data[player].score,
            country: data[player].country_code
        }));

        console.log("Jugadores procesados:", jugadores);

        function ordenarPorScore(jugadores) {
            return jugadores.sort((a, b) => b.score - a.score);
        }

        const jugadoresOrdenados = ordenarPorScore(jugadores);

        console.log("Jugadores ordenados:", jugadoresOrdenados);

        const tablaJugadores = document.getElementById("tablaJugadores-pc");
        if (!tablaJugadores) {
            console.error("Error: No se encontró el elemento 'tablaJugadores-pc'");
            return;
        }

        tablaJugadores.innerHTML = ""; // Limpiar la tabla antes de insertar datos

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
    })
    .catch(error => console.error("Error al obtener datos:", error));

});