import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Conv2D, Flatten, Dropout, MaxPooling2D, Activation

from constants import IMG_HEIGHT, IMG_WIDTH
from model import Model
import pandas as pd


class MulticlassNNModel(Model):
    """A Neural Network classifier that classifies multiple labels and multiple classes."""

    def __init__(self, outputs, run_name=None, save_checkpoints=True):
        super().__init__(outputs, run_name, save_checkpoints)

    def get_model(self, outputs):
        """
        Simple Neural Network
        2 fully-connected Hidden layers.
        """
        model = Sequential([
            Flatten(input_shape=(IMG_HEIGHT, IMG_WIDTH, 3)),
            Flatten(),
            Dense(512),
            Dense(512),
            Dense(outputs, activation='sigmoid'),
        ])

        # Binary_crossentropy from https://github.com/keras-team/keras/issues/741
        model.compile("adam", loss="binary_crossentropy",
                      metrics=['accuracy'])

        return model


class MulticlassCNNModel(Model):
    """A CNN classifier that classifies multiple labels and multiple classes."""

    def __init__(self, outputs, run_name=None, save_checkpoints=True):
        super().__init__(outputs, run_name, save_checkpoints)

    def get_model(self, outputs):
        model = Sequential([
            Conv2D(32, (3, 3), padding='same',
                   input_shape=(IMG_HEIGHT, IMG_WIDTH, 3)),
            Conv2D(32, (3, 3)),
            MaxPooling2D(pool_size=(2, 2)),
            Conv2D(64, (3, 3), padding='same'),
            MaxPooling2D(pool_size=(2, 2)),
            Conv2D(64, (3, 3), padding='same'),
            MaxPooling2D(pool_size=(2, 2)),
            Flatten(),
            Dense(512),
            Dense(outputs, activation='sigmoid'),
        ])

        # Binary_crossentropy from https://github.com/keras-team/keras/issues/741
        model.compile("adam", loss="binary_crossentropy",
                      metrics=['accuracy'])

        return model


class MulticlassCNNDropoutModel(Model):
    """A CNN classifier that classifies multiple labels and multiple classes."""

    def __init__(self, outputs, run_name=None, save_checkpoints=True):
        super().__init__(outputs, run_name, save_checkpoints)

    def get_model(self, outputs):
        """
        Dropout layers added.
        """
        model = Sequential([
            Conv2D(32, (3, 3), padding='same',
                   input_shape=(IMG_HEIGHT, IMG_WIDTH, 3)),
            Conv2D(32, (3, 3)),
            MaxPooling2D(pool_size=(2, 2)),
            Dropout(0.25),
            Conv2D(64, (3, 3), padding='same'),
            Conv2D(64, (3, 3)),
            MaxPooling2D(pool_size=(2, 2)),
            Dropout(0.25),
            Flatten(),
            Dense(512),
            Dropout(0.5),
            Dense(outputs, activation='sigmoid'),
        ])

        model.compile("adam", loss="binary_crossentropy",
                      metrics=['accuracy'])

        return model


class MulticlassCNNOptimisedModel(Model):
    """A CNN classifier that classifies multiple labels and multiple classes.
        With Dropout and relu activation."""

    def __init__(self, outputs, run_name=None, save_checkpoints=True):
        super().__init__(outputs, run_name, save_checkpoints)

    def get_model(self, outputs):
        """
        Activation layers added
        """
        model = Sequential([
            Conv2D(32, (3, 3), padding='same',
                   input_shape=(IMG_HEIGHT, IMG_WIDTH, 3), activation='relu'),
            Conv2D(32, (3, 3), activation='relu'),
            MaxPooling2D(pool_size=(2, 2)),
            Dropout(0.25),
            Conv2D(64, (3, 3), padding='same', activation='relu'),
            Conv2D(64, (3, 3), activation='relu'),
            MaxPooling2D(pool_size=(2, 2)),
            Dropout(0.25),
            Flatten(),
            Dense(512, activation='relu'),
            Dropout(0.5),
            Dense(outputs, activation='sigmoid'),
        ])

        # Binary_crossentropy from https://github.com/keras-team/keras/issues/741
        model.compile("adam", loss="binary_crossentropy",
                      metrics=['accuracy'])

        return model

class CNN6LayerModel(Model):
    """A CNN classifier that classifies multiple labels and multiple classes.
        With Dropout and relu activation."""

    def __init__(self, outputs, run_name=None, save_checkpoints=True):
        super().__init__(outputs, run_name, save_checkpoints)

    def get_model(self, outputs):
        """
        Activation layers added
        """
        model = Sequential([
            Conv2D(32, (3, 3), padding='same',
                   input_shape=(IMG_HEIGHT, IMG_WIDTH, 3), activation='relu'),
            Conv2D(32, (3, 3), activation='relu'),
            MaxPooling2D(pool_size=(2, 2)),
            Dropout(0.25),
            Conv2D(64, (3, 3), padding='same', activation='relu'),
            Conv2D(64, (3, 3), activation='relu'),
            MaxPooling2D(pool_size=(2, 2)),
            Dropout(0.25),
            Conv2D(64, (3, 3), activation='relu'),
            MaxPooling2D(pool_size=(2, 2)),
            Conv2D(128, (3, 3), activation='relu'),
            MaxPooling2D(pool_size=(2, 2)),
            Dropout(0.25),
            Conv2D(128, (3, 3), activation='relu'),
            MaxPooling2D(pool_size=(2, 2)),
            Dropout(0.25),
            Flatten(),
            Dense(512, activation='relu'),
            Dropout(0.5),
            Dense(outputs, activation='sigmoid'),
        ])

        # Binary_crossentropy from https://github.com/keras-team/keras/issues/741
        model.compile("adam", loss="binary_crossentropy",
                      metrics=['accuracy'])

        return model
