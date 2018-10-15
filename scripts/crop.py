from PIL import Image
import glob
import os


def crop_image(path, outputPath):
    im = Image.open(path)
    size = im.size
    if size[0] < 1024 and size[1] < 1024:
        raise Exception('Image too small')
    box = (
        round(size[0] / 2) - 512,
        round(size[0] / 2) - 512,
        round(size[0] / 2) + 512,
        round(size[0] / 2) + 512
    )
    region = im.crop(box)
    region.save(outputPath)


def crop_images(startPath):
    os.chdir(startPath)
    for filename in glob.iglob('*.jpg'):
        outputPath = 'cropped\\' + filename
        crop_image(filename, outputPath)

crop_images(r'D:\Users\krami\Pictures\d-gallery')
