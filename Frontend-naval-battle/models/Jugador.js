class Jugador {
    constructor(nickname, score, maquina) {
        this.nickname = nickname;
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
                nick_name: "Jugador1",
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
}
export default Jugador;