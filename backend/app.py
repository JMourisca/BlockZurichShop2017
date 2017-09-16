# Some imports.
from flask import Flask, render_template, jsonify
from web3 import Web3, IPCProvider

# Call the app.
app = Flask(__name__)


@app.route('/')
def index():
    web3 = Web3(IPCProvider())
    return render_template("index.html")


@app.route('/postexample', methods=['POST'])
def post_method():
    return jsonify(
        username="HackZurich",
        email="superapp@gmail.com",
        id=123
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
