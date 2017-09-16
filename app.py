from flask import Flask, render_template
from redis import Redis
from web3 import Web3, IPCProvider

app = Flask(__name__)
redis = Redis(host='redis', port=6379)

@app.route('/')
def index():
    web3 = Web3(IPCProvider())
    #
    # blockNumber = web3.eth.blockNumber
    blockNumber = 1
    count = redis.incr('hits')
    return render_template('index.html', my_string="Wheeeee!", blockNumber=blockNumber, count=count)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)