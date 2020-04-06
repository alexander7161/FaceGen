#!/bin/bash -l                                                                                    
#SBATCH --output=/scratch/users/%u/%j.out
#SBATCH --job-name=crossvalidation
#SBATCH --mem=16000
#SBATCH --time=6-2:00
module load devtools/anaconda/2019.3-python3.6.9
cd ~/FaceGen/classifier/
conda activate myenv36
python3 crossValidation.py -e 300 -n optimised300-2 -m optimised
