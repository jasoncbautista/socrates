(function(window) {
    'use strict';

    define([ 'mvc/item-view', 'app' ], function(ItemView, App) {

        var display = function() {
            document.title = "Sqor | Support";

            var view = new SupportView();
            App.mainContent.show(view);
        };

        var SupportView = ItemView.extend({
            tagName: "div",
            className: "page page-support",
            templateName: "support"
        });

        return {
            display: display
        };
    });
}(window));
