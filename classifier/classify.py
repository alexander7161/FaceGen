from model import create_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import constants
import os

script_dir = os.path.dirname(__file__)
PATH = os.path.join(script_dir, "face_data")


validation_dir = os.path.join(PATH, 'validation')


validation_image_generator = ImageDataGenerator(
    rescale=1./255)  # Generator for our validation data

val_data_gen = validation_image_generator.flow_from_directory(batch_size=constants.batch_size,
                                                              directory=validation_dir,
                                                              target_size=(
                                                                  constants.IMG_HEIGHT, constants.IMG_WIDTH),
                                                              class_mode='binary')

model = create_model()

# Loads the weights
model.load_weights(constants.checkpoint_path)

# Re-evaluate the model
loss, acc = model.evaluate_generator(val_data_gen, verbose=2)
print("Restored model, accuracy: {:5.2f}%".format(100*acc))
