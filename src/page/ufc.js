(function(window) {
    'use strict';

    define([ 'mvc/item-view', 'app' ], function(ItemView, App) {

        var display = function() {
            document.title = "Sqor | UFC";

            var view = new UfcView();
            App.mainContent.show(view);
        };

        var UfcView = ItemView.extend({
            tagName: 'div',
            className: 'page-ufc',
            templateName: 'ufc'
        });

        return {
            display: display
        };
    });
}(window));