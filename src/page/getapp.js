(function(window) {
    'use strict';

    define([ 'mvc/item-view', 'app' ], function(ItemView, App) {

        var display = function() {
            document.title = "Sqor | Get Mobile Application";
            
            var view = new GetAppView();
            App.mainContent.show(view);
        };

        var GetAppView = ItemView.extend({
            tagName: "div",
            className: "page page-getapp",
            templateName: "getapp"
        });

        return {
            display: display
        };
    });
}(window));
