import sys
import time
from pandas import *
from mongo_utils import *


start = time.time()

db_name = 'cities'
city = sys.argv[1]

# Read dirty data from DB.
df = pd.read_csv('../static/data/%s.csv' % city)

# Use lowercase column headers.
df.columns = [x.lower() for x in df.columns]

# Show which fields are missing.
df.replace('', np.nan, inplace=True)
keys = list(df.columns.values)
vals = list(df.isnull().sum())
map = dict(zip(keys, vals))
map = {k: v for k, v in map.items() if v > 0}
print('\nColumns with missing values:')
for key in map:
    print(key)

# Tag missing fields with sentinel.
df.fillna(-1, inplace=True)

# Convert all elements to object (string) types.
df = df.applymap(str)

# Perform numeric conversions.
df['latitude'] = pd.to_numeric(df['latitude'])
df['longitude'] = pd.to_numeric(df['longitude'])

# Filter for coordinates outside LA.
fields_before = len(df)
df = df[((df.latitude > 32) & (df.latitude < 34))]
df = df[((df.longitude < -117) & (df.longitude > -119))]
fields_after = len(df)
print('\nNumber of invalid lat/lng coordinates: %d\n' % (fields_before - fields_after))

# Construct the 'datetime' column.
df['collision_time'] = df.collision_time.str.zfill(4)
df['datetime'] = df.collision_date + " " + df.collision_time
df['datetime'] = df.datetime.str[:-2] + ":" + df.datetime.str[-2:]
df['datetime'] = df.datetime.str[:4] + "/" + df.datetime.str[4:]
df['datetime'] = df.datetime.str[:7] + "/" + df.datetime.str[7:]
df = df[df.datetime.str[-5:] < "24:00"]
df['datetime'] = pd.to_datetime(df.datetime)

# Zero pad the 'pcf_violation_category' columns
df['pcf_violation_category'] = df.collision_time.str.zfill(2)

# Delete dirty data.
db = get_mongo_database(db_name)
db[city].drop()

# Write clean data to DB.
dataframe_to_mongo(df, 'cities', city)
print("Number of records written: %d\n" % len(df))

# Output time, to prevent regressions.
stop = time.time()
print("Script duration: %.1f s\n" % (stop - start))
