# Know Crash
from flask import Flask, send_from_directory

app = Flask(__name__)

# Direct the web traffic
@app.route('/')
def root():
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    app.run()
