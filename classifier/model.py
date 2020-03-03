import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Conv2D, Flatten, Dropout, MaxPooling2D
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from constants import IMG_HEIGHT, IMG_WIDTH
import constants
import pandas as pd
import os

os.environ['KMP_DUPLICATE_LIB_OK'] = 'True'


class Model():
    def __init__(self, feature="gender", epochs=15, batch_size=2, test=1):
        self.feature = feature
        self.epochs = epochs
        self.batch_size = batch_size
        self.train_generator, self.validation_generator = self.read_data(
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

    def read_data(self, feature):
        train_df = pd.read_csv("./face_data/labels.csv", header=0)
        train_df[feature] = train_df[feature].astype('str')
        train_datagen = ImageDataGenerator(rescale=1./255,
                                           shear_range=0.2,
                                           zoom_range=0.2,
                                           horizontal_flip=True,
                                           validation_split=0.2)
        train_generator = train_datagen.flow_from_dataframe(
            dataframe=train_df,
            directory='face_data',
            x_col="filename",
            y_col=feature,
            target_size=(
                constants.IMG_HEIGHT, constants.IMG_WIDTH),
            batch_size=self.batch_size,
            class_mode='binary',
            subset='training')

        validation_generator = train_datagen.flow_from_dataframe(
            dataframe=train_df,
            directory='face_data',
            x_col="filename",
            y_col="gender",
            target_size=(
                constants.IMG_HEIGHT, constants.IMG_WIDTH),
            batch_size=self.batch_size,
            class_mode='binary',
            subset='validation')

        return train_generator, validation_generator

    def get_model(self):
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
