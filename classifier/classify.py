from multiclass_model import MulticlassMultiLabelModel

"""
Classify a single image file from the filesystem.
"""

parser = ArgumentParser()
parser.add_argument('--runname', '-n', dest='run_name',
                    type=str,
                    help='Name for this run, will otherwise not try to load model.')
parser.add_argument('--file', '-f', dest='file',
                    type=str, default="./face_data/female_senior/users_reHt5vV4soc2BtN5cYUJpSgUClk1_faces_4kbr2K6XTV8UmNXvEDkF.jpg",
                    help='File to test')
parser.add_argument('--m', '-m', dest='model',
                    type=str, default="cnn",
                    help='declare what model to use.')


args = parser.parse_args()

model = MulticlassMultiLabelModel(
    epochs=1,  batch_size=1, run_name=args.run_name)
model.load_weights()
print(model.predict(args.file))
