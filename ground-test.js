/*global Ground, chrome*/

chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('test.html', {
        width: 300,
        height: 300
    });
});

var app = new Ground();

app.use(new Ground.Router(app));

app.method('test', function(req, res) {
    console.log('"test" called', req, res);
    res.send({
        foo: 42
    });
});

app.listen();