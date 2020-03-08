import os
import csv

PATH = os.path.dirname(__file__)

# Gender classification
labels = {'male': 0, 'female': 1}
# Gender and age classification
ages = {'child': 0, 'teen': 1, 'adult': 2, 'senior': 3}
labels = {}
for age, value in ages.items():
    labels['male_'+age] = [0, value]
    labels['female_'+age] = [1, value]

with open('labels.csv', 'a') as fd:
    writer = csv.writer(fd)
    row = ["filename"]
    for label, value in labels.items():
        row.extend(label)
    writer.writerow(row)
# Save CSV with image
for label, value in labels.items():
    train_dir = os.path.join(PATH, label)
    for file in os.listdir(train_dir):
        if file != ".DS_Store":
            with open('labels.csv', 'a') as fd:
                writer = csv.writer(fd)
                row = [file]
                row.extend(value)
                writer.writerow(row)
