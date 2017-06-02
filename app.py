import os
from flask import Flask

app = Flask(__name__)
app.config.from_object(app.config)
# app.config.from_envvar('APP_SETTINGS')
#app.config.from_envvar('APP_SETTINGS')
# app.config.from_pyfile('config.py')

@app.route('/')
def hello():
    return os.environ['APP_SETTINGS']

@app.route('/<name>')
def hello_name(name):
    return "Hello {}!".format(name)

if __name__ == '__main__':
    app.run()

print(os.environ['APP_SETTINGS'])
# print(__name__)
# print(basedir)
