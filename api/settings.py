
MONGO_QUERY_BLACKLIST = ['$where'] # '$regex' blacklisted by default
HATEOAS = False
PAGINATION = False
URL_PREFIX = 'api'
MONGO_DBNAME = 'cities'
DOMAIN = { 'long_beach':{
    'schema':{
        'pcf_code_of_viol':{'type':'string'},
        'hit_and_run':{'type':'string'},
        'primary_coll_factor':{'type':'string'},
        'pcf_viol_category':{'type':'string'},
        'party_count':{'type':'string'},
        'longitude':{'type':'string'},
        'number_killed':{'type':'string'},
        'mviw':{'type':'string'},
        'collision_time':{'type':'string'},
        'road_surface':{'type':'string'},
        'collision_severity':{'type':'string'},
        'latitude':{'type':'string'},
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

