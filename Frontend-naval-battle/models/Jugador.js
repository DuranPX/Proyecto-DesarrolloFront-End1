import RankingService from "../controllers/API/rankingServices.js";
import Tablero from "../models/Tablero.js";

class Jugador {

    constructor(nickname, score, maquina) {
        this.nickname = nickname;
        this.score = score;
        this.maquina = maquina;
    }

    ActualizarScore(banderaJugador) {
        console.log("Nickname:", this.nickname);
        console.log("score:", this.score);
        console.log("codigo bandera:", banderaJugador);

        fetch("http://localhost:5000/score-recorder", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nick_name: this.nickname,
                score: this.score,
                country_code: banderaJugador
            })
        })
            .then(response => response.json())
            .then(data => console.log("Respuesta del servidor:", data))
            .catch(error => console.error("Error en la petición:", error));
    }

    static async crearJugador(nickname, maquina) {
        const ranking = new RankingService();
        await ranking.datosRanking(); // solo carga
        const jugadorData = await ranking.findAPlayer(nickname, ranking.getJugadores());
        const jugadorEncontrado = jugadorData.score;
        const ScoreRecuperado = jugadorEncontrado ? jugadorEncontrado.score : 0;

        const jugador = {
            nickname,
            ScoreRecuperado,
            maquina
        };

        console.log("Jugador creado:", jugador);
        return new Jugador(nickname, ScoreRecuperado, maquina);;
    }


    AtacoBarco() {
        this.score += 10;
    }

    FalloImpacto() {
        this.score -= 1;
    }

    cercaImpacto() {
        this.score -= 3;
    }

    elegirDisparo(size) {
        // Genera números enteros entre 0 y size-1
        let celda = 0;
        celda = Math.floor(Math.random() * size); // Columna aleatoria
        console.log("Dentro de elegirDisparo:", celda); // Verifica aquí
        return celda; // Retorna un objeto con claves numéricas
    }

    getScore() {
        return this.score;
    }
}
export default Jugador;