import tensorflow as tf
from argparse import ArgumentParser
from datasets import get_training_data, get_testing_data
from models import get_model
from evaluate_model import evaluate_model

"""
Train the model.
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
                    help='Batchsize to use for model.')
parser.add_argument('--dataset', '-d', dest='dataset',
                    type=str, default="ffhq",
                    help='Dataset to use.')
parser.add_argument('--shuffle', '-s', dest='shuffle',
                    action='store_true', default=True,
                    help='Should the dataset be shuffled.')

args = parser.parse_args()

# Print GPU check
print(tf.config.experimental.list_physical_devices(device_type=None))

print("Num GPUs Available: ", len(
    tf.config.experimental.list_physical_devices('GPU')))

# Print run name if set.
if args.run_name:
    print("training: "+args.run_name)
# Get requested model.
model = get_model(args.model, args.run_name)
# Load weights if they exist.
model.load_weights()
# Get training data.
train_generator, validation_generator, columns = get_training_data(
    args.batch_size, args.dataset, args.shuffle)
# Train model on training data.
model.fit(train_generator, validation_generator, columns, epochs=args.epochs)
# Save a plot of training.
model.plot_training()

# Validate model on testing datasets.
evaluate_model(model)

# Save model.
model.save()
