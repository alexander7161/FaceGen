import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Conv2D, Flatten, Dropout, MaxPooling2D, Activation

from constants import IMG_HEIGHT, IMG_WIDTH
from model import Model
from datasets import get_dataset
import pandas as pd
from constants import IMG_HEIGHT, IMG_WIDTH


class MulticlassModel(Model):
    columns = ["gender", "child", "teen", "adult", "senior"]

    def __init__(self, test, dataset, feature, epochs, batch_size=32):
        super().__init__(test, dataset, feature, epochs, batch_size)

    def read_data(self, dataset, feature):
        train_generator, validation_generator, test_generator = get_dataset(
            "ffhqmulticlass", self.batch_size)
        self.train_generator = train_generator
        self.validation_generator = validation_generator
        self.test_generator = test_generator

    def get_model(self):
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

    def fit(self):
        STEP_SIZE_TRAIN = self.train_generator.n//self.train_generator.batch_size
        STEP_SIZE_VALID = self.validation_generator.n//self.validation_generator.batch_size
        return self.model.fit(
            self.train_generator,
            steps_per_epoch=STEP_SIZE_TRAIN,
            validation_steps=STEP_SIZE_VALID,
            validation_data=self.validation_generator,
            epochs=self.epochs,
            callbacks=self.callbacks)

    def test(self):
        evaluation = self.model.evaluate(
            self.test_generator, verbose=0)
        return self.model.metrics_names, evaluation
