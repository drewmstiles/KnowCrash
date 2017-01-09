from flask import Flask
from flask import request

app = Flask(__name__)

@app.route('/')
def home_page():
    city = request.args.get('city')
    with open('static/data/%s.csv' % city) as f:
        city_meta = json.load(f);
        return render_template('index.html',
                               
        
    
    
