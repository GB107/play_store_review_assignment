from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

print("Loading model...")
zero_shot_classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
print("Model loaded successfully")

@app.route('/classify', methods=['POST'])
def classify():
    data = request.json
    input_text = data.get("text")
    candidate_labels = data.get("candidate_labels")
    if not input_text or not candidate_labels:
        return jsonify({"error": "Both 'text' and 'candidate_labels' are required"}), 400
    try:
        result = zero_shot_classifier(input_text, candidate_labels)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
