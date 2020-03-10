#!/bin/bash -l                                                                                    
#SBATCH --output=/scratch/users/%u/%j.out
#SBATCH --job-name=train
#SBATCH --gres=gpu
cd ~/FaceGen/classifier/
module load libs/cuda
module load libs/cudnn
module load devtools/python/3.6.9
echo "Hello, World! From $HOSTNAME"
nvidia-debugdump -l
nvcc --version
source env/bin/activate
python3 train.py --m -e 150
deactivate