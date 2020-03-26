from datasets import load_csv
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import constants
import numpy as np
import random
import pandas as pd
import multiprocessing as mp

# Class for cross validation


class CrossVal(object):

    # Shuffle data using random
    def shuffleData(self, data):
        return data.sample(frac=1).reset_index(drop=True)

    # Splits data into K splits with k folds.
    def createSplits(self, shuffledData, folds):
        # Split list x into k lists
        def foldList(x, k):
            return [x.loc[i::k] for i in range(k)]

        splits = foldList(shuffledData, folds)

        return splits

    def getSplit(self, i, splits):
            # Copy folds to temporary variable.
        splitsCopy = splits[:]
        # Take the ith fold as test data.
        test = splitsCopy[i]
        # Remove test data from folds.
        splitsCopy.pop(i)
        # concat the remaining data as training data.
        train = pd.concat(splitsCopy)

        return train, test

    # Take ith fold as test data.
    # Train a classifier with the remaining data.
    # return the accuracy of the given classifier.
    def getAccuracy(self, classifier, i, splits, columns, epochs, run_name):
        train, test = self.getSplit(i, splits)

        datagen = ImageDataGenerator(rescale=1./255,
                                     shear_range=0.2,
                                     zoom_range=0.2,
                                     horizontal_flip=True)

        batch_size = 32

        train_generator = datagen.flow_from_dataframe(
            dataframe=train,
            directory="./face_data/age_gender",
            x_col="filename",
            y_col=columns,
            target_size=(
                constants.IMG_HEIGHT, constants.IMG_WIDTH),
            batch_size=batch_size,
            class_mode='raw',
            seed=1)

        validation_generator = datagen.flow_from_dataframe(
            dataframe=test,
            directory="./face_data/age_gender",
            x_col="filename",
            y_col=columns,
            target_size=(
                constants.IMG_HEIGHT, constants.IMG_WIDTH),
            batch_size=batch_size,
            class_mode='raw',
            seed=1)

        c = classifier(outputs=4, run_name=run_name, save_checkpoints=False)
        # Train classifier on training data.
        c.fit(train_generator, validation_generator, columns, epochs)
        # Get accuracy for the test data.
        accuracy = c.evaluate()
        return accuracy

    # Perfoms K-fold cross validation on the provided data and classifier.
    def trainTestSplit(self, classifier, run_name, epochs=30, folds=10):

        ffhq_data, columns = load_csv("./face_data/age_gender/labels.csv")

        shuffledData = self.shuffleData(ffhq_data)

        # Split data into K folds
        splits = self.createSplits(shuffledData, folds)

        # Collect accuracies for each fold.
        accuracies = [self.getAccuracy(classifier, i, splits, columns, epochs, run_name+i)
                      for i in range(folds)]

        pool = mp.Pool(mp.cpu_count())
        print("Number of processors: ", mp.cpu_count())

        results = pool.map(self.getAccuracy, [
                           (classifier, i, splits, columns, epochs) for i in range(folds)])

        pool.close()

        # Compute mean accuracy.
        accuracy = np.mean(accuracies)
        return accuracy
