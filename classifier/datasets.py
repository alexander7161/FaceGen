import pandas as pd


def get_dataset(name, feature="gender"):
    if name == "ffhq":
        train_df = pd.read_csv("./face_data/labels.csv", header=0)
        train_df[feature] = train_df[feature].astype('str')
        return train_df
    elif name == "celeba":
        import tensorflow_datasets as tfds
        celeba_data = tfds.load("celeb_a")
        celeba_train, celeba_test, celeba_validation = celeba_data[
            "train"], celeba_data["test"], celeba_data["validation"]
        return celeba_train, celeba_test, celeba_validation
