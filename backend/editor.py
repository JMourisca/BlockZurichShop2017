from flask import Blueprint, Response, json, jsonify, request
from redis import Redis
import re

redis = Redis(host='redis', port=6379)

mod = Blueprint('editor', __name__)
# Generate index.html.

@mod.route('/post/<id>')
def post(id):
    post = redis.get(id)
    urls = re.findall('<a href="?\'?([^"\'>]*)', str(post))

    result = {"post": str(post), "urls": urls}

    return Response(json.dumps(result), mimetype='application/json')

@mod.route('/testpost', methods=["POST"])
def test():
    content = json.loads(request.data)

    return jsonify(content)

@mod.route('/save', methods=["POST"])
def index():
    text = """<p>
                    While you are reading this, I am already on my way to the airport to reach my first aim: the
                    Oktoberfest in Munich, having started yesterday! Fantastic!! There was no other option than
                    getting the sexiest Dirndl costume ever; )
                    <a href="https://siroop.ch/mode-accessoires/damenmode/trachtenmode-dirndl/oktoberfest-dirndl-shirt-fotorealistisch-01046629">Link</a>
                </p>

                <p>
                    And because I was in shopping mood I also ordered an amazing costume for the upcoming Halloween Party in Zurich:
                    <a href="http://www.karneval-megastore.de/blutige-zombie-krankenschwester-halloween-plus-size-damenkostuem-rot-weiss.html">Link</a>
                </p>

                <p>
                    And guess what, when I showed both my dresses to my boyfriend, he actually went crazy and bought
                    this amazing wine to surprise me:
                    <a href="https://siroop.ch/lebensmittel-getraenke/wein/rotwein/ch-mouton-rothschild-2010-chateau-mouton-rothschild-75-cl-0499738">Link</a.
                </p>
                <p>
                    Nothing to add girls - enjoy life!; )
                </p>
    """
    redis.set("2", text)
    return "saved"