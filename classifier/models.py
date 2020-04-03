from binary_model import BinaryModel
from multiclass_model import MulticlassCNNModel, MulticlassNNModel, MulticlassCNNDropoutModel, MulticlassCNNReluActivationDropoutModel, CNN6LayerModel, CNN4LayerModel, VGGLikeModel

def get_model(model, run_name):
    if model == "binary":
        return BinaryModel(run_name=run_name)
    elif model == "nn":
       return MulticlassNNModel(outputs=4, run_name=run_name)
    elif model == "cnn":
        return MulticlassCNNModel(outputs=4, run_name=run_name)
    elif model == "dropout":
        return MulticlassCNNDropoutModel(outputs=4, run_name=run_name)
    elif model == "6layer":
        return CNN6LayerModel(outputs=4, run_name=run_name)
    elif model == "4layer":
        return CNN4LayerModel(outputs=4, run_name=run_name)
    elif model == "vgglike":
        return VGGLikeModel(outputs=4, run_name=run_name)
    elif model == "reludropout":
        return MulticlassCNNReluActivationDropoutModel(output=4, run_name=run_name)
    else:
        return MulticlassCNNReluActivationDropoutModel(outputs=4, run_name=run_name)
