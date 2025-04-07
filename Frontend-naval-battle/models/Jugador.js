import RankingService from "../controllers/API/rankingServices.js";

class Jugador {

    constructor(nickname, score, maquina) {
        let ranking = new RankingService();
        this.nickname = ranking.findAPlayer(nickname);
        this.score = score;
        this.maquina = maquina;
    }

    ActualizarScore() {
        fetch("http://localhost:5000/score-recorder", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nick_name: this.nickname,
                score: this.score,
                country_code: "us"
            })
        })
        .then(response => response.json())  
        .then(data => console.log("Respuesta del servidor:", data))  
        .catch(error => console.error("Error en la petición:", error));
    }

    AtacoBarco() {
        this.score+=10;
    }

    FalloImpacto() {
        this.score-=1;
    }

    cercaImpacto() {
        this.score-=3;
    }

    elegirDisparo(size) {
        let ultimoImpacto = null;  // Guarda la última posición donde hubo un impacto
        let direcciones = [        // Direcciones posibles: arriba, abajo, izquierda, derecha
            [-1, 0], [1, 0], [0, -1], [0, 1]  
        ];
        let intentosAdyacentes = [];  // Guarda las casillas adyacentes ya probadas

        // Si hay un último impacto y no se han probado todas las adyacentes
        if (ultimoImpacto && intentosAdyacentes.length < 4) {
            // Prueba una dirección aleatoria no explorada
            let dirIndex;
            let dir;
            do {
                dirIndex = Math.floor(Math.random() * 4);
                dir = direcciones[dirIndex];
            } while (intentosAdyacentes.includes(dirIndex));
    
            let nuevaFila = ultimoImpacto[0] + dir[0];
            let nuevaColumna = ultimoImpacto[1] + dir[1];
    
            // Si la casilla es válida, dispara ahí
            if (
                nuevaFila >= 0 && nuevaFila < size &&
                nuevaColumna >= 0 && nuevaColumna < size &&
                verificarImpacto(nuevaFila, nuevaColumna) !== 1
            ) {
                intentosAdyacentes.push(dirIndex);  // Registra que ya probó esta dirección
                return [nuevaFila, nuevaColumna];
            } else {
                intentosAdyacentes.push(dirIndex);  // Aunque no sea válida, la marca como probada
                return elegirDisparo(size);  // Intenta de nuevo recursivamente
            }
        }
    
        // Si no hay último impacto o ya probó todas las adyacentes, dispara al azar
        ultimoImpacto = null;
        intentosAdyacentes = [];
    
        let fila, columna;
        do {
            fila = Math.floor(Math.random() * size);
            columna = Math.floor(Math.random() * size);
        } while (verificarImpacto(fila, columna) === 1);
    
        return [fila, columna];
    }

    // Función para actualizar el estado después de un disparo
    actualizarUltimoImpacto(fila, columna, impacto) {
        if (impacto) {
            ultimoImpacto = [fila, columna];  // Guarda el último impacto
            intentosAdyacentes = [];          // Reinicia los intentos adyacentes
        } else if (ultimoImpacto) {
            // Si falló al disparar alrededor, no hace nada (sigue buscando en próximos turnos)
        }
    }
}
export default Jugador;