/*global Ground*/

Ground.request('test')
    .then(function(res) {
        console.log('Response from the background:', res);
    });