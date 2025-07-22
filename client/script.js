// カメラ映像を取得
//navigator.mediaDevices.getUserMedia({ video: true , audio: false })
navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: "environment" } } , audio: false })
  .then(stream => {
    document.getElementById("video").srcObject = stream;
  })
  .catch(err => {
    console.error(err.name, err.message, err.constraint);
    alert("カメラの取得に失敗しました: " + err);
  });

navigator.mediaDevices.enumerateDevices().then(devices => {
  console.log(devices); // 利用可能なカメラやマイクの一覧
});

document.querySelector("#start").addEventListener("click", () => {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      const video = document.getElementById("video");
      video.srcObject = stream;
      video.play();
    });
});

// カメラ起動
function startCamera() {
  const video = document.getElementById("video");

  // iOS Safari対応のため、video要素に明示的に属性を設定
  video.setAttribute("autoplay", "");
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");

  // カメラ取得（リアカメラを優先）
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: { exact: "environment" } },
    audio: false
  })
  .then(stream => {
    video.srcObject = stream;
    video.play(); // iOSでは明示的に play() が必要な場合あり
  })
  .catch(err => {
    alert("カメラの取得に失敗しました: " + err.message);
  });
}

// キャプチャしてFlaskに送信
function capture() {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  // Base64形式で画像取得（ヘッダー除去）
  const base64Image = canvas.toDataURL("image/jpeg").split(',')[1];

  // FlaskにPOST送信
  // 以下はdeploy用修正git
  //fetch("https://192.168.0.25:5000/predict", {
  fetch("https://find_insects_demo.ongender.com/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64Image })
  })
  .then(res => res.json())
  .then(data => {
    // 推論結果画像を表示
    document.getElementById("result").src = "data:image/jpeg;base64," + data.result;
  })
  .catch(err => {
    alert("推論エラー: " + err);
  });
}
