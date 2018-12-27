def generate_json(path, startIt, endIt):
    f = open(path, 'w+')
    s = '{"root":{"images":["img' + '{:04}'.format(startIt) + '.jpg"'
    for it in range(startIt + 1, endIt):
        s += ',"img' + '{:04}'.format(it) + '.jpg"'
    s += r']}}'
    f.write(s)
    f.close()


generate_json(r'D:\Users\krami\Documents\Git\d-gallery\firebase-database.json', 1, 331)
