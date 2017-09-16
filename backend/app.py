# Main app file.

# Flask imports.
from flask import Flask
from flask import render_template
from flask import request, jsonify

# Flask cors imports.
from flask_cors import CORS

# Json imports.
import json
import logging
from logging.handlers import RotatingFileHandler

# Web3 imports.
from web3 import Web3
from web3 import HTTPProvider


# Call the app.
app = Flask(__name__)
CORS(app)


# Store purchase data in json format.
def get_purchase_data():
    purchase_data = {"purchase_id":   request.form["purchase_id"],
                     "purchase_name": request.form["purchase_name"]}
    return json.dumps(purchase_data)


# Store confirmed purchase as json.
def get_confirmed_purchase():
    confirmed_purchase = {"confirmed_purchase": request.form["confirmed_purchase"]}
    return json.dumps(confirmed_purchase)


# Can be implemented later.
def process_data(purchase_data):
    success = True
    return [success, purchase_data]


# Interface to uport.
def call_uport(data):
    return data


# Interface to web3.
def call_web3(confirmed_purchase):
    web3 = Web3(HTTPProvider("https://mainnet.infura.io/cPqmhj9ZK2EWjKRq3FUG"))
    #
    block_number = web3.eth.blockNumber
    #
    account = "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe"
    balance = web3.eth.getBalance(account)
    #
    app.logger.info("call_web3")
    app.logger.info("block_number: %s", block_number)
    app.logger.info("balance: %s Ether", balance)
    app.logger.info("data: %s",  confirmed_purchase[0])

    #
    return [True, confirmed_purchase, block_number, balance]


# To be implemented after the front end is finished.
# Probably we will simply return json here and then handle it by angular.

def no_purchase_possible():
    return "No purchase possible!"


def set_popup_data_in_html(data):
    return data


# Generate index.html.
@app.route('/')
def index():
    return render_template("stub.html")


# Request new purchase.
@app.route("/new_purchase", methods=["POST"])
# @cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
def new_purchase():

    # Get new purchase data as json.
    purchase_data = get_purchase_data()

    # Process data such as check if there is enough in the stock.
    proceed, processed_data = process_data(purchase_data)

    # Call uport if possible.
    if proceed:
        success_popup_data = call_uport(processed_data)
    else:
        # Here we actually need to generate a proper popup. Depends
        # on what it will be: angular, ajax, etc.
        return no_purchase_possible()


    # Set processed data with the result from uport into html popup.
    # Again, depends on if it is angular, ajax, etc.
    return set_popup_data_in_html(success_popup_data)



# Confirm final purchase.
@app.route("/confirm_purchase", methods=["POST"])
def confirm_purchase():

    jsdata = request.data

    # # Call web3 api.
    app.logger.info("confirm_purchase")
    success, confirmed_purchase, block_number, balance = call_web3(jsdata)
    app.logger.info(success)
    #
    # # Here we again generate the proper popup with angular or whatever.
    if success:
        return jsonify({'msg': 'success', 'block_number': block_number, 'balance': balance})
    else:
        return jsonify("{'msg': 'error'}")


if __name__ == "__main__":
    handler = RotatingFileHandler('/tmp/dev.log', maxBytes=10000, backupCount=1)
    handler.setLevel(logging.INFO)
    app.logger.addHandler(handler)
    app.run(host="0.0.0.0", debug=True)
