document.addEventListener("DOMContentLoaded", function () {
    const elementos = { //si necesitan agregar mas id para cambiar de pagina seguir la misma estructura...
        inicio: {
            pc: document.getElementById("textInicio"),
            tablet: document.getElementById(""),
            movil: document.getElementById("")
        },
        ranking: {
            pc: document.getElementById("textRanking"),
            tablet: document.getElementById(""),
            movil: document.getElementById("")
        },
        creditos: {
            pc: document.getElementById("textCredit"),
            tablet: document.getElementById(""),
            movil: document.getElementById("")
        },
        JuegoBtn: {
            pc: document.getElementById("btnMenu"),
            tablet: document.getElementById(""),
            movil: document.getElementById("")
        }
    };

    function irAInicio() {
        console.log("Navegando a Inicio...");
        document.querySelectorAll("section").forEach(seccion => {
            seccion.style.display = "none";
        });
    
        // Mostrar la sección seleccionada
        let seccionMostrada = document.getElementById("SectionMenu-Pc");
        if (seccionMostrada) {
            seccionMostrada.style.display = "block";
        }
    }

    function irARanking() {
        console.log("Mostrando Ranking...");
    }

    function verCreditos() {
        console.log("Mostrando Créditos...");
    }

    function verEntornoJuego() {
        console.log("Mostrando Entorno Juego...");
        document.querySelectorAll("section").forEach(seccion => {
            seccion.style.display = "none";
        });
    
        // Mostrar la sección seleccionada
        let seccionMostrada = document.getElementById("EntornoJuego-Pc");
        if (seccionMostrada) {
            seccionMostrada.style.display = "flex";
        }
    }

    Object.values(elementos.inicio).forEach(el => el?.addEventListener("click", irAInicio));
    Object.values(elementos.ranking).forEach(el => el?.addEventListener("click", irARanking));
    Object.values(elementos.creditos).forEach(el => el?.addEventListener("click", verCreditos));
    Object.values(elementos.JuegoBtn).forEach(el => el?.addEventListener("click", verEntornoJuego));

});
