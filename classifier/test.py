from argparse import ArgumentParser
from binary_model import BinaryModel
from multiclass_model import MulticlassMultiLabelModel
from sklearn.metrics import multilabel_confusion_matrix
import numpy as np
import pandas as pd
from matplotlib import pyplot as plt
import csv
from utils import plot_confusion_matrix

parser = ArgumentParser()
parser.add_argument('--runname', '-n', dest='run_name',
                    type=str,
                    help='Name for this run, will otherwise not try to load model.')
parser.add_argument('--binary', '-b', dest='binary',
                    help='Should use binary classifier', action='store_true')


args = parser.parse_args()

if args.binary:
    model = BinaryModel(feature=args.label, epochs=0,
                        test=args.test, dataset=args.dataset)
else:
    model = MulticlassMultiLabelModel(epochs=0,
                                      run_name=args.run_name, batch_size=1)


model.load_weights()
print(model.evaluate())
genderCf, ageCf = model.confusion_matrix()
print(genderCf)
print(ageCf)
