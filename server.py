from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from dotenv import load_dotenv
import os
import time

# Load .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# Get Gemini API key
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError(
        "GEMINI_API_KEY is missing. Please check your .env file."
    )

# Create Gemini client
client = genai.Client(api_key=api_key)


@app.route("/", methods=["GET"])
def home():
    return "PASHYASGPT server is running!"


@app.route("/ask", methods=["POST"])
def ask_ai():

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "error": "No data received."
            }), 400

        question = str(data.get("question", "")).strip()

        if not question:
            return jsonify({
                "error": "Please enter a question."
            }), 400

        # Try the model up to 3 times
        for attempt in range(3):

            try:

                response = client.models.generate_content(
                    model="gemini-3.8-flash",
                    contents=question
                )

                answer = response.text

                return jsonify({
                    "answer": answer
                })

            except Exception as error:

                print(
                    f"Attempt {attempt + 1} failed: {repr(error)}"
                )

                # Wait before retrying
                if attempt < 2:
                    time.sleep(3)

        return jsonify({
            "error": "The AI model is temporarily busy. Please try again."
        }), 503

    except Exception as error:

        print("ERROR:", repr(error))

        return jsonify({
            "error": "Unable to get an answer from AI."
        }), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )