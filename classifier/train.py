import tensorflow as tf
from model import Model
from binary_model import BinaryModel
from multiclass_model import MulticlassCNNModel,MulticlassNNModel,MulticlassCNNDropoutModel
import constants
from matplotlib import pyplot as plt
from argparse import ArgumentParser
import time

parser = ArgumentParser()
parser.add_argument('--epochs', '-e', dest='epochs',
                    default=15, type=int,
                    help='set epochs for classifier (default: 15)')
parser.add_argument('--runname', '-n', dest='run_name',
                    type=str,
                    help='Name for this run, will otherwise not try to load model.')
parser.add_argument('--m', '-m', dest='model',
                    type=str, default="cnn",
                    help='Should use binary classifier and label to classify.')
parser.add_argument('--batchsize', dest='batch_size',
                    type=int, default=32,
                    help='Should use binary classifier and label to classify.')
parser.add_argument('--dataset','-d', dest='dataset',
                    type=str, default="ffhq",
                    help='Dataset to use.')


args = parser.parse_args()

print(tf.config.experimental.list_physical_devices(device_type=None))

print("Num GPUs Available: ", len(tf.config.experimental.list_physical_devices('GPU')))


if args.model =="binary":
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
model.fit()
model.plot_training()
print(model.evaluate())
model.confusion_matrix()
model.save()
