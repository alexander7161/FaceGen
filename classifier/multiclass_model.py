import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Conv2D, Flatten, Dropout, MaxPooling2D, Activation

from constants import IMG_HEIGHT, IMG_WIDTH
from model import Model
import pandas as pd


class MulticlassMultiLabelModel(Model):
    """A CNN classifier that classifies multiple labels and multiple classes."""

    def __init__(self, epochs,  batch_size, run_name):
        super().__init__(epochs, batch_size, run_name)

    def get_model(self):
        """
        Structure inspired by comments from:
        https://github.com/keras-team/keras/issues/741
        """
        model = Sequential([
            Conv2D(32, (3, 3), padding='same',
                   input_shape=(IMG_HEIGHT, IMG_WIDTH, 3)),
            Activation('relu'),
            Conv2D(32, (3, 3)),
            Activation('relu'),
            MaxPooling2D(pool_size=(2, 2)),
            Dropout(0.25),
            Conv2D(64, (3, 3), padding='same'),
            Activation('relu'),
            Conv2D(64, (3, 3)),
            Activation('relu'),
            MaxPooling2D(pool_size=(2, 2)),
            Dropout(0.25),
            Flatten(),
            Dense(512),
            Activation('relu'),
            Dropout(0.5),
            Dense(len(self.columns), activation='sigmoid'),
        ])

        model.compile("adam", loss="binary_crossentropy",
                      metrics=['accuracy'])

        return model