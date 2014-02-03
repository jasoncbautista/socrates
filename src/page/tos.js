(function(window) {
    'use strict';

    define([ 'mvc/item-view', 'app' ], function(ItemView, App) {

        var display = function() {
            document.title = "Sqor | Terms of Service";

            var view = new TosView();
            App.mainContent.show(view);
        };

        var TosView = ItemView.extend({
            tagName: "div",
            className: "page page-tos legal",
            templateName: "tos"
        });

        return {
            display: display
        };
    });
}(window));
