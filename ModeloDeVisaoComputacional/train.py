from ultralytics import YOLO

def main():
    # modelo base (leve e rápido)
    model = YOLO("yolov8n.pt")

    # treino
    model.train(
        data="dataset.yaml",
        epochs=100,
        imgsz=640,
        batch=16,
        device="mps"  # troca pra "mps" se quiser usar GPU do Mac M1/M2
    )

if __name__ == "__main__":
    main()
