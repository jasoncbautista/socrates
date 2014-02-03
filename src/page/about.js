(function(window) {
    'use strict';

    define([ 'mvc/item-view', 'app' ], function(ItemView, App) {

        var display = function() {
            document.title = "Sqor | About Us";

            var view = new AboutView();
            App.mainContent.show(view);
        };

        var AboutView = ItemView.extend({
            tagName: "div",
            className: "page page-about",
            templateName: "about"
        });

        return {
            display: display
        };
    });
}(window));
