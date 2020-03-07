import pandas as pd
import os
import constants
from tensorflow.keras.preprocessing.image import ImageDataGenerator


def get_dataset(name, batch_size, feature="gender"):
    train_datagen = ImageDataGenerator(rescale=1./255,
                                       shear_range=0.2,
                                       zoom_range=0.2,
                                       horizontal_flip=True,
                                       validation_split=0.15)
    test_datagen = ImageDataGenerator(rescale=1./255)

    if name == "ffhq":
        train_df = pd.read_csv("./face_data/age_gender/labels.csv", header=0)
        train_df[feature] = train_df[feature].astype('str')
        train_generator = train_datagen.flow_from_dataframe(
            dataframe=train_df,
            directory="face_data/age_gender",
            x_col="filename",
            y_col=feature,
            target_size=(
                constants.IMG_HEIGHT, constants.IMG_WIDTH),
            batch_size=batch_size,
            class_mode='binary',
            subset='training')

        validation_generator = train_datagen.flow_from_dataframe(
            dataframe=train_df,
            directory="face_data",
            x_col="filename",
            y_col=feature,
            target_size=(
                constants.IMG_HEIGHT, constants.IMG_WIDTH),
            batch_size=batch_size,
            class_mode='binary',
            subset='validation')
        return train_generator, validation_generator

    elif name == "ffhqmulticlass":
        train_df = pd.read_csv("./face_data/age_gender/labels.csv", header=0)
        train_df = pd.concat([pd.DataFrame([pd.to_numeric(train_df[e], errors='coerce')
                                            for e in train_df.columns if e not in ['filename']]).T,
                              train_df[['filename']]], axis=1)
        columns = ["gender", "child", "teen", "adult", "senior"]
        # for columns in columns:
        #     train_df[columns] = train_df[columns].astype('str')

        print(train_df.info())
        train_generator = train_datagen.flow_from_dataframe(
            dataframe=train_df,
            directory="./face_data/age_gender",
            x_col="filename",
            y_col=columns,
            target_size=(
                constants.IMG_HEIGHT, constants.IMG_WIDTH),
            batch_size=batch_size,
            class_mode='raw',
            subset='training',
            shuffle=True,
            seed=1)

        validation_generator = train_datagen.flow_from_dataframe(
            dataframe=train_df,
            directory="./face_data/age_gender",
            x_col="filename",
            y_col=columns,
            target_size=(
                constants.IMG_HEIGHT, constants.IMG_WIDTH),
            batch_size=batch_size,
            class_mode='raw',
            subset='validation',
            shuffle=True,
            seed=1)

        test_df = pd.read_csv(
            "./face_data/age_gender_test/labels.csv", header=0)
        test_df = pd.concat([pd.DataFrame([pd.to_numeric(test_df[e], errors='coerce')
                                           for e in test_df.columns if e not in ['filename']]).T,
                             test_df[['filename']]], axis=1)
        print(test_df.info())
        test_generator = test_datagen.flow_from_dataframe(
            dataframe=test_df,
            directory="./face_data/age_gender_test",
            x_col="filename",
            y_col=columns,
            target_size=(
                constants.IMG_HEIGHT, constants.IMG_WIDTH),
            batch_size=batch_size,
            class_mode='raw',
            shuffle=False,
            seed=1)

        return train_generator, validation_generator, test_generator
    elif name == "celeba":
        # try:
        #     import tensorflow_datasets as tfds
        #     checksum_dir = os.path.join(
        #         os.path.dirname(__file__), 'checksums/')
        #     checksum_dir = os.path.normpath(checksum_dir)
        #     tfds.download.add_checksums_dir(checksum_dir)

        #     celeba_data = tfds.load("celeb_a")
        #     celeba_train, celeba_test, celeba_validation = celeba_data[
        #         "train"], celeba_data["test"], celeba_data["validation"]
        #     return celeba_train, celeba_test, celeba_validation
        # except:
        train_df = pd.read_csv(
            "./celeba-dataset/list_attr_celeba.csv", header=0, dtype=str)
        columns = ["Male", "Black_Hair", "Blond_Hair", "Eyeglasses"]
        train_df = pd.concat([pd.DataFrame([pd.to_numeric(train_df[e], errors='coerce')
                                            for e in train_df.columns if e not in ['image_id']]).T,
                              train_df[['image_id']]], axis=1)
        train_df['image_id'] = train_df['image_id'].astype('str')
        train_df['Black_Hair'] = train_df['Black_Hair'].astype('str')

        train_generator = train_datagen.flow_from_dataframe(
            dataframe=train_df[:1000],
            directory="celeba-dataset/img_align_celeba/img_align_celeba",
            x_col="image_id",
            y_col=columns[1],
            target_size=(
                constants.IMG_HEIGHT, constants.IMG_WIDTH),
            batch_size=batch_size,
            class_mode='binary',
            subset='training')

        validation_generator = train_datagen.flow_from_dataframe(
            dataframe=train_df[:1000],
            directory="celeba-dataset/img_align_celeba/img_align_celeba",
            x_col="image_id",
            y_col=columns[1],
            target_size=(
                constants.IMG_HEIGHT, constants.IMG_WIDTH),
            batch_size=batch_size,
            class_mode='binary',
            subset='validation')

        return train_generator, validation_generator
