import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Conv2D, Flatten, Dropout, MaxPooling2D
from PIL import Image
import numpy as np
from skimage import transform
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
            self.testNo = feature+str(test)
        else:
            self.testNo = feature
        self.callbacks = self.get_callbacks()

    def get_callbacks(self):
        cp_callback = tf.keras.callbacks.ModelCheckpoint(filepath=constants.get_checkpoint_path(self.testNo),
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
                constants.get_checkpoint_path(self.testNo))
        except:
            print("No checkpoint found")

    def save(self):
        try:
            os.mkdir('models')
            self.model.save('models/'+self.testNo)
        except:
            self.model.save('models/'+self.testNo)

    def predict(self, filename):
        np_image = Image.open(filename)
        np_image = np.array(np_image).astype('float32')/255
        np_image = transform.resize(np_image, (IMG_WIDTH, IMG_HEIGHT, 3))
        np_image = np.expand_dims(np_image, axis=0)
        pred = self.model.predict(np_image)
        pred_bool = (pred > 0.5)
        result = []
        i = 0
        ages = ["teen", "senior", "adult", "child"]
        while i < len(pred_bool[0]):
            prediction = pred_bool[0][i]
            if self.columns[i] == "gender":
                if prediction:
                    result.append("female")
                else:
                    result.append("male")
                i += 1
            elif self.columns[i] in ages:
                age_bools = pred_bool[0][1:5]
                most_likely_age_i = np.argmax(age_bools)
                result.append(ages[most_likely_age_i])
                i += 4
            elif prediction:
                result.append(self.columns[i])
                i += 1

        return result
