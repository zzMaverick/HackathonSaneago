import cv2
import os
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

IMAGE_FOLDER = os.path.join(BASE_DIR, "dataset/images/val")

LABEL_FOLDER = os.path.join(BASE_DIR, "dataset/label/val")

os.makedirs(LABEL_FOLDER, exist_ok=True)

def convert_to_yolo(x, y, w, h, img_w, img_h):
    x_center = (x + w / 2) / img_w
    y_center = (y + h / 2) / img_h
    w = w / img_w
    h = h / img_h
    return x_center, y_center, w, h


for img_name in os.listdir(IMAGE_FOLDER):
    if not img_name.endswith(".png"):
        continue

    path = os.path.join(IMAGE_FOLDER, img_name)
    img = cv2.imread(path)

    h_img, w_img = img.shape[:2]

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5,5), 0)
    edges = cv2.Canny(blur, 50, 150)

    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    label_path = os.path.join(LABEL_FOLDER, img_name.replace(".png", ".txt"))

    with open(label_path, "w") as f:

        for c in contours:
            x, y, w, h = cv2.boundingRect(c)

            # ignora ruído pequeno
            if w * h < 500:
                continue

            x_c, y_c, w_n, h_n = convert_to_yolo(x, y, w, h, w_img, h_img)

            # classe 0 (você pode mudar depois)
            f.write(f"0 {x_c} {y_c} {w_n} {h_n}\n")

print("Labels gerados com sucesso!")
