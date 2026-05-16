from ultralytics import YOLO

# carrega o melhor modelo treinado
model = YOLO("runs/detect/train/weights/best.pt")

# roda em uma imagem
results = model("teste.png")

# mostra resultado
results.show()
