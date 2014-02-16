/*global define, chrome, Promise*/
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.Ground = factory();
  }
}(this, function() {

  var Request = (function() {
    function Request(options) {
      options = options || {};
      this.params = options.params;
      this.sender = options.sender;
      this.method = options.method;
    }
    // var _ = Request.prototype;
    return Request;
  }());

  var Response = (function() {
    function Response(options) {
      options = options || {};
      var callback = options.callback;
      var isSent = false;

      this.send = function(data) {
        if (isSent) {
          throw new Error('already sent');
        }
        isSent = true;
        callback(data);
      };
    }
    // var _ = Response.prototype;
    return Response;
  }());

  var Router = (function() {

    function Router(app) {
      var routes = {};
      app.method = function(name, handler) {
        addRoute(routes, name, handler);
      };

      return function(req, res) {
        var handlers = routes[req.method];
        if (handlers) {
          return runMiddleware(handlers, req, res);
        }
      };
    }

    function addRoute(routes, name, handler) {
      if (!routes[name]) {
        routes[name] = [];
      }
      routes[name].push(handler);
    }

    return Router;
  }());


  function Ground() {
    this.middleware = [];
    this.routes = {};
  }
  var _ = Ground.prototype;

  _.use = function use(mw) {
    this.middleware.push(mw);
  };

  _.method = function method(route, callback) {
    if (!this.routes[route]) {
      this.routes[route] = [];
    }
    this.routes[route].push(callback);
  };

  _.listen = function listen() {
    chrome.runtime.onMessage.addListener(onMessage.bind(this));
  };

  _.dispatchMessage = function(methodName, request, sender, sendResponse) {
    dispatchMessage(this, methodName, request, sender, sendResponse);
  };

  Ground.Router = Router;

  Ground.request = function(methodName) {
    var p = new Promise(function(resolve, reject) {
      chrome.runtime.sendMessage({
        __method__: methodName
      }, function(response) {
        resolve(response);
      });
    });
    return p;
  };

  function onMessage(request, sender, sendResponse) {
    var methodName = getMethodName(request);
    dispatchMessage(this, methodName, request, sender, sendResponse);
    return true;
  }

  function getMethodName(request) {
    return request.__method__;
  }

  function dispatchMessage(self, methodName, request, sender, sendResponse) {
    //TODO
    var req = new Request({
      params: request,
      sender: sender,
      method: methodName
    });

    var res = new Response({
      callback: sendResponse
    });

    runMiddleware(self.middleware, req, res)
      .then(function() {
        //TODO
      });
  }

  function runMiddleware(middleware, req, res) {
    var q = new Promise(function(resolve, reject) {
      resolve();
    });
    for (var i = 0; i < middleware.length; i++) {
      q = q.then(middleware[i].bind(null, req, res));
    }
    return q;
  }

  return Ground;
}));