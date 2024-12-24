from transformers import pipeline   # type: ignore
from transformers import AutoModelForSequenceClassification  # type: ignore
from transformers import TFAutoModelForSequenceClassification # type: ignore
from transformers import AutoTokenizer # type: ignore

import numpy as np
from scipy.special import softmax
import urllib.request
import csv
task='sentiment'
MODEL = f"cardiffnlp/twitter-roberta-base-{task}"
tokenizer = AutoTokenizer.from_pretrained(MODEL)
labels=[]
mapping_link = f"https://raw.githubusercontent.com/cardiffnlp/tweeteval/main/datasets/{task}/mapping.txt"
with urllib.request.urlopen(mapping_link) as f:
    html = f.read().decode('utf-8').split("\n")
    csv_reader = csv.reader(html, delimiter='\t')
labels = [row[1] for row in csv_reader if len(row) > 1]
model = TFAutoModelForSequenceClassification.from_pretrained(MODEL)



# Function to analyze sentiment
def analyze_sentiment(text: str) -> str:
    encoded_input = tokenizer(text, return_tensors='tf')
    output = model(encoded_input)
    scores = output[0][0].numpy()
    scores = softmax(scores)

    ranking = np.argsort(scores)
    ranking = ranking[::-1]
    max_score =0
    for i in range(scores.shape[0]):
      l = labels[ranking[i]]
      s = scores[ranking[i]]
      if s>max_score:
            max_score=s
            max_label=l
    return max_label, max_score
    