import tensorflow as tf
from argparse import ArgumentParser
from constants import IMG_HEIGHT, IMG_WIDTH

parser = ArgumentParser()
parser.add_argument('--runname', '-n', dest='run_name',
                    type=str,
                    help='Name for this run, will otherwise not try to load model.')

args = parser.parse_args()

# Convert the model.
model = tf.saved_model.load("runs/"+args.run_name+"/model")
concrete_func = model.signatures[
    tf.saved_model.DEFAULT_SERVING_SIGNATURE_DEF_KEY]
concrete_func.inputs[0].set_shape([1, IMG_WIDTH, IMG_HEIGHT, 3])
converter = tf.lite.TFLiteConverter.from_concrete_functions([concrete_func])

tflite_model = converter.convert()

open("runs/"+args.run_name+"/model.tflite", "wb").write(tflite_model)
