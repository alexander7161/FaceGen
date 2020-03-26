#!/bin/bash -l                                                                                    
#SBATCH --output=/scratch/users/%u/%j.out
#SBATCH --job-name=train
#SBATCH --mem=16000
#SBATCH --time=6-2:00
module load devtools/anaconda/2019.3-python3.6.9
cd ~/FaceGen/classifier/
conda activate myenv36
python3 train.py -e 600 -n dropout600 -s -m dropout
