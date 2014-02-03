(function(window) {
    'use strict';
    /**
     * Flash messages on screen (e.g., alerts, errors, etc)
     */

    define(['jquery'], function($) {

        var message = function(text) {
            showFlash(text, 'flash-message');
        };

        var success = function(text) {
            showFlash(text, 'flash-success');
        };

        var error = function(text) {
            showFlash(text, 'flash-error');
        };

        var showFlash = function(text, cssClass) {
            var $flash = $('<div class="flash"></div>').addClass(cssClass).text(text);
            $('.flash-container').append($flash);

            setTimeout(function() {
                hideFlash($flash);
            }, 3000);

            $flash.click(function() {
                hideFlash($flash);
            });
        };

        var hideFlash = function($flash) {
            $flash.fadeOut({
                duration: 400,
                complete: function() {
                    $flash.remove();
                }
            });
        };

        return {
            error: error,
            message: message,
            success: success
        };
    });

}(window));
