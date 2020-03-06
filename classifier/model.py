import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Conv2D, Flatten, Dropout, MaxPooling2D
from constants import IMG_HEIGHT, IMG_WIDTH
import constants
import pandas as pd
import os
from datasets import get_dataset
os.environ['KMP_DUPLICATE_LIB_OK'] = 'True'


class Model():
    def __init__(self, test, dataset, feature, epochs, batch_size=32):
        self.dataset = dataset
        self.feature = feature
        self.epochs = epochs
        self.batch_size = batch_size
        self.read_data(dataset,
                       feature)
        self.model = self.get_model()
        if test != 1:
            self.test = feature+str(test)
        else:
            self.test = feature
        self.callbacks = self.get_callbacks()

    def get_callbacks(self):
        cp_callback = tf.keras.callbacks.ModelCheckpoint(filepath=constants.get_checkpoint_path(self.test),
                                                         save_weights_only=True,
                                                         verbose=1)
        return [cp_callback]

    def read_data(self, dataset, feature):
        train_generator, validation_generator = get_dataset(
            dataset, self.batch_size)
        self.train_generator = train_generator
        self.validation_generator = validation_generator

    def get_model(self):
        pass

    def fit(self):
        return self.model.fit(
            self.train_generator,
            validation_data=self.validation_generator,
            epochs=self.epochs,
            callbacks=self.callbacks)

    def evaluate(self):
        evaluation = self.model.evaluate(
            self.validation_generator, verbose=0)
        return self.model.metrics_names, evaluation

    def load_weights(self):
        try:
            self.model.load_weights(
                constants.get_checkpoint_path(self.test))
        except:
            print("No checkpoint found")

    def save(self):
        try:
            os.mkdir('models')
            self.model.save('models/'+self.test)
        except:
            self.model.save('models/'+self.test)

    def predict(self, data):
        return self.predict(data)
