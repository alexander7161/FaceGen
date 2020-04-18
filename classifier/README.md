# Classifier

The classifiers developed in this project were trained on the Rosalind HPC cluster.

## Models

The models available are:

- binary
- nn
- cnn
- dropout
- 6layer
- 4layer
- vgglike
- reludropout

The default model is reludropout

## Training

To train the model:

```
python3 train.py
```

Choose a model with:

```
python3 train.py -m 6layer
```

Choose the number of training epochs with:

```
python3 train.py -e 30
```

Run name will default to the current date. Can be set with:

```
python3 train.py -n test
```

## Testing

For testing a trained model. Be sure to include a run name to load the model.

Ouputs an accuracy for the model on the testing dataset.
Outputs confusion matricies for classes.

```
python3 test.py -n test
```

## Classification

Outputs the prediction from the loaded model

```
python3 classify.py -n test
```

## K-fold Cross Validation

Outputs the mean and standard deviation of the accuracies of the k-fold cross validation.
K is 10 by default.

```
python3 classify.py -n test -k 10
```

## Convert to TensorFlowJS

Converts model from run name to TensorFlowJS.

```
python3 convertToTFJS.py -n test
```

### SBatch HPC Training

Commands for training on the King's HPC inspired by https://rosalind.kcl.ac.uk/hpc/running_jobs/:

Training with GPU:

```
sbatch -p nms_research_gpu condatrainGPU.sh
```

Training with CPU:

```
sbatch -p nms_research condatrain.sh
```

Testing with CPU:

```
sbatch -p nms_research condatest.sh
```

Cross validation with CPU:

```
sbatch -p nms_research condaCrossValidation.sh
```

Read end of run log:

```
tail /scratch/users/{userId}/124538.out
```
