from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import json
import os
import csv
import io

# las importaciones nuevas son io, csv, os, send_file
app = Flask(__name__)
CORS(app)

DB_FILE = os.path.join(os.path.dirname(__file__),"database", "scores.json")
COUNTRY_FILE = os.path.join(os.path.dirname(__file__), "database", "countries.json")

def load_countries():
    print("Verificando si el archivo existe...")
    
    if os.path.exists(COUNTRY_FILE):
        print(f"El archivo {COUNTRY_FILE} existe.")
        
        with open(COUNTRY_FILE, "r", encoding="utf-8") as file:
            data = file.read()
            
            if not data.strip():  # Si está vacío
                print("El archivo está vacío.")
                return []
            
            try:
                countries = json.loads(data)  # Intentar parsear JSON
                print("Datos cargados correctamente:", countries)
                return countries
            except json.JSONDecodeError as e:
                print("Error al parsear JSON:", e)
                return []
    else:
        print(f"El archivo {COUNTRY_FILE} NO existe.")
    
    return []

def load_scores():
    if os.path.exists(DB_FILE):
        with open(DB_FILE, "r") as file:
            return json.load(file)
    return {}

def save_scores(scores):
    with open(DB_FILE, "w") as file:
        json.dump(scores, file, indent=4)

@app.route("/score-recorder", methods=["POST"])
def score_recorder():
    data = request.json
    if not all(k in data for k in ["nick_name", "score", "country_code"]):
        return jsonify({"error": "Missing required fields"}), 400

    scores = load_scores()
    nick = data["nick_name"]

    if nick in scores:
        scores[nick]["score"] = data["score"]
    else:
        scores[nick] = {"score": data["score"], "country_code": data["country_code"]}

    save_scores(scores)
    return jsonify({"message": "Score recorded successfully"})

@app.route("/ranking", methods=["GET"])
def ranking():
    scores = load_scores()
    ranking_list = sorted(scores.items(), key=lambda x: x[1]["score"], reverse=True)
    return jsonify([{"nick_name": nick, "score": info["score"], "country_code": info["country_code"]} for nick, info in
                    ranking_list])

@app.route("/countries", methods=["GET"])
def get_countries():
    countries = load_countries()
    return jsonify(countries)

@app.route("/exportar_tablero", methods=["GET"]) # /exportar_tablero es el puerto al que tableroService hace fetch
def descargar_tablero(): #funcion con metodo get para descargar el archivo csv que se crea y se returnea con la libreria send_file
    nombre = request.args.get("nombre")# recibe el argumento del nombre del archivo enviado por tableroService
    matriz_json = request.args.get("matriz") # recibe el argumento de la matriz enviado por tableroService
    matriz = json.loads(matriz_json) # vuelve la matriz un json para trabajrlo con csv y python

    output = io.StringIO() # es lo que enviaremos con la peticion get para que no se descargue localmente
    writer = csv.writer(output) # es puro archivo se crea un escrito de archivos csv y se aplica el output
    writer.writerows(matriz) # se escribe la matriz con ayuda del writerows
    output.seek(0) # enfoca el puntero en el primer char, al inicio del archivo

    return send_file( # vamos a enviar con ayuda de send_file un archivo en memoria (io.bytesIO) codificado en UTF-8 
        io.BytesIO(output.getvalue().encode("utf-8")),
        mimetype="text/csv",
        as_attachment=True,
        download_name=f"{nombre}.csv"
    )

if __name__ == "__main__":
    app.run(debug=True)
