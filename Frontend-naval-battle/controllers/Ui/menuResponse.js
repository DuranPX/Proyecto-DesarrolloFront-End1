import RankingService from "../API/rankingServices.js";

document.addEventListener("DOMContentLoaded", async ()=> {

    const rankingService = new RankingService();
    await rankingService.datosRanking();  // Cargar los datos

    const elementos = { //si necesitan agregar mas id para cambiar de pagina seguir la misma estructura...
        inicio: {
            pc: {
                volverCredits: document.getElementById("btnVolverCredits"),
                volverRankings: document.getElementById("btnVolverRanking")
            },
        },
        ranking: {
            pc: document.getElementById("textRanking")
        },
        creditos: {
            pc: document.getElementById("textCredit")
        },
        ModoJuego: {
            pc: document.getElementById("btnMenu")
        }
    };

    function irAInicio() {
        console.log("Navegando a Inicio...");
        // Oculta lo que no es menú principal
        document.querySelectorAll("section").forEach(seccion => {
            seccion.style.display = "none";
        });

        // Muestra TODOS los posibles menús principales
        let seccionMostrada = document.getElementById("SectionMenu-Pc");
            if (seccionMostrada) {
                seccionMostrada.style.display = "block";
                console.log(`Sección mostrada: SectionMenu-Pc`);
            } else {
                console.warn(`No se encontró la sección con id: SectionMenu-Pc `);
            }
    }

    function irARanking() {
        console.log("Mostrando Ranking...");
        document.querySelectorAll("section").forEach(seccion => {
            seccion.style.display = "none";
        });

        // Mostrar la sección seleccionada
        let seccionMostrada = document.getElementById("ranking-pc");
            if (seccionMostrada) {
                seccionMostrada.style.display = "block";
                console.log(`Sección mostrada: ranking-pc`);
            } else {
                console.warn(`No se encontró la sección con id: ranking-pc `);
            }
    }

    function verCreditos() {
        console.log("Mostrando Créditos...");
        document.querySelectorAll("section").forEach(seccion => {
            seccion.style.display = "none";
        });

        // Mostrar la sección seleccionada
        let seccionMostrada = document.getElementById("Creditos");
        if (seccionMostrada) {
            seccionMostrada.style.display = "block";
        }
    }

    function verEntornoJuego() {
        // Verificamos que el jugador haya ingresado un nombre
        let NickName = document.getElementById("input-login");
        if (!NickName.value.trim()) {
            alert("¡Ingresa un nickname!");
            return;
        }
        console.log("Mostrando Entorno Juego...");
        document.querySelectorAll("section").forEach(seccion => {
            seccion.style.display = "none";
        });

        // Mostrar la sección seleccionada
        let seccionMostrada = document.getElementById("EntornoJuego-Pc");
        if (seccionMostrada) {
            seccionMostrada.style.display = "block";
        }
    }


    Object.values(elementos.ranking).forEach(el => el?.addEventListener("click", irARanking));
    Object.values(elementos.creditos).forEach(el => el?.addEventListener("click", verCreditos));
    Object.values(elementos.ModoJuego).forEach(el => el?.addEventListener("click", verEntornoJuego));
    
    if (elementos.inicio.pc) {
        Object.values(elementos.inicio.pc).forEach(boton => {
            if (boton) boton.addEventListener("click", irAInicio);
        });
    }
});