/*global spyOn, beforeEach, chrome, Ground, describe, it, expect*/

// describe('Something', function() {
//     it('shoult do something', function() {
//         expect(1).toEqual(2);
//     });
// });



describe('Ground server', function() {
    var app;

    beforeEach(function () {
        app = new Ground();
    });

    it('should listen on messages', function() {
        spyOn(chrome.runtime.onMessage, 'addListener');
        app.listen();
        expect(chrome.runtime.onMessage.addListener)
            .toHaveBeenCalled();
    });
});