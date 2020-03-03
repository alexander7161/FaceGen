batch_size = 2
epochs = 50
IMG_HEIGHT = 150
IMG_WIDTH = 150


def get_checkpoint_path(feature):
    return "checkpoints"+feature+"/cp.ckpt"
