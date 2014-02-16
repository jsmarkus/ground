/*global Ground, Promise*/
main();

function main() {
  var app = new Ground();

  app.use(function (req, res) {
    console.log('one', req, res);
    return new Promise(function (next) {
      setTimeout(next, 1000);
    });
  });

  app.use(function (req, res) {
    console.log('two', req, res);
  });

  app.use(new Ground.Router(app));

  app.method('test', function(req, res) {
    console.log('test', req, res);
  });

  app.dispatchMessage('test', {}, {}, function() {
    console.log('responded', arguments);
  });
  app.dispatchMessage('foo', {}, {}, function() {
    console.log('responded', arguments);
  });
}

// var p = new Promise(function(resolve, reject) {
//   resolve();
// });

// p.then(function() {
//   console.log('one');
// }).then(function() {
//   var t = new Promise(function(resolve) {
//     setTimeout(resolve, 1000)
//   });
//   console.log('two');
//   return t;
// }).then(function() {
//   console.log('three');
// });