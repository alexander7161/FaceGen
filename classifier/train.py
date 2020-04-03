import tensorflow as tf
from argparse import ArgumentParser
from datasets import get_training_data, get_testing_data
from models import get_model

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
parser.add_argument('--dataset', '-d', dest='dataset',
                    type=str, default="ffhq",
                    help='Dataset to use.')
parser.add_argument('--columns', '-c', dest='columns', nargs='+',
                    help='Dataset to use.')
parser.add_argument('--shuffle', '-s', dest='shuffle',
                    action='store_true', default=True,
                    help='Should the dataset be shuffled.')

args = parser.parse_args()

print(tf.config.experimental.list_physical_devices(device_type=None))

print("Num GPUs Available: ", len(tf.config.experimental.list_physical_devices('GPU')))
if args.run_name:
    print("training: "+args.run_name)

model = get_model(args.model, args.run_name)

model.load_weights()
train_generator, validation_generator, columns = get_training_data(
    args.batch_size, args.dataset, args.shuffle)
model.fit(train_generator, validation_generator, columns, epochs=args.epochs)
model.plot_training()

datasets = ["ffhq", "ffhqgenerated", "overall"]
for dataset in datasets:
    test_generator, columns = get_testing_data(dataset)
    evaluation = model.evaluate(test_generator, dataset)
    print(evaluation)
    genderCf, ageCf = model.confusion_matrix(test_generator, dataset)
    print(genderCf)
    print(ageCf)

model.save()
