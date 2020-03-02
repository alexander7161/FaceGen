import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Conv2D, Flatten, Dropout, MaxPooling2D
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os
import numpy as np
import matplotlib.pyplot as plt
from model import create_model
import constants

os.environ['KMP_DUPLICATE_LIB_OK'] = 'True'

cp_callback = tf.keras.callbacks.ModelCheckpoint(filepath=constants.checkpoint_path,
                                                 save_weights_only=True,
                                                 verbose=1)


script_dir = os.path.dirname(__file__)
PATH = os.path.join(script_dir, "face_data")

train_dir = os.path.join(PATH, 'train')
validation_dir = os.path.join(PATH, 'validation')

train_male_dir = os.path.join(train_dir, 'male')
train_female_dir = os.path.join(train_dir, 'female')
validation_male_dir = os.path.join(validation_dir, 'male')
validation_female_dir = os.path.join(validation_dir, 'female')

num_male_tr = len(os.listdir(train_male_dir))
num_female_tr = len(os.listdir(train_female_dir))

num_male_val = len(os.listdir(validation_male_dir))
num_female_val = len(os.listdir(validation_female_dir))

total_train = num_male_tr + num_female_tr
total_val = num_male_val + num_female_val


print('total training male images:', num_male_tr)
print('total training female images:', num_female_tr)

print('total validation male images:', num_male_val)
print('total validation female images:', num_female_val)
print("--")
print("Total training images:", total_train)
print("Total validation images:", total_val)


train_image_generator = ImageDataGenerator(
    rescale=1./255)  # Generator for our training data
validation_image_generator = ImageDataGenerator(
    rescale=1./255)  # Generator for our validation data

train_data_gen = train_image_generator.flow_from_directory(batch_size=constants.batch_size,
                                                           directory=train_dir,
                                                           shuffle=True,
                                                           target_size=(
                                                               constants.IMG_HEIGHT, constants.IMG_WIDTH),
                                                           class_mode='binary')

val_data_gen = validation_image_generator.flow_from_directory(batch_size=constants.batch_size,
                                                              directory=validation_dir,
                                                              target_size=(
                                                                  constants.IMG_HEIGHT, constants.IMG_WIDTH),
                                                              class_mode='binary')

sample_training_images, _ = next(train_data_gen)
# This function will plot images in the form of a grid with 1 row and 5 columns where images are placed in each column.


model = create_model()

history = model.fit_generator(
    train_data_gen,
    steps_per_epoch=total_train // constants.batch_size,
    epochs=constants.epochs,
    validation_data=val_data_gen,
    validation_steps=total_val // constants.batch_size,
    callbacks=[cp_callback]
)

os.mkdir('saved_model')
model.save('saved_model/my_model')

acc = history.history['acc']
val_acc = history.history['val_acc']

loss = history.history['loss']
val_loss = history.history['val_loss']

epochs_range = range(constants.epochs)

plt.figure(figsize=(8, 8))
plt.subplot(1, 2, 1)
plt.plot(epochs_range, acc, label='Training Accuracy')
plt.plot(epochs_range, val_acc, label='Validation Accuracy')
plt.legend(loc='lower right')
plt.title('Training and Validation Accuracy')

plt.subplot(1, 2, 2)
plt.plot(epochs_range, loss, label='Training Loss')
plt.plot(epochs_range, val_loss, label='Validation Loss')
plt.legend(loc='upper right')
plt.title('Training and Validation Loss')
plt.show()
