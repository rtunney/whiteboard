from flask import Flask, render_template, send_from_directory
app = Flask(__name__)

@app.route('/')
def start():
    return render_template('index.html')

@app.route('/favicon.ico')
def get_icon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico')

if __name__ == '__main__':
    app.run(debug=True)