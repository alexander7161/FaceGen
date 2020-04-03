import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Conv2D, Flatten, Dropout, MaxPooling2D
from PIL import Image
import numpy as np
from skimage import transform
from constants import IMG_HEIGHT, IMG_WIDTH
import pandas as pd
import os
from sklearn.metrics import confusion_matrix
from matplotlib import pyplot as plt
from datetime import datetime
from utils import plot_confusion_matrix
import time
import csv

os.environ['KMP_DUPLICATE_LIB_OK'] = 'True'


class Model():
    """Abstract Class for classifier models"""

    def __init__(self, outputs, run_name=None, save_checkpoints=True):
        if run_name is not None:
            self.run_name = run_name
        else:
            self.run_name = datetime.now().strftime("%d_%m_%Y-%H_%M_%S")
        self.callbacks = self.get_callbacks(save_checkpoints)
        self.model = self.get_model(outputs)

    def get_run_folder(self):
        run_folder = "runs/%s" % self.run_name
        try:
            os.mkdir(run_folder)
        except:
            pass
        return run_folder

    def get_checkpoint_folder(self):
        return self.get_run_folder() + "/checkpoints/cp.ckpt"

    def get_callbacks(self, save_checkpoints):
        """
        Callbacks passed to the model during tranining.
        The model will call these before and after each batch.
        """
        if save_checkpoints:
            cp_callback = tf.keras.callbacks.ModelCheckpoint(
                filepath=self.get_checkpoint_folder(),
                save_weights_only=True,
                verbose=1)
            return [cp_callback]

        else:
            return []

    def get_model(self, outputs):
        """Model structure compiled here in concrete subclasses"""
        pass

    def fit(self, train_generator, validation_generator, columns, epochs=30, verbose=True):
        """Trains the model"""
        self.columns = columns
        STEP_SIZE_TRAIN = train_generator.n//train_generator.batch_size
        STEP_SIZE_VALID = validation_generator.n//validation_generator.batch_size
        start_time = time.time()
        self.history = self.model.fit(
            train_generator,
            steps_per_epoch=STEP_SIZE_TRAIN,
            validation_steps=STEP_SIZE_VALID,
            validation_data=validation_generator,
            epochs=epochs,
            callbacks=self.callbacks)
        if verbose:
            with open(self.get_run_folder()+'/runtime.txt', 'w') as file:
                file.write("--- %.2f seconds ---" % (time.time() - start_time))

    def plot_training(self, save_to_File=True):
        """
        Plot the training history after training.
        This shows the accuracy and loss of the
        training and validation data.
        Adapted from https://www.tensorflow.org/tutorials/images/classification#visualize_training_results
        """
        history = self.history
        if history is None:
            raise Exception("Model has not been trained.")
        try:
            acc = history.history['accuracy']
            val_acc = history.history['val_accuracy']
        except:
            acc = history.history['acc']
            val_acc = history.history['val_acc']

        loss = history.history['loss']
        val_loss = history.history['val_loss']

        plt.figure(figsize=(8, 8))
        plt.subplot(1, 2, 1)
        plt.plot(acc, label='Training Accuracy')
        plt.plot(val_acc, label='Validation Accuracy')
        plt.legend(loc='lower right')
        plt.title('Training and Validation Accuracy')

        plt.subplot(1, 2, 2)
        plt.plot(loss, label='Training Loss')
        plt.plot(val_loss, label='Validation Loss')
        plt.legend(loc='upper right')
        plt.title('Training and Validation Loss')
        if save_to_File:
            from os import makedirs
            output_dir = self.get_run_folder() + '/training_graphs/'
            try:
                makedirs(output_dir)
            except:
                pass
            filename = datetime.now().strftime("%d_%m_%Y-%H_%M_%S")+".png"
            plt.savefig(output_dir + filename)

            with open(output_dir + "data.csv", "w") as csvfile:
                writer = csv.writer(csvfile)
                writer.writerow(["epoch", "accuracy", "val_accuracy"])
                for epoch, accuracy, valAccuracy in zip(range(len(acc)), acc, val_acc):
                    writer.writerow([epoch, accuracy, valAccuracy])
        else:
            plt.show()

    def evaluate(self, test_generator, file_name=None, save_to_File=True):
        test_generator.reset()

        evaluation = self.model.evaluate(
            test_generator, verbose=0)
        if save_to_File:
            if file_name is None:
                with open("%s/accuracy.txt" % self.get_run_folder(), 'w') as file:
                    file.write(
                        ' '.join([str(i) for i in zip(self.model.metrics_names, evaluation)]))
            else:
                with open("%s/accuracy_%s.txt" % (self.get_run_folder(), file_name), 'w') as file:
                    file.write(
                        ' '.join([str(i) for i in zip(self.model.metrics_names, evaluation)]))

        return evaluation

    def confusion_matrix(self, test_generator, file_name=None, save_to_File=True):
        """Save a confusion matrix for the model based on the test data."""
        test_generator.reset()
        labels = test_generator.labels
        pred = self.model.predict(test_generator)
        pred_bool = (pred > 0.5)
        predictions = pred_bool.astype(int)

        # Gender Confusion matrix
        labelsGender = [item[0] for item in labels]
        predictionsGender = [item[0] for item in predictions]
        genderCf = confusion_matrix(labelsGender, predictionsGender)

        # Age Confusion matrix
        labelsAge = [item[1:] for item in labels]
        predictionsAge = [item[1:] for item in predictions]
        ageCf = confusion_matrix(np.argmax(
            labelsAge, axis=1), np.argmax(predictionsAge, axis=1))

        if save_to_File:
            folder = self.get_run_folder()
            if file_name is not None:
                folder = "%s/%s" % (folder, file_name)
            try:
                os.mkdir(folder)
            except:
                pass
            pd.DataFrame(ageCf).to_csv("%s/ageCm.csv" % folder, index=False, header=False)
            pd.DataFrame(genderCf).to_csv("%s/genderCm.csv" %
                                          folder, index=False, header=False)
            plt.figure()
            plot_confusion_matrix(
                ageCf, classes=["senior", "adult", "child"])
            plt.savefig("%s/ageCm.png" % folder)
            plt.figure()
            plot_confusion_matrix(genderCf, classes=["Male", "Female"])
            plt.savefig("%s/genderCm.png" % folder)

        return genderCf, ageCf

    def load_weights(self):
        try:
            self.model.load_weights(self.get_checkpoint_folder())
        except:
            print("No checkpoint found")

    def save(self):
        try:
            os.mkdir(self.get_run_folder())
            self.model.save(self.get_run_folder()+'/model')
        except:
            self.model.save(self.get_run_folder() + '/model')

    def predict(self,filename, columns=["gender","senior", "adult", "child"]):
        np_image = Image.open(filename)
        np_image = np.array(np_image).astype('float32')/255
        np_image = transform.resize(np_image, (IMG_WIDTH, IMG_HEIGHT, 3))
        np_image = np.expand_dims(np_image, axis=0)
        pred = self.model.predict(np_image)
        pred_bool = (pred > 0.5)
        result = []
        i = 0
        ages = columns[1:]
        while i < len(pred_bool[0]):
            prediction = pred_bool[0][i]
            if columns[i] == "gender":
                if prediction:
                    result.append("female")
                else:
                    result.append("male")
                i += 1
            elif columns[i] in ages:
                age_bools = pred_bool[0][1:5]
                most_likely_age_i = np.argmax(age_bools)
                result.append(ages[most_likely_age_i])
                i += 4
            elif prediction:
                result.append(columns[i])
                i += 1

        return result
