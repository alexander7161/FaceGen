from os import makedirs
from crossValClass import CrossVal
from argparse import ArgumentParser
from multiclass_model import MulticlassCNNOptimisedModel
from datetime import datetime
import sys
from models import get_model

"""
Script for performing K-fold cross validation.
"""

parser = ArgumentParser()
parser.add_argument('--epochs', '-e', dest='epochs',
                    default=15, type=int,
                    help='set epochs for classifier (default: 15)')
parser.add_argument('--runname', '-n', dest='run_name',
                    type=str,
                    help='Name for this run, will otherwise not try to load model.')
parser.add_argument('--m', '-m', dest='model',
                    type=str, default="cnn",
                    help='declare what model to use.')
parser.add_argument('--batchsize', dest='batch_size',
                    type=int, default=32,
                    help='Batch size for model to use.')
parser.add_argument('--folds', '-f', dest='folds',
                    type=int, default=10,
                    help='K-folds to train (default: 10).')

args = parser.parse_args()

# Get the model.
model = get_model(args.model, args.run_name)

# Create crossval instance.
crossValidation = CrossVal()

if args.run_name is not None:
    run_name = args.run_name
else:
    run_name = datetime.now().strftime("%d_%m_%Y-%H_%M_%S")


def get_run_folder():
    return "runs/crossVal/"+run_name


# self made Kfold cross validation.
crossValMeanAccuracy, crossValStD = crossValidation.trainTestSplit(
    classifier=type(model),
    run_name=run_name,
    epochs=args.epochs,
    folds=args.folds
)

try:
    makedirs(get_run_folder())
except:
    pass
with open(get_run_folder()+'/crossValScore.txt', 'w') as file:
    file.write("Accuracy: " + str(crossValMeanAccuracy))
    file.write("std: " + str(crossValStD))

print("My cross validation Accuracy: %.4f" % crossValMeanAccuracy)
