from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from ultralytics import YOLO
from utils.image_utils import base64_to_image, image_to_base64
import os

# Flaskアプリ初期化
app = Flask(__name__) 
CORS(app)  # クロスオリジン許可（JSとの通信用）

# YOLOモデルの読み込み
model_path = os.path.join("model", "last.pt")
model = YOLO(model_path)

@app.route("/client/<path:filename>")
def serve_client_file(filename):
    return send_from_directory("client", filename)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Base64画像を受信
        data = request.get_json()
        base64_img = data.get("image")
        if not base64_img:
            return jsonify({ "error": "No image data received." }), 400

        # Base64 → OpenCV画像に変換
        img = base64_to_image(base64_img)

        # YOLO推論
        results = model.predict(img, save=False)
        result_img = results[0].plot()

        # 推論結果画像をBase64に変換して返却
        result_base64 = image_to_base64(result_img)
        return jsonify({ "result": result_base64 })

    except Exception as e:
        return jsonify({ "error": str(e) }), 500

''' Deploy要修正（コメントアウト）
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, ssl_context="adhoc")
'''
