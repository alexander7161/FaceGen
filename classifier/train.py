import tensorflow as tf
from model import Model
from binary_model import BinaryModel
from multiclass_model import MulticlassModel
import constants
from matplotlib import pyplot as plt
from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument('--label', '-l', dest='label',
                    default="gender", type=str,
                    help='set label for classifier (default: gender)')
parser.add_argument('--epochs', '-e', dest='epochs',
                    default=15, type=int,
                    help='set epochs for classifier (default: 15)')
parser.add_argument('--test', '-t', dest='test',
                    default=1, type=str,
                    help='set epochs for classifier (default: 1)')

parser.add_argument('--dataset', '-d', dest='dataset',
                    default="ffhq", type=str,
                    help='set dataset for classifier (default: ffhq)')

parser.add_argument('--multiclass', '-m', dest='multiclass',
                    help='Should use multiclass classifier', action='store_true')


args = parser.parse_args()

print(tf.config.experimental.list_physical_devices(device_type=None))

if args.multiclass:
    model = MulticlassModel(epochs=args.epochs,
                            test=args.test)
else:
    model = BinaryModel(feature=args.label, epochs=args.epochs,
                        test=args.test, dataset=args.dataset)

model.load_weights()
history = model.fit()
print(model.test())
model.save()

print(history)
# https://www.tensorflow.org/tutorials/images/classification#visualize_training_results
try:
    acc = history.history['accuracy']
    val_acc = history.history['val_accuracy']
except:
    acc = history.history['acc']
    val_acc = history.history['val_acc']


loss = history.history['loss']
val_loss = history.history['val_loss']

epochs_range = range(args.epochs)

plt.figure(figsize=(8, 8))
plt.subplot(1, 2, 1)
plt.plot(epochs_range, acc, label='Training Accuracy')
plt.plot(epochs_range, val_acc, label='Validation Accuracy')
plt.legend(loc='lower right')
plt.title('Training and Validation Accuracy')

plt.subplot(1, 2, 2)
plt.plot(epochs_range, loss, label='Training Loss')
plt.plot(epochs_range, val_loss, label='Validation Loss')
plt.legend(loc='upper right')
plt.title('Training and Validation Loss')
plt.savefig('result.png')
plt.show()
model.evaluate()
