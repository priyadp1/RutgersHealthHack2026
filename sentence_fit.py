from setfit import SetFitModel, Trainer, TrainingArguments
from datasets import Dataset
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, f1_score
import pandas as pd
import random
import numpy as np
import torch

random.seed(42)
np.random.seed(42)
torch.manual_seed(42)

data = {
    "text": [
        # Blanket - 0
        "I need a blanket",
        "Can I have another blanket?",
        "Necesito una manta",
        "मुझे एक कंबल चाहिए",
        "J'ai besoin d'une couverture",

        # Nausea - 1
        "I'm feeling nauseous",
        "I feel like throwing up",
        "Tengo náuseas",
        "मुझे उल्टी जैसा लग रहा है",
        "J'ai envie de vomir",

        # Food - 2
        "Can I get lunch?",
        "I would like some food",
        "Quiero algo de comer",
        "मुझे खाना चाहिए",
        "J'ai faim",

        # Bathroom - 3
        "I need to use the bathroom",
        "Can someone help me to the toilet?",
        "Necesito ir al baño",
        "मुझे बाथरूम जाना है",
        "Je dois aller aux toilettes",

        # TV Assistance - 4
        "My TV isn't working",
        "Can someone fix the television?",
        "Mi televisor no funciona",
        "मेरा टीवी काम नहीं कर रहा है",
        "Ma télévision ne fonctionne pas",

        # Pain - 5
        "I'm experiencing pain",
        "My stomach hurts badly",
        "Tengo mucho dolor",
        "मुझे बहुत दर्द हो रहा है",
        "J'ai très mal",

        # Water - 6
        "Can I have some water?",
        "Please bring me water",
        "Necesito agua",
        "मुझे पानी चाहिए",
        "J'ai besoin d'eau",

        # Ice Chips - 7
        "Can I get some ice chips?",
        "Please bring me crushed ice",
        "Necesito hielo picado",
        "मुझे बर्फ के छोटे टुकड़े चाहिए",
        "Je voudrais de la glace pilée",

        # General Discomfort - 8
        "I'm not feeling well",
        "Something doesn't feel right",
        "No me siento bien",
        "मेरी तबीयत ठीक नहीं है",
        "Je ne me sens pas bien",

        # Emergency - 9
        "I can't breathe",
        "I'm having severe chest pain",
        "No puedo respirar",
        "मुझे सांस लेने में परेशानी हो रही है",
        "Je n'arrive pas à respirer"
    ],

    "label": [
        *([0] * 5),
        *([1] * 5),
        *([2] * 5),
        *([3] * 5),
        *([4] * 5),
        *([5] * 5),
        *([6] * 5),
        *([7] * 5),
        *([8] * 5),
        *([9] * 5)
    ]
}

label_mapping = {
    0: "Med Tech",
    1: "Nurse",
    2: "Dietician"
}
intent_to_department = {
    0: 0,  
    1: 1,  
    2: 2,  
    3: 0,  
    4: 0,  
    5: 1, 
    6: 0,  
    7: 0, 
    8: 1,  
    9: 1   
}
df = pd.DataFrame(data)
df["label"] = df["label"].map(intent_to_department)
train_df, test_df = train_test_split(df, test_size=0.2, random_state=42, stratify=df['label'])
train_dataset = Dataset.from_pandas(train_df.reset_index(drop=True))
test_dataset = Dataset.from_pandas(test_df.reset_index(drop=True))
model = SetFitModel.from_pretrained("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2" , labels=["Med Tech", "Nurse", "Dietician"])
args = TrainingArguments( batch_size = 4, num_epochs = 2, num_iterations=10, seed=42)
trainer = Trainer(model=model, train_dataset=train_dataset, eval_dataset=test_dataset, args=args)
trainer.train()
preds = model.predict(test_dataset["text"])
true_labels = [
    label_mapping[label]
    for label in test_dataset["label"]
]
print("Classification Report:")
print(classification_report(true_labels,preds,labels=["Med Tech", "Nurse", "Dietician"],zero_division=0))
print(f"Accuracy: {accuracy_score(true_labels, preds):.4f}")
print(f"Macro F1: {f1_score(true_labels, preds, average='macro'):.4f}")
model.save_pretrained("setfit_multilingual_model")
print("Model saved to 'setfit_multilingual_model' directory.")
test_requests = [ 
    "I need another blanket",
    "Necesito agua",
    "मुझे बाथरूम जाना है",
    "Je ne peux pas respirer",
    "I feel like vomiting"]

pred_labels = model.predict(test_requests)
for text, label in zip(test_requests, pred_labels):
    print(f"Test Request: '{text}' -> Predicted Label: '{label}'")


challenge_requests = [
    # English
    "It's freezing in this room",
    "Could somebody help me get out of bed?",
    "My chest feels unusually tight",
    "I feel like I'm going to faint",
    "Do you have any vegetarian meals?",

    # Spanish
    "¿Podrían traerme algo para beber?",
    "El control remoto dejó de funcionar",
    "Me siento muy mareado",
    "Tengo una presión extraña en el pecho",
    "¿Qué opciones hay para cenar?",

    # Hindi
    "मुझे बहुत ठंड लग रही है",
    "क्या कोई मुझे उठने में मदद कर सकता है?",
    "मेरा सिर बहुत घूम रहा है",
    "मेरे सीने में जकड़न महसूस हो रही है",
    "क्या शाकाहारी भोजन उपलब्ध है?",

    # French
    "J'ai vraiment froid dans cette chambre",
    "Pourriez-vous m'aider à me lever ?",
    "J'ai l'impression de m'évanouir",
    "Je ressens une pression dans ma poitrine",
    "Quels plats végétariens proposez-vous ?"
]

expected_labels = ["Med Tech", "Med Tech", "Nurse", "Nurse", "Dietician"] * 4
challenge_preds = model.predict(challenge_requests)
print(f"\nChallenge Results:")
print(classification_report(expected_labels,challenge_preds,labels=["Med Tech", "Nurse", "Dietician"],zero_division=0))
print(f"Accuracy: {accuracy_score(expected_labels, challenge_preds):.4f}")
print(f"Macro F1: {f1_score(expected_labels, challenge_preds, average='macro'):.4f}")
for text, label in zip(challenge_requests, challenge_preds):
    print(f"Challenge Request: '{text}' -> Predicted Label: '{label}'")

print("\nMisclassified Challenge Requests:")
for text, expected, predicted in zip(challenge_requests,expected_labels,challenge_preds):
    if expected != predicted:
        print(f"Request: {text}")
        print(f"Expected: {expected}")
        print(f"Predicted: {predicted}")