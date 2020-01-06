from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo

app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/island_base"
mongo = PyMongo(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/data_one")
def data_grab():
    islands = mongo.db.island_base.find_one()
    islands.pop("_id")
    return jsonify(islands)

@app.route("/data_two")
def data_grab_2():
    countries = mongo.db.island_base.find()
    countries = countries[1]
    countries.pop("_id")
    return jsonify(countries)

@app.route("/about_us")
def about():
    return render_template("contact_information.html")

@app.route("/data_table")
def data_table():
    return render_template("data_table.html")

if __name__ == "__main__":
    app.run(debug=True)