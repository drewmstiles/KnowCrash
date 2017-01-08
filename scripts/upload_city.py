import sys
import csv
import json
from mongo_utils import *

city = sys.argv[1]

with open('%s.csv' % city) as fin,\
     open('%s_clean.csv' % city, 'w') as fout:
    reader = csv.reader(fin)
    writer = csv.writer(fout)
    header = next(reader)
    header = [field.lower() for field in header]
    writer.writerow(header)
    for row in reader:
        writer.writerow(row)

with open('%s_clean.csv' % city) as f:
    reader = csv.DictReader(f)
    accidents = list(reader)
    db = get_mongo_database('cities')
    coll = db[city]
    coll.insert(accidents)
