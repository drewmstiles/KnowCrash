
X_DOMAINS = 'http://localhost:8000'
PUBLIC_METHODS = ['GET']
PUBLIC_ITEM_METHODS = ['GET']
MONGO_QUERY_BLACKLIST = ['$where'] # '$regex' blacklisted by default
HATEOAS = True
PAGINATION = True
PAGINATION_LIMIT = 1000;
PAGINATION_DEFAULT = 1000;
URL_PREFIX = 'api'
MONGO_DBNAME = 'cities'
DOMAIN = { 'long_beach':{
    'schema':{
        'datetime':{'type':'datetime'},
        'pcf_code_of_viol':{'type':'string'},
        'hit_and_run':{'type':'string'},
        'primary_coll_factor':{'type':'string'},
        'pcf_viol_category':{'type':'string'},
        'party_count':{'type':'string'},
        'longitude':{'type':'float'},
        'number_killed':{'type':'string'},
        'mviw':{'type':'string'},
        'collision_time':{'type':'string'},
        'road_surface':{'type':'string'},
        'collision_severity':{'type':'string'},
        'latitude':{'type':'float'},
        'type_of_collision':{'type':'string'},
        'collision_date':{'type':'string'},
        'secondary_rd':{'type':'string'},
        'road_cond_1':{'type':'string'},
        'weather_1':{'type':'string'},
        'lighting':{'type':'string'},
        'intersection':{'type':'string'},
        'alcohol_involved':{'type':'string'},
        'control_device':{'type':'string'},
        'number_injured':{'type':'string'},
        'day_of_week':{'type':'string'},
        'primary_rd':{'type':'string'},
    }
}}

