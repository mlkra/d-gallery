import glob
import os


def rename(dir, pattern, startIt):
    it = startIt
    for pathAndFilename in glob.iglob(os.path.join(dir, pattern)):
        _, ext = os.path.splitext(os.path.basename(pathAndFilename))
        os.rename(pathAndFilename,
                  os.path.join(dir, 'img' + '{:04}'.format(it) + ext))
        it += 1


rename(r'D:\Users\krami\Pictures\d-gallery', '*.jpg', 1)
