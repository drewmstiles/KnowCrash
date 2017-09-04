from flask import Flask, render_template, request

app = Flask(__name__)

factor_map = {
	'0': 'Unknown',
	'1': 'Driving or Bicycling Under the Influence of Alcohol or Drug',
	'2': 'Impeding Traffic',
	'3': 'Unsafe Speed',
	'4': 'Following Too Closely',
	'5': 'Wrong Side of Road',
	'6': 'Improper Passing',
	'7': 'Unsafe Lane Change',
	'8': 'Improper Turning',
	'9': 'Automobile Right of Way',
	'10': 'Pedestrian Right of Way',
	'11': 'Pedestrian Violation',
	'12': 'Traffic Signals and Signs',
	'13': 'Hazardous Parking',
	'14': 'Lights',
	'15': 'Brakes',
	'16': 'Other Equipment',
	'17': 'Other Hazardous Violation',
	'18': 'Other Than Driver (or Pedestrian)',
	'21': 'Unsafe Starting or Backing',
	'22': 'Other Improper Driving',
	'23': 'Pedestrian or "Other" Under the Influence of Alcohol or Drug',
	'24': 'Fell Asleep'
}

severity_map = {
	'0': 'No Injury',
	'1': 'Fatal',
	'2': 'Severe',
	'3': 'Visible',
	'4': 'Complaint'
}

@app.route('/')
def home_page():
    return render_template('index.html',
                           severity_opts=severity_map,
                           factor_opts=factor_map)

if __name__ == '__main__':
    app.run(port=800, debug=True)
