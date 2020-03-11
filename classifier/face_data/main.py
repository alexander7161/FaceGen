import os
import csv

PATH = os.path.dirname(__file__)

# Gender classification
labels = {'male': 0, 'female': 1}
# Gender and age classification
ages = ['senior', 'adult', 'child']
labels = {}
for i, age in enumerate(ages):
    ageList = [0, 0, 0]
    ageList[i] = 1
    labels['male_'+age] = [0]+ageList
    labels['female_'+age] = [1]+ageList


with open('labels.csv', 'a') as fd:
    writer = csv.writer(fd)
    row = ["filename", "gender"]
    for age in ages:
        row.extend([age])
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
