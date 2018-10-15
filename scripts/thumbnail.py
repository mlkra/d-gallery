from PIL import Image
import os
import glob

size = (256, 256)


def generate_thumbnail(inputPath, outputPath):
    im = Image.open(inputPath)
    im.thumbnail(size)
    im.save(outputPath)


def generate_thumbnails(startPath):
    os.chdir(startPath)
    for filename in glob.iglob('*.jpg'):
        outputPath = '..\\_thumb\\' + filename
        generate_thumbnail(filename, outputPath)


generate_thumbnails(r'D:\Users\krami\Pictures\d-gallery\cropped')
