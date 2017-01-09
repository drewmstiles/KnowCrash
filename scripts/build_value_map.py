import sys
from pprint import pprint

with open('%s.txt' % sys.argv[1]) as f:
        lines = f.readlines()
        value_map = {}
        for line in lines:
                tokens = line.split("-")
                key = tokens[0].strip()
                val = tokens[1].strip()
                value_map[key] = val
        pprint(value_map)
