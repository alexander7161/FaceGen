from argparse import ArgumentParser
from datasets import get_testing_data
from models import get_model

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

model = get_model(args.model, args.run_name)

# Try to load model weights from run_name.
model.load_weights()

datasets = ["ffhq", "ffhqgenerated", "overall"]

for dataset in datasets:
    test_generator, columns = get_testing_data(dataset)
    evaluation = model.evaluate(test_generator, dataset)
    print(evaluation)
    genderCf, ageCf = model.confusion_matrix(test_generator, dataset)
    print(genderCf)
    print(ageCf)
