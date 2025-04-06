import RankingService from "../controllers/API/rankingServices.js";

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
        const ScoreRecuperado = await ranking.findAPlayer(nickname);// si encuentra coincidencias con otro jugador del mismo nombre actualiza el score
        return new Jugador(nickname, ScoreRecuperado, maquina);
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

}
export default Jugador;