＜アプリ＞クワガタとカブトムシを判定するアプリ
仕様
１．iphoneのCameraで対象画像を映し、映像をServerに送る 
      （Localネットワークで接続 port:5000）
２．Serverは画像を解析し、解析結果をiphoneに送信する
      ・modelはyolov8

手順
1) 仮想環境(webrtc-env) python -m venv webrtc-env
2) ライブラリインすロール：
　　　・pip install flask requests
      (以下yolo用）
      .pip install ultralytics


起動：
 cd server
 python app.py


クライアントからの接続
　https://192.168.0.25:5000/client/index.html

注意：カメラは背面を映すよう指定しているため、PC内蔵カメラでは（背面がない）エラーになる。
　PCのカメラを使う場合は、script.jsの以下の部分を修正する。
（現在：iphone用）
navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: "environment" } } ,
    audio: false })
（pc用にする場合）
navigator.mediaDevices.getUserMedia({ video: true , audio: false })
