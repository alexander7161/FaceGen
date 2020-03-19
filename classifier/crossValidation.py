from crossValClass import CrossVal
from argparse import ArgumentParser
from multiclass_model import MulticlassCNNOptimisedModel
from datetime import datetime
import sys
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
                    help='Should use binary classifier and label to classify.')

args = parser.parse_args()


crossValidation = CrossVal()

if args.run_name is not None:
    run_name = args.run_name
else:
    run_name = datetime.now().strftime("%d_%m_%Y-%H_%M_%S")


def get_run_folder(self):
    return "runs/crossVal/"+run_name


# self made Kfold cross validation.
# try:
crossValAccuracy = crossValidation.trainTestSplit(
    MulticlassCNNOptimisedModel, args.epochs)
with open(get_run_folder()+'/crossValScore.txt', 'w') as file:
    file.write(crossValAccuracy)

print("My cross validation Accuracy: %.4f" % crossValAccuracy)
