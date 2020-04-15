from datasets import get_testing_data

datasets = ["ffhq", "ffhqgenerated", "overall"]
"""
Evaluate model on all testing datasets.
"""
def evaluate_model(model):
    for dataset in datasets:
        test_generator, columns = get_testing_data(dataset)
        evaluation = model.evaluate(test_generator, dataset)
        print(evaluation)
        genderCf, ageCf = model.confusion_matrix(test_generator, dataset)
        print(genderCf)
        print(ageCf)