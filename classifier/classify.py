from multiclass_model import MulticlassModel

model = MulticlassModel(test=6)
model.load_weights()
print(model.predict(
    "./face_data/female_senior/users_reHt5vV4soc2BtN5cYUJpSgUClk1_faces_4kbr2K6XTV8UmNXvEDkF.jpg"))
