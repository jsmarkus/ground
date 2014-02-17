(function() {
  var _handler;


  window.chrome = {
    runtime: {
      sendMessage: function(request, callback) {
        var sender = {
          id: 'fakeid'
        };
        _handler(request, sender, function(response) {
          callback(response);
        });
        console.log('message sent', request, sender);
      },
      onMessage: {
        addListener: function(handler) {
          _handler = handler;
          console.log('added listener', handler);
        }
      }
    }
  };
}());