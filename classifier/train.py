from model import Model
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


args = parser.parse_args()


model = Model(args.label, epochs=args.epochs, test=args.test)
model.load_weights()

history = model.fit()
model.save()

# https://www.tensorflow.org/tutorials/images/classification#visualize_training_results

acc = history.history['accuracy']
val_acc = history.history['val_accuracy']

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
plt.show()
model.evaluate()
