import sys
import csv
import json
from pymongo import MongoClient

def get_mongo_database(db_name, host='localhost', port=27017,\
                       username=None,password=None):
    if username and password:
        mongo_uri = 'mongodb://%s:%s@%s/%s'%\
                    (username, password, host, db_name)
        conn = MongoClient(mongo_url)
    else:
        conn = MongoClient(host, port)
    return conn[db_name]

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
