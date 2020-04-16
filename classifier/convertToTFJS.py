import tensorflow as tf
from argparse import ArgumentParser
from constants import IMG_HEIGHT, IMG_WIDTH
import tensorflowjs as tfjs

"""
Converts a provided runname to tensorflowJS for use with the JavaScript runtime.
"""

parser = ArgumentParser()
parser.add_argument('--runname', '-n', dest='run_name',
                    type=str, required=True,
                    help='Name for this run, will otherwise not try to load model.')
args = parser.parse_args()

# Load Model from run name.
model = tf.keras.models.load_model("runs/"+args.run_name+"/model")

# Save as tfjs.
# inspired by https://www.tensorflow.org/js/tutorials/conversion/import_keras
tfjs.converters.save_keras_model(model, "runs/"+args.run_name+"/tfjs")
