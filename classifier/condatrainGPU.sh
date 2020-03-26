#!/bin/bash -l                                                                                    
#SBATCH --output=/scratch/users/%u/%j.out
#SBATCH --job-name=trainGPU
#SBATCH --gres=gpu
#SBATCH --mem=16000
#SBATCH --constrain=v100
#SBATCH --time=3-2:00
module load libs/cuda
module load devtools/anaconda/2019.3-python3.6.9
cd ~/FaceGen/classifier/
conda activate myenv36
python3 train.py -e 3000 -n optimised3000 -s
