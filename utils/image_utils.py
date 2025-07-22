import base64
import cv2
import numpy as np

def base64_to_image(base64_str: str) -> np.ndarray:
    """Base64文字列をOpenCV画像（NumPy配列）に変換"""
    img_data = base64.b64decode(base64_str)
    np_img = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
    return img

def image_to_base64(img: np.ndarray) -> str:
    """OpenCV画像をBase64文字列に変換（JPEG形式）"""
    _, buffer = cv2.imencode(".jpg", img)
    img_base64 = base64.b64encode(buffer).decode("utf-8")
    return img_base64

def resize_image(img: np.ndarray, max_size: int = 640) -> np.ndarray:
    """画像サイズを最大辺に合わせてリサイズ（YOLO推論前に使用可能）"""
    h, w = img.shape[:2]
    scale = max_size / max(h, w)
    new_size = (int(w * scale), int(h * scale))
    return cv2.resize(img, new_size)