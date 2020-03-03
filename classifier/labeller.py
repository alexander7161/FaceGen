from argparse import ArgumentParser
import os
import sys
import subprocess
import matplotlib.pyplot as plt
import matplotlib.image as mpimg


parser = ArgumentParser()
parser.add_argument("folder",
                    help="folder to get images from", metavar="FOLDER")


def main():
    args = parser.parse_args()
    PATH = os.path.dirname(__file__)
    images_path = os.path.join(PATH, args.folder)
    imgs = []
    valid_images = [".jpg", ".gif", ".png", ".tga"]
    for f in os.listdir(images_path):
        ext = os.path.splitext(f)[1]
        if ext.lower() not in valid_images:
            continue
        imgs.append(os.path.join(images_path, f))

    print(str(len(imgs))+" images found.")
    if len(imgs) == 0:
        return
    for image in imgs:
        matplotimg = mpimg.imread(image)
        iimgplot = plt.imshow(matplotimg)
        plt.show(block=False)
        label = str(input("Gender(0/1)Age(y/m/o)"))
        if label == "quit":
            sys.exit(0)
        print(label)


main()
