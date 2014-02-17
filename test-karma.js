/*global waitsFor, runs, jasmine, spyOn, beforeEach, chrome, Ground, describe, it, expect*/

// describe('Something', function() {
//     it('shoult do something', function() {
//         expect(1).toEqual(2);
//     });
// });



describe('Ground server', function() {
  var app;

  beforeEach(function() {
    app = new Ground();
  });

  it('should listen on messages', function() {
    spyOn(chrome.runtime.onMessage, 'addListener').andCallThrough();
    app.listen();
    expect(chrome.runtime.onMessage.addListener)
      .toHaveBeenCalled();
  });

  it('should process messages', function() {
    app.use(function(req, res) {
      res.send({
        hello: 'world'
      });
    });
    app.listen();

    var callback = jasmine.createSpy();

    waitsFor(function() {
      return callback.callCount > 0;
    }, 500);

    runs(function() {
      expect(callback.mostRecentCall.args[0].hello).toEqual('world');
    });

    Ground.request('somemethod').then(callback);
  });

  it('should route method calls', function() {
    app.use(Ground.Router(app));
    
    app.method('test', function (req, res) {
      res.send(42);
    });

    app.listen();

    var callback = jasmine.createSpy();

    waitsFor(function() {
      return callback.callCount > 0;
    }, 500);

    runs(function() {
      expect(callback.mostRecentCall.args[0]).toEqual(42);
    });

    Ground.request('test').then(callback);
  });
});