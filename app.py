from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get_weather", methods=["POST"])
def get_weather():
    user_input = request.form.get("city")

    api_key = '39f7a6bd731dfc4bb9398a2ff53cfdf2'
    api_url = f"https://api.openweathermap.org/data/2.5/weather?q={user_input}&units=imperial&APPID={api_key}"

    try:
        response = requests.get(api_url)
        data = response.json()

        if data['cod'] == '404':
            result = {'error': 'No City Found'}
        else:
            weather = data['weather'][0]['main']
            temp = round(data['main']['temp'])
            result = {'weather': weather, 'temp': temp}

    except Exception as e:
        result = {'error': str(e)}

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)