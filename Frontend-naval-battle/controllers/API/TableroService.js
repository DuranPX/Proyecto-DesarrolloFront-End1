export default class TableroService {
    Exportar_Tablero(tipo,matriz){
        const matrizString = encodeURIComponent(JSON.stringify(matriz));
        fetch(`http://localhost:5000/exportar_tablero?nombre=${tipo}&matriz=${matrizString}`)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "tablero.csv";
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(error => console.error("Error al descargar el tablero:", error));
    }
}