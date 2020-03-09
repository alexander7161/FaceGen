import tensorflow as tf
from model import Model
from binary_model import BinaryModel
from multiclass_model import MulticlassMultiLabelModel
import constants
from matplotlib import pyplot as plt
from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument('--epochs', '-e', dest='epochs',
                    default=15, type=int,
                    help='set epochs for classifier (default: 15)')
parser.add_argument('--runname', '-n', dest='run_name',
                    type=str,
                    help='Name for this run, will otherwise not try to load model.')
parser.add_argument('--binary', '-b', dest='binary',
                    type=str,
                    help='Should use binary classifier and label to classify.')
parser.add_argument('--batchsize', dest='batch_size',
                    type=int, default=32,
                    help='Should use binary classifier and label to classify.')

args = parser.parse_args()

print(tf.config.experimental.list_physical_devices(device_type=None))

if args.binary:
    model = BinaryModel(
        epochs=args.epochs,
        run_name=args.run_name,
        batch_size=args.batch_size)
else:
    model = MulticlassMultiLabelModel(
        epochs=args.epochs,
        run_name=args.run_name,
        batch_size=args.batch_size)

model.fit()
model.plot_training()
print(model.evaluate())
model.confusion_matrix()
model.save()