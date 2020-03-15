from argparse import ArgumentParser
from binary_model import BinaryModel
from multiclass_model import MulticlassCNNModel, MulticlassNNModel, MulticlassCNNDropoutModel, MulticlassCNNOptimisedModel
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
parser.add_argument('--m', '-m', dest='model',
                    type=str, default="cnn",
                    help='declare what model to use.')
parser.add_argument('--epochs', '-e', dest='epochs',
                    default=0, type=int,
                    help='set epochs for classifier (default: 15)')
parser.add_argument('--batchsize', dest='batch_size',
                    type=int, default=32,
                    help='Should use binary classifier and label to classify.')
parser.add_argument('--dataset', '-d', dest='dataset',
                    type=str, default="ffhq",
                    help='Dataset to use.')

args = parser.parse_args()

if args.model == "binary":
    model = BinaryModel(
        epochs=args.epochs,
        run_name=args.run_name,
        batch_size=args.batch_size)
elif args.model == "nn":
    model = MulticlassNNModel(
        epochs=args.epochs,
        run_name=args.run_name,
        batch_size=args.batch_size,
        dataset=args.dataset)
elif args.model == "cnn":
    model = MulticlassCNNModel(
        epochs=args.epochs,
        run_name=args.run_name,
        batch_size=args.batch_size,
        dataset=args.dataset)
elif args.model == "dropout":
    model = MulticlassCNNDropoutModel(
        epochs=args.epochs,
        run_name=args.run_name,
        batch_size=args.batch_size,
        dataset=args.dataset)
else:
    model = MulticlassCNNOptimisedModel(
        epochs=args.epochs,
        run_name=args.run_name,
        batch_size=args.batch_size,
        dataset=args.dataset)


model.load_weights()
print(model.evaluate())
genderCf, ageCf = model.confusion_matrix()
print(genderCf)
print(ageCf)
