```
python3 train.py -m -t 1
```


```
sbatch -p nms_research_gpu condatrainGPU.sh
cat /scratch/users/k1761218/124538.out
```

```
sbatch -p nms_research condatest.sh
```

```
sbatch -p nms_research condatrain.sh
```