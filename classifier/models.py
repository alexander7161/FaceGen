from binary_model import BinaryModel
from multiclass_model import MulticlassCNNModel, MulticlassNNModel, MulticlassCNNDropoutModel, MulticlassCNNOptimisedModel,CNN6LayerModel

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
    else:
        return MulticlassCNNOptimisedModel(outputs=4, run_name=run_name)
