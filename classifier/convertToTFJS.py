import tensorflow as tf
from argparse import ArgumentParser
from constants import IMG_HEIGHT, IMG_WIDTH
import tensorflowjs as tfjs

parser = ArgumentParser()
parser.add_argument('--runname', '-n', dest='run_name',
                    type=str,
                    help='Name for this run, will otherwise not try to load model.')

args = parser.parse_args()

# Convert the model.
model = tf.keras.models.load_model("runs/"+args.run_name+"/model")

tfjs.converters.save_keras_model(model, "runs/"+args.run_name+"/tfjs")
