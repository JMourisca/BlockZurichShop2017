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

import sys

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
    web3 = Web3(HTTPProvider("https://rinkeby.infura.io/cPqmhj9ZK2EWjKRq3FUG"))
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

    # try :
    abi = [{"constant":False,"inputs":[{"name":"_merchant","type":"address"},{"name":"_category","type":"bool"},{"name":"_maxOrder","type":"uint256"},{"name":"_amountStock","type":"uint256"}],"name":"addProduct","outputs":[],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":False,"inputs":[{"name":"_orderID","type":"uint256"}],"name":"returnArrived","outputs":[],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":True,"inputs":[],"name":"austrianPost","outputs":[{"name":"","type":"address"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":True,"inputs":[{"name":"","type":"address"}],"name":"blogOwners","outputs":[{"name":"","type":"bool"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":True,"inputs":[{"name":"","type":"uint256"}],"name":"electronicProducts","outputs":[{"name":"","type":"bool"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"_productID","type":"uint256"},{"name":"_merchant","type":"address"},{"name":"_blogOwner","type":"address"},{"name":"isSiroop","type":"bool"},{"name":"_amount","type":"uint256"}],"name":"doPurchase","outputs":[{"name":"result","type":"bool"}],"payable":True,"stateMutability":"payable","type":"function"},{"constant":True,"inputs":[],"name":"siroop","outputs":[{"name":"","type":"address"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":True,"inputs":[{"name":"","type":"uint256"}],"name":"productStock","outputs":[{"name":"","type":"uint256"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":True,"inputs":[{"name":"","type":"uint256"}],"name":"productMaxOrders","outputs":[{"name":"","type":"uint256"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":True,"inputs":[{"name":"","type":"uint256"}],"name":"products","outputs":[{"name":"","type":"address"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":True,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"_orderID","type":"uint256"}],"name":"productDelivered","outputs":[],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":False,"inputs":[{"name":"_merchant","type":"address"}],"name":"addMerchant","outputs":[],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":False,"inputs":[{"name":"_siroop","type":"address"}],"name":"changeSiroop","outputs":[],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":False,"inputs":[{"name":"_blogOwner","type":"address"}],"name":"addBlogOwner","outputs":[],"payable":False,"stateMutability":"nonpayable","type":"function"},{"constant":True,"inputs":[{"name":"","type":"address"}],"name":"merchants","outputs":[{"name":"","type":"bool"}],"payable":False,"stateMutability":"view","type":"function"},{"constant":False,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":False,"stateMutability":"nonpayable","type":"function"},{"payable":True,"stateMutability":"payable","type":"fallback"},{"anonymous":False,"inputs":[{"indexed":True,"name":"previousOwner","type":"address"},{"indexed":True,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}]
#     abi = [{
#      name: 'myConstantMethod',
#      type: 'function',
#      constant: True,
#      inputs: [{ name: 'a', type: 'string' }],
#      outputs: [{name: 'd', type: 'string' }]
# }, {
#      name: 'myStateChangingMethod',
#      type: 'function',
#      constant: False,
#      inputs: [{ name: 'a', type: 'string' }, { name: 'b', type: 'int' }],
#      outputs: []
# }, {
#      name: 'myEvent',
#      type: 'event',
#      inputs: [{name: 'a', type: 'int', indexed: True},{name: 'b', type: 'bool', indexed: False}]
# }]
    product_id = 0
    merchant = "0x9838ECaa5D49a01e1B6e13bA07bDc87a6AEBab92"
    blog_owner = "0x2a86D62A7e5860a275A2ace8bfe3141dC7EE907D"
    is_siroop = False
    amount = 1

    app.logger.info("it will try web4.eth.contract")

    contract = web3.eth.contract(abi)
    contract.address = '0x76E9AbeF06dfCD3b862234CcfC5030Fd8Ba231d7'

    #myContractInstance = MyContract.at('0xc4abd0339eb8d57087278718986382264244252f');

    send_from = "0x39092e309f00B8B9702653865f7B26005EC61982"

    app.logger.info("it will try doPurchase")
    try:
        success = contract.doPurchase(product_id, merchant, blog_owner, is_siroop, amount)
    except Exception as ex:
        template = "An exception of type {0} occurred. Arguments:\n{1!r}"
        message = template.format(type(ex).__name__, ex.args)
        app.logger.error(message)

    # pending = web3.eth.pendingTransactions
    # app.logger.info("pending: %s ", pending[0])
    # app.logger.info("res: %s", success)

    #
    # except:
    #     app.logger.info(sys.exc_info()[0])

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
