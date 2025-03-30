document.addEventListener("DOMContentLoaded", function () {
    const elementos = { //si necesitan agregar mas id para cambiar de pagina seguir la misma estructura...
        inicio: {
            pc: document.getElementById("textInicio"),
            tablet: {
                volverCredits: document.getElementById("volverCredits_tablet"),
                volverRankings: document.getElementById("volverRankings_tablet")
            },
            movil: document.getElementById("")
        },
        ranking: {
            pc: document.getElementById("textRanking"),
            tablet: document.getElementById("textRankings_tablet"),
            movil: document.getElementById("")
        },
        creditos: {
            pc: document.getElementById("textCredit"),
            tablet: document.getElementById("textCredits_tablet"),
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
        // Oculta lo que no es menú principal
        document.querySelectorAll("section").forEach(seccion => {
            seccion.style.display = "none";
        });
    
        // Muestra TODOS los posibles menús principales
        document.getElementById("SectionMenu-Pc").style.display = "block";
        document.querySelector(".Section-menuTablet").style.display = "block";
    }
    
    function irARanking() {
        console.log("Mostrando Ranking...");
        document.querySelectorAll("section").forEach(seccion => {
            seccion.style.display = "none";
        });

        // Mostrar la sección seleccionada
        let seccionMostrada_Tablet = document.getElementById("Section-rankingsTablet");
        if (seccionMostrada_Tablet) {
            seccionMostrada_Tablet.style.display = "block";
        }
    }
    
    function verCreditos() {
        console.log("Mostrando Créditos...");
        document.querySelectorAll("section").forEach(seccion => {
            seccion.style.display = "none";
        });

        // Mostrar la sección seleccionada
        let seccionMostrada = document.getElementById("Section-creditsTablet");
        if (seccionMostrada) {
            seccionMostrada.style.display = "block";
        }
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

    Object.values(elementos.ranking).forEach(el => el?.addEventListener("click", irARanking));
    Object.values(elementos.creditos).forEach(el => el?.addEventListener("click", verCreditos));
    Object.values(elementos.JuegoBtn).forEach(el => el?.addEventListener("click", verEntornoJuego));

    if (elementos.inicio.tablet) {
        Object.values(elementos.inicio.tablet).forEach(boton => {
            if (boton) boton.addEventListener("click", irAInicio);
        });
    }
});
