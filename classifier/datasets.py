import pandas as pd
import os
import constants
from tensorflow.keras.preprocessing.image import ImageDataGenerator


def load_csv(csv_path):
    df = pd.read_csv(csv_path, header=0)
    columns = df.columns[1:]
    # Convert values to int.
    df = pd.concat([df[[df.columns[0]]], pd.DataFrame(
        [pd.to_numeric(df[e], errors='coerce') for e in columns]
    ).T], axis=1)
    columns = df.columns[1:]

    return df, columns


def get_train_datagen():
    train_datagen = ImageDataGenerator(rescale=1./255,
                                       shear_range=0.2,
                                       zoom_range=0.2,
                                       horizontal_flip=True,
                                       validation_split=0.15)
    return train_datagen


def get_test_datagen():
    test_datagen = ImageDataGenerator(rescale=1./255)
    return test_datagen


def get_ffhq_train(batch_size):
    train_datagen = get_train_datagen()
    ffhq_data, columns = load_csv("./face_data/age_gender/labels.csv")

    print(ffhq_data.info())

    train_generator = train_datagen.flow_from_dataframe(
        dataframe=ffhq_data,
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
        dataframe=ffhq_data,
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
    return train_generator, validation_generator


def get_ffhq_test(batch_size):
    test_datagen = get_test_datagen()

    ffhq_test_data, columns = load_csv(
        "./face_data/age_gender_test/labels.csv")

    print(ffhq_test_data.info())
    test_generator = test_datagen.flow_from_dataframe(
        dataframe=ffhq_test_data,
        directory="./face_data/age_gender_test",
        x_col="filename",
        y_col=columns,
        target_size=(
            constants.IMG_HEIGHT, constants.IMG_WIDTH),
        batch_size=batch_size,
        class_mode='raw',
        shuffle=False,
        seed=1)

    return test_generator


def get_celeba(batch_size):
    train_datagen = get_train_datagen()
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


def get_training_data(batch_size, dataset="ffhq"):
    if dataset == "celeba":
        return get_celeba(batch_size)
    else:
        return get_ffhq_train(batch_size)


def get_testing_data(batch_size, dataset="ffhq"):
    if dataset == "celeba":
        return get_celeba(batch_size)
    else:
        return get_ffhq_test(batch_size)
