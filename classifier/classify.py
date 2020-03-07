from multiclass_model import MulticlassModel

model = MulticlassModel(test=2)
model.load_weights()
print(model.predict(
    "./face_data/female_child/users_reHt5vV4soc2BtN5cYUJpSgUClk1_faces_j01CqhtFIME8vn4w3VPM.jpg"))
