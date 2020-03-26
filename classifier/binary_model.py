import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Conv2D, Flatten, Dropout, MaxPooling2D
from constants import IMG_HEIGHT, IMG_WIDTH
from model import Model


class BinaryModel(Model):
    """Binary CNN Classifier"""

    def __init__(self, epochs,  batch_size, run_name,shuffle):
        Model.__init__(self, epochs,  batch_size, run_name,shuffle)

    def get_model(self, outputs):
        """
        Structure from:
        https://www.tensorflow.org/tutorials/images/classification
        """
        model = Sequential([
            Conv2D(16, 3, padding='same', activation='relu',
                   input_shape=(IMG_HEIGHT, IMG_WIDTH, 3)),
            MaxPooling2D(),
            Conv2D(32, 3, padding='same', activation='relu'),
            MaxPooling2D(),
            Conv2D(64, 3, padding='same', activation='relu'),
            MaxPooling2D(),
            Flatten(),
            Dense(512, activation='relu'),
            Dense(1)
        ])

        model.compile(optimizer='adam',
                      loss=tf.keras.losses.BinaryCrossentropy(
                          from_logits=True),
                      metrics=['accuracy'])
        return model
