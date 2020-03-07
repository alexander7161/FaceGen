from multiclass_model import MulticlassModel

model = MulticlassModel(test=3)
model.load_weights()
print(model.predict(
    "./face_data/male_adult/users_reHt5vV4soc2BtN5cYUJpSgUClk1_faces_dwEVNKYLGU2PExYSd0qG.jpg"))
