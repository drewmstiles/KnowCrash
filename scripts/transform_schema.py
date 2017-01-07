import sys

city = sys.argv[1]

lines = ["'%s':{'type':'string'}," % l.rstrip('\n')\
         for l in open('%s_schema.txt' % city)]

with open('%s_schema.txt' % city, 'w') as fout:
    lines.insert(0, "'schema':{")
    lines.append('}')
    for l in lines:
        fout.write('%s\n' % l)
