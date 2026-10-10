from pathlib import Path
from setfit import SetFitModel

MODEL_PATH = Path(__file__).resolve().parent / "setfit_multilingual_model"
model = SetFitModel.from_pretrained(str(MODEL_PATH))

def predict_department(request: str) -> str:
    if not isinstance(request, str) or not request.strip():
        raise ValueError("Patient request must be a non-empty string.")

    prediction = model.predict([request.strip()])
    return str(prediction[0])


def main():
    requests = [
        "I need another blanket",
        "Necesito agua",
        "मुझे बाथरूम जाना है",
        "Je ne peux pas respirer"
    ]

    for request in requests:
        print(f"{request} -> {predict_department(request)}")

if __name__ == "__main__":
    main()