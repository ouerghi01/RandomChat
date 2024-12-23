from logic.analyze_sentiment import analyze_sentiment
from flask_cors import CORS, cross_origin
from flask import Flask
from flask import jsonify
app = Flask(__name__)
CORS(app)
cross_origin( 
origins = '*', 
methods = ['GET', 'HEAD', 'POST', 'OPTIONS', 'PUT'], 
headers = None, 
supports_credentials = False, 
max_age = None, 
send_wildcard = True, 
always_send = True, 
automatic_options = False
)
# Flask route to analyze sentiment
@app.route('/analyze_sentiment/<string:text>', methods=['GET'])
def analyze_sentiment_endpoint(text):
    try:
        sentiment_label, sentiment_score = analyze_sentiment(text)
        print(f"Sentiment: {sentiment_label}, Score: {sentiment_score}")
        return jsonify({
            "sentiment_label": sentiment_label,
            "sentiment_score": float(sentiment_score)
        })
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run()