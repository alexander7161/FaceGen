from argparse import ArgumentParser
from datasets import get_testing_data
from models import get_model
from evaluate_model import evaluate_model

"""
Test a model.
evaluate against training datasets.
"""

parser = ArgumentParser()
parser.add_argument('--runname', '-n', dest='run_name',
                    type=str,
                    help='Name for this run, will otherwise not try to load model.')
parser.add_argument('--m', '-m', dest='model',
                    type=str, default="cnn",
                    help='declare what model to use.')
parser.add_argument('--dataset', '-d', dest='dataset',
                    type=str, default="ffhq",
                    help='Dataset to use.')

args = parser.parse_args()

# Get Model.
model = get_model(args.model, args.run_name)

# Try to load model weights from run_name.
model.load_weights()

# Validate model on training datasets.
evaluate_model(model)
